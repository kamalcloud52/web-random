// js/app.js
document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        // State Modal
        modals: { login: false, add: false, filter: false, members: false },
        admin: { authenticated: false, username: '', password: '' },
        memberForm: { id: '', name: '', room: '' },
        editingMemberName: null,
        connection: { mode: KasApi.mode, status: KasApi.isLive() ? 'loading' : 'demo', message: '' },
        selectedMember: null,
        
        // State Form
        form: { type: 'out', desc: '', amount: '', category: 'Lainnya', members: [] },
        editingTransactionId: null,
        
        // State Filter
        filters: { from: '', to: '', type: 'all', member: 'all', category: 'all', search: '' },
        filterDraft: { from: '', to: '', type: 'all', member: 'all', category: 'all', search: '' },
        
        // State Toast
        toast: { show: false, message: '' },
        toastTimer: null,

        // State Drag (Bottom Sheet)
        sheetTop: 340,
        isDragging: false,
        startY: 0,
        startTop: 340,
        headerHeight: 340,

        // State Indikator Tab Bulan
        indicatorStyle: 'transform: translateX(0px); width: 0px;',

        // Lifecycle: Berjalan otomatis saat halaman pertama kali dimuat
        init() {
            if (KasApi.isLive()) {
                this.$store.kas.openingBalance = 0;
                this.$store.kas.transactions = [];
                this.$store.kas.members = [];
                this.loadRemoteData();
                if (KasApi.mode === 'cloudflare') {
                    KasApi.getSession().then(session => {
                        this.admin.authenticated = Boolean(session.authenticated);
                    }).catch(() => { this.admin.authenticated = false; });
                }
            }
            this.$nextTick(() => {
                // 1. Hitung tinggi header untuk posisi awal sheet riwayat
                this.headerHeight = document.getElementById('headerArea').offsetHeight;
                this.sheetTop = this.headerHeight;
                
                // 2. Pantau perubahan bulan untuk animasi garis bawah tab
                this.$watch('$store.kas.activeMonth', () => {
                    this.$nextTick(() => this.moveTabIndicator());
                });
                
                // 3. Set posisi indikator pertama kali
                this.moveTabIndicator();

                // 4. FIX INDICATOR: Paksa ukur ulang setelah font (Plus Jakarta Sans) selesai diunduh
                // Karena font web seringkali mengubah lebar teks setelah render pertama
                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(() => {
                        this.moveTabIndicator();
                    });
                }

                // 5. Update ukuran jika layar di-resize
                window.addEventListener('resize', () => {
                    this.headerHeight = document.getElementById('headerArea').offsetHeight;
                    this.moveTabIndicator();
                });
            });
        },

        normalizeTransaction(tx) {
            return { ...tx, desc: tx.desc || tx.description || '', category: tx.category || 'Lainnya', members: Array.isArray(tx.members) ? tx.members : [] };
        },

        async loadRemoteData() {
            this.connection.status = 'loading';
            try {
                const response = await KasApi.getBootstrap();
                const data = response.data || response;
                this.$store.kas.openingBalance = Number(data.openingBalance || 0);
                this.$store.kas.transactions = (data.transactions || []).map(tx => this.normalizeTransaction(tx));
                this.$store.kas.members = (data.members || []).map(member => typeof member === 'string' ? member : member.name);
                this.$store.kas.memberProfiles = Object.fromEntries((data.members || []).filter(member => typeof member !== 'string').map(member => [member.name, member]));
                const months = this.$store.kas.transactions.map(tx => tx.date.slice(0, 7)).sort();
                if (months.length) this.$store.kas.activeMonth = months[months.length - 1];
                this.$store.kas.categories = [...new Set(['Iuran', 'Belanja', 'Perlengkapan', 'Perbaikan', 'Lainnya', ...this.$store.kas.transactions.map(tx => tx.category)])];
                this.connection.status = 'ready';
                this.connection.message = '';
                this.$nextTick(() => this.moveTabIndicator());
            } catch (error) {
                this.connection.status = 'error';
                this.connection.message = error.message;
                this.showToast(`Gagal memuat data: ${error.message}`);
            }
        },

        // --- UI & LOGIC TAB BULAN ---
        get activeMonth() {
            return this.$store.kas.activeMonth;
        },
        
        changeMonth(month) {
            this.$store.kas.activeMonth = month;
        },

        get availableMonths() {
            const months = new Set(this.$store.kas.transactions.map(tx => tx.date.slice(0, 7)));
            months.add(this.$store.kas.activeMonth);
            return [...months].sort((a, b) => b.localeCompare(a));
        },

        get monthlySummary() {
            const transactions = this.$store.kas.transactions.filter(tx => tx.date.slice(0, 7) === this.activeMonth);
            return transactions.reduce((summary, tx) => {
                summary[tx.type === 'in' ? 'income' : 'expense'] += Number(tx.amount || 0);
                summary.count += 1;
                return summary;
            }, { income: 0, expense: 0, count: 0 });
        },

        openMemberProfile(member) {
            this.selectedMember = member;
        },

        get selectedMemberProfile() {
            return this.selectedMember ? (this.$store.kas.memberProfiles[this.selectedMember] || {}) : {};
        },

        editMember(member = null) {
            if (!this.admin.authenticated) return this.showToast('Login admin diperlukan untuk mengelola anggota');
            const profile = member ? (this.$store.kas.memberProfiles[member] || {}) : {};
            this.memberForm = { id: profile.id || '', name: member || '', room: profile.room || '' };
            this.editingMemberName = member;
            this.modals.members = true;
        },

        async saveMember() {
            const name = this.memberForm.name.trim();
            if (!name) return this.showToast('Nama anggota wajib diisi');
            if (this.$store.kas.members.some(item => item.toLowerCase() === name.toLowerCase() && item !== this.editingMemberName)) {
                return this.showToast('Nama anggota sudah terdaftar');
            }
            try {
                const input = { ...this.memberForm, name };
                const saved = KasApi.isLive() ? (await KasApi.saveMember(input)).member : { ...input, active: true };
                const oldName = this.editingMemberName;
                if (oldName && oldName !== name) this.$store.kas.members = this.$store.kas.members.map(item => item === oldName ? name : item);
                else if (!oldName) this.$store.kas.members.push(name);
                if (oldName && oldName !== name) {
                    this.$store.kas.transactions = this.$store.kas.transactions.map(tx => ({
                        ...tx,
                        members: (tx.members || []).map(item => item === oldName ? name : item)
                    }));
                }
                if (oldName && oldName !== name) delete this.$store.kas.memberProfiles[oldName];
                this.$store.kas.memberProfiles[name] = saved;
                this.editingMemberName = null;
                this.memberForm = { id: '', name: '', room: '' };
                this.modals.members = false;
                this.showToast('Data anggota berhasil disimpan');
            } catch (error) {
                this.showToast(`Gagal menyimpan anggota: ${error.message}`);
            }
        },

        async archiveMember(member) {
            const profile = this.$store.kas.memberProfiles[member] || {};
            if (!window.confirm(`Arsipkan anggota ${member}? Riwayat transaksinya tetap disimpan.`)) return;
            try {
                if (KasApi.isLive()) await KasApi.archiveMember(profile.id);
                this.$store.kas.members = this.$store.kas.members.filter(item => item !== member);
                delete this.$store.kas.memberProfiles[member];
                this.showToast('Anggota diarsipkan; riwayat tetap tersimpan');
            } catch (error) {
                this.showToast(`Gagal mengarsipkan anggota: ${error.message}`);
            }
        },

        get selectedMemberStats() {
            if (!this.selectedMember) return { total: 0, count: 0, recent: [] };
            const contributions = this.$store.kas.transactions.filter(tx =>
                tx.type === 'in' && tx.members && tx.members.includes(this.selectedMember)
            );
            return {
                total: contributions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
                count: contributions.length,
                recent: contributions.slice(0, 3)
            };
        },

        requestAddTransaction() {
            if (this.admin.authenticated) {
                this.modals.add = true;
                return;
            }
            this.modals.login = true;
        },

        async loginAdmin() {
            if (KasApi.mode === 'cloudflare') {
                if (!this.admin.password) return this.showToast('Masukkan kata sandi admin');
                try {
                    await KasApi.login(this.admin.password);
                    this.admin.authenticated = true;
                    this.admin.password = '';
                    this.modals.login = false;
                    this.modals.add = true;
                    this.showToast('Login admin berhasil');
                } catch (error) {
                    this.admin.password = '';
                    this.showToast(`Login gagal: ${error.message}`);
                }
                return;
            }
            if (KasApi.isLive()) {
                try {
                    const session = await KasApi.getSession();
                    if (!session.signedIn) return this.showToast('Masuk ke akun Google Anda terlebih dahulu');
                    if (!session.isAdmin) return this.showToast('Akun Google ini belum terdaftar sebagai admin');
                    this.admin.authenticated = true;
                    this.admin.username = session.email;
                    this.modals.login = false;
                    this.modals.add = true;
                    this.showToast('Akses admin terverifikasi');
                } catch (error) {
                    this.showToast(`Login gagal: ${error.message}`);
                }
                return;
            }
            const username = this.admin.username.trim();
            const password = this.admin.password;
            if (!username || !password) {
                this.showToast('Masukkan username dan kata sandi admin');
                return;
            }

            // Prototipe frontend: validasi ini akan diganti autentikasi Apps Script.
            this.admin.authenticated = true;
            this.admin.username = username;
            this.admin.password = '';
            this.modals.login = false;
            this.modals.add = true;
            this.showToast('Login admin berhasil');
        },

        async logoutAdmin() {
            if (KasApi.mode === 'cloudflare') {
                try { await KasApi.logout(); } catch (error) { this.showToast(`Gagal keluar: ${error.message}`); }
            }
            this.admin.authenticated = false;
            this.admin.username = '';
            this.modals.add = false;
            this.showToast('Anda telah keluar dari sesi admin');
        },

        moveTabIndicator() {
            const activeTab = document.getElementById(`tab-${this.$store.kas.activeMonth}`);
            const container = document.getElementById('monthTabs');
            const indicator = document.getElementById('tabIndicator');
            
            if (activeTab && container && indicator) {
                // FIX ALIGNMENT: Gunakan getBoundingClientRect agar tidak terpengaruh margin/padding parent
                const containerRect = container.getBoundingClientRect();
                const tabRect = activeTab.getBoundingClientRect();
                
                // Hitung jarak dari kiri container ke kiri tab
                const left = tabRect.left - containerRect.left;

                // Terapkan translateX dan lebar yang presisi
                this.indicatorStyle = `transform: translateX(${left}px); width: ${tabRect.width}px;`;
            }
        },

        // --- LOGIC DRAG BOTTOM SHEET ---
        startDrag(e) {
            this.isDragging = true;
            this.startY = e.clientY;
            this.startTop = this.sheetTop;
            e.target.setPointerCapture(e.pointerId);

            const onPointerMove = (ev) => {
                if (!this.isDragging) return;
                let newTop = this.startTop + (ev.clientY - this.startY);
                if (newTop < 0) newTop = 0;
                if (newTop > this.headerHeight) newTop = this.headerHeight;
                this.sheetTop = newTop;
            };

            const onPointerUp = (ev) => {
                if (!this.isDragging) return;
                this.isDragging = false;
                e.target.releasePointerCapture(ev.pointerId);
                
                // Snap ke atas (0) atau bawah (headerHeight)
                const distToTop = Math.abs(this.sheetTop - 0);
                const distToBottom = Math.abs(this.sheetTop - this.headerHeight);
                this.sheetTop = distToTop < distToBottom ? 0 : this.headerHeight;

                document.removeEventListener('pointermove', onPointerMove);
                document.removeEventListener('pointerup', onPointerUp);
            };

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        },

        // --- LOGIC TAMBAH TRANSAKSI ---
        toggleAllMembers() {
            if (this.form.members.length === this.$store.kas.members.length) {
                this.form.members = [];
            } else {
                this.form.members = [...this.$store.kas.members];
            }
        },

        async submitTransaction() {
            if (!this.admin.authenticated) {
                this.modals.add = false;
                this.modals.login = true;
                return;
            }
            const amount = parseInt(this.form.amount.replace(/\./g, ''), 10);
            if (!this.form.desc || isNaN(amount) || amount <= 0) return this.showToast('Isi keterangan & nominal dengan benar');
            if (this.form.type === 'in' && this.form.members.length === 0) return this.showToast('Pilih minimal satu anggota');

            const existing = this.editingTransactionId
                ? this.$store.kas.transactions.find(tx => String(tx.id) === String(this.editingTransactionId))
                : null;
            const newTx = {
                id: existing ? existing.id : Date.now(),
                date: existing ? existing.date : localISODate(),
                type: this.form.type,
                amount: amount,
                desc: this.form.desc,
                category: this.form.category,
                members: this.form.type === 'in' ? [...this.form.members] : []
            };

            try {
                let saved = newTx;
                if (KasApi.isLive()) {
                    const response = await KasApi.saveTransaction({ ...newTx, description: newTx.desc });
                    saved = this.normalizeTransaction(response.transaction || newTx);
                }
                if (existing) this.$store.kas.updateTransaction(saved);
                else {
                    this.$store.kas.addTransaction(saved);
                    this.$store.kas.activeMonth = saved.date.slice(0, 7);
                }
                this.closeAddModal();
                this.showToast(existing ? 'Transaksi berhasil diperbarui' : 'Transaksi berhasil ditambahkan');
            } catch (error) {
                this.showToast(`Gagal menyimpan transaksi: ${error.message}`);
            }
        },

        editTransaction(tx) {
            if (!this.admin.authenticated) return this.showToast('Login admin diperlukan untuk mengubah transaksi');
            this.editingTransactionId = tx.id;
            this.form = { type: tx.type, desc: tx.desc, amount: Number(tx.amount).toLocaleString('id-ID'), category: tx.category || 'Lainnya', members: [...(tx.members || [])] };
            this.modals.add = true;
        },

        async deleteTransaction(tx) {
            if (!this.admin.authenticated) return this.showToast('Login admin diperlukan untuk menghapus transaksi');
            if (!window.confirm(`Hapus transaksi “${tx.desc}” sebesar ${formatRupiah(tx.amount)}?`)) return;
            try {
                if (KasApi.isLive()) await KasApi.deleteTransaction(tx.id);
                this.$store.kas.deleteTransaction(tx.id);
                this.showToast('Transaksi dihapus');
            } catch (error) {
                this.showToast(`Gagal menghapus transaksi: ${error.message}`);
            }
        },

        closeAddModal() {
            this.modals.add = false;
            // Reset form setelah transisi modal selesai.
            setTimeout(() => {
                this.form = { type: 'out', desc: '', amount: '', category: 'Lainnya', members: [] };
                this.editingTransactionId = null;
            }, 700); 
        },

        openFilters() {
            this.filterDraft = { ...this.filters };
            this.modals.filter = true;
        },

        // --- LOGIC FILTER (COMPUTED PROPERTY) ---
        get filteredTransactions() {
            return this.$store.kas.transactions.filter(tx => {
                let ok = true;
                if (tx.date.slice(0, 7) !== this.activeMonth) ok = false;
                if (this.filters.from && tx.date < this.filters.from) ok = false;
                if (this.filters.to && tx.date > this.filters.to) ok = false;
                if (this.filters.type !== 'all' && tx.type !== this.filters.type) ok = false;
                if (this.filters.category !== 'all' && (tx.category || 'Lainnya') !== this.filters.category) ok = false;
                if (this.filters.search && !`${tx.desc} ${tx.category || ''}`.toLowerCase().includes(this.filters.search.toLowerCase())) ok = false;
                
                // Anggota hanya dicek jika jenisnya bukan pengeluaran
                if (this.filters.type !== 'out' && this.filters.member !== 'all') {
                    if (!tx.members || !tx.members.includes(this.filters.member)) ok = false;
                }
                return ok;
            });
        },

        applyFilter() {
            if (this.filterDraft.from && this.filterDraft.to && this.filterDraft.from > this.filterDraft.to) {
                return this.showToast('Tanggal awal tidak boleh melewati tanggal akhir');
            }
            this.filters = { ...this.filterDraft };
            this.modals.filter = false;
            this.showToast(`Filter diterapkan — ${this.filteredTransactions.length} transaksi ditampilkan`);
        },

        resetFilter() {
            const defaults = { from: '', to: '', type: 'all', member: 'all', category: 'all', search: '' };
            this.filters = { ...defaults };
            this.filterDraft = { ...defaults };
        },

        // --- UTILITIES ---
        printPDF() {
            this.showToast('Menyiapkan dokumen cetak PDF...');
            setTimeout(() => window.print(), 500);
        },

        showToast(message) {
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toast.message = message;
            this.toast.show = true;
            this.toastTimer = setTimeout(() => {
                this.toast.show = false;
                this.toastTimer = null;
            }, 2600);
        }
    }));
});
