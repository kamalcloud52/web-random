// js/store.js
document.addEventListener('alpine:init', () => {
    Alpine.store('kas', {
        balance: 100000,
        members: ['Ni\'am', 'Fajar', 'Nazim', 'Ahsan', 'Kazul'],
        activeMonth: 'Oktober',
        
        // Data Dummy Awal
        transactions: [
            { id: 1, date: '2026-10-08', type: 'out', amount: 20000, desc: 'Beli galon', members: ['Ni\'am'] },
            { id: 2, date: '2026-10-07', type: 'in', amount: 40000, desc: 'Iuran & utang', members: ['Fajar'] }
        ],

        // Fungsi Mutasi Data
        addTransaction(tx) {
            this.transactions.unshift(tx);
            if (tx.type === 'out') {
                this.balance -= tx.amount;
            } else {
                this.balance += tx.amount;
            }
        }
    });
});
