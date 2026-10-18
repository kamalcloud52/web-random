// js/utils.js

// Format ke Rupiah
window.formatRupiah = (number) => {
    return 'Rp. ' + number.toLocaleString('id-ID');
};

// Format ISO Date ke tampilan cantik (Contoh: 2026-10-08 -> 08 Okt 2026)
window.formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Format input angka dengan titik (5000 -> 5.000)
window.formatInputRibuan = function(e) {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits === '') {
        e.target.value = '';
        // Update state Alpine jika elemen ini terikat x-model
        if (e.target._x_model) e.target._x_model.set('');
        return;
    }
    digits = digits.replace(/^0+(?=\d)/, '');
    e.target.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    if (e.target._x_model) e.target._x_model.set(e.target.value);
};
