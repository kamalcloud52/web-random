// js/app.js
document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        // State Modal
        modals: { add: false, filter: false },
        
        // State Form
        form: { type: 'out', desc: '', amount: '', members: [] },
        
        // State Filter
        filters: { from: '', to: '', type: 'all', member: 'all' },
        
        // State Toast
        toast: { show: false, message: '' },

        // State Drag
        sheetTop: 340,
        isDragging: false,
        startY: 0,
        startTop: 340,
        headerHeight: 340,

        // State Indikator Tab
        indicatorStyle: 'transform: translateX(0px); width: 0px;',

        // Lifecycle: Berjalan otomatis saat halaman dimuat
        init() {
            this.$nextTick(() => {
                // Hitung tinggi header untuk posisi awal sheet riwayat
                this.headerHeight = document.getElementById('headerArea').offsetHeight;
                this.sheetTop = this.headerHeight;
                
                // Pantau perubahan bulan untuk animasi garis bawah tab
                this.$watch('$store.kas.activeMonth', () => {
                    this.$nextTick(() => this.moveTabIndicator());
                });
                
                this.moveTabIndicator();
                
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
        moveTabIndicator() {
            const activeTab = document.getElementById(`tab-${this.$store.kas.activeMonth}`);
            const container = document.getElementById('monthTabs');
            const indicator = document.getElementById('tabIndicator');
            
            if (activeTab && container && indicator) {
                const left = activeTab.offsetLeft;
                const width = activeTab.offsetWidth;
                this.indicatorStyle = `transform: translateX(${left}px); width: ${width}px;`;
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
            const amount = parseInt(this.form.amount.replace(/\./g, ''), 10);
            if (!this.form.desc || isNaN(amount) || amount <= 0) return this.showToast('Isi keterangan & nominal dengan benar');
            if (this.form.type === 'in' && this.form.members.length === 0) return this.showToast('Pilih minimal satu anggota');

            const newTx = {
                id: Date.now(),
                date: new Date().toISOString().slice(0, 10),
                type: this.form.type,
                amount: amount,
                desc: this.form.desc,
                members: this.form.members
            };

            // Panggil fungsi dari Store
            this.$store.kas.addTransaction(newTx);

            this.closeAddModal();
            this.showToast('Transaksi berhasil ditambahkan');
        },
        closeAddModal() {
            this.modals.add = false;
            setTimeout(() => {
                this.form = { type: 'out', desc: '', amount: '', members: [] };
            }, 300); // Reset setelah animasi tutup selesai
        },

        // --- LOGIC FILTER (COMPUTED PROPERTY) ---
        get filteredTransactions() {
            return this.$store.kas.transactions.filter(tx => {
                let ok = true;
                if (this.filters.from && tx.date < this.filters.from) ok = false;
                if (this.filters.to && tx.date > this.filters.to) ok = false;
                if (this.filters.type !== 'all' && tx.type !== this.filters.type) ok = false;
                
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
            this.toast.message = message;
            this.toast.show = true;
            setTimeout(() => { this.toast.show = false; }, 2000);
        }
    }));
});
