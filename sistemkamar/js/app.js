// js/app.js
document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        // State Modal
        modals: { login: false, add: false, filter: false },
        admin: { authenticated: false, username: '', password: '' },
        selectedMember: null,
        
        // State Form
        form: { type: 'out', desc: '', amount: '', members: [] },
        
        // State Filter
        filters: { from: '', to: '', type: 'all', member: 'all' },
        
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

        // --- UI & LOGIC TAB BULAN ---
        get activeMonth() {
            return this.$store.kas.activeMonth;
        },
        
        changeMonth(month) {
            this.$store.kas.activeMonth = month;
        },

        openMemberProfile(member) {
            this.selectedMember = member;
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

        loginAdmin() {
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

        logoutAdmin() {
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

        submitTransaction() {
            if (!this.admin.authenticated) {
                this.modals.add = false;
                this.modals.login = true;
                return;
            }
            const amount = parseInt(this.form.amount.replace(/\./g, ''), 10);
            if (!this.form.desc || isNaN(amount) || amount <= 0) return this.showToast('Isi keterangan & nominal dengan benar');
            if (this.form.type === 'in' && this.form.members.length === 0) return this.showToast('Pilih minimal satu anggota');

            const newTx = {
                id: Date.now(),
                date: new Date().toISOString().slice(0, 10),
                type: this.form.type,
                amount: amount,
                desc: this.form.desc,
                members: this.form.type === 'in' ? [...this.form.members] : []
            };

            // Panggil fungsi dari Store (store.js)
            this.$store.kas.addTransaction(newTx);

            this.closeAddModal();
            this.showToast('Transaksi berhasil ditambahkan');
        },

        closeAddModal() {
            this.modals.add = false;
            // Reset form setelah animasi tutup selesai (300ms)
            setTimeout(() => {
                this.form = { type: 'out', desc: '', amount: '', members: [] };
            }, 300); 
        },

        // --- LOGIC FILTER (COMPUTED PROPERTY) ---
        get filteredTransactions() {
            return this.$store.kas.transactions.filter(tx => {
                let ok = true;
                if (this.filters.from && tx.date < this.filters.from) ok = false;
                if (this.filters.to && tx.date > this.filters.to) ok = false;
                if (this.filters.type !== 'all' && tx.type !== this.filters.type) ok = false;
                
                // Anggota hanya dicek jika jenisnya bukan pengeluaran
                if (this.filters.type !== 'out' && this.filters.member !== 'all') {
                    if (!tx.members || !tx.members.includes(this.filters.member)) ok = false;
                }
                return ok;
            });
        },

        applyFilter() {
            this.modals.filter = false;
            this.showToast(`Filter diterapkan — ${this.filteredTransactions.length} transaksi ditampilkan`);
        },

        resetFilter() {
            this.filters = { from: '', to: '', type: 'all', member: 'all' };
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
