// js/store.js
document.addEventListener('alpine:init', () => {
    Alpine.store('kas', {
        openingBalance: 100000,
        members: ['Ni\'am', 'Fajar', 'Nazim', 'Ahsan', 'Kazul'],
        memberProfiles: {},
        activeMonth: '2026-10',
        categories: ['Iuran', 'Belanja', 'Perlengkapan', 'Perbaikan', 'Lainnya'],
        
        // Data Dummy Awal
        transactions: [
            { id: 1, date: '2026-10-08', type: 'out', amount: 20000, desc: 'Beli galon', category: 'Belanja', members: [] },
            { id: 2, date: '2026-10-07', type: 'in', amount: 40000, desc: 'Iuran & utang', category: 'Iuran', members: ['Fajar'] }
        ],

        get balance() {
            return this.transactions.reduce((balance, tx) =>
                balance + (tx.type === 'in' ? Number(tx.amount) : -Number(tx.amount)), this.openingBalance);
        },

        // Fungsi Mutasi Data
        addTransaction(tx) {
            this.transactions.unshift(tx);
        },

        updateTransaction(updated) {
            const index = this.transactions.findIndex(tx => String(tx.id) === String(updated.id));
            if (index >= 0) this.transactions.splice(index, 1, updated);
        },

        deleteTransaction(id) {
            this.transactions = this.transactions.filter(tx => String(tx.id) !== String(id));
        }
    });
});
