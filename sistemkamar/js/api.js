/* Frontend gateway. Keep UI independent from the chosen data transport. */
window.KAS_CONFIG = window.KAS_CONFIG || { mode: 'demo' };

window.KasApi = (() => {
    const isLive = () => window.KAS_CONFIG.mode === 'apps-script'
        && typeof google !== 'undefined' && google.script && google.script.run;

    function call(functionName, ...args) {
        if (!isLive()) return Promise.reject(new Error('Apps Script API belum tersedia.'));
        return new Promise((resolve, reject) => {
            google.script.run
                .withSuccessHandler(resolve)
                .withFailureHandler(error => reject(new Error(error && error.message ? error.message : 'Permintaan ke server gagal.')))
                [functionName](...args);
        });
    }

    return {
        isLive,
        getSession: () => call('apiGetSession'),
        getBootstrap: () => call('apiGetBootstrap'),
        saveTransaction: transaction => call('apiSaveTransaction', transaction),
        deleteTransaction: id => call('apiDeleteTransaction', id),
        saveMember: member => call('apiSaveMember', member),
        archiveMember: id => call('apiArchiveMember', id)
    };
})();
