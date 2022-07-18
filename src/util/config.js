// Props generali
const configProps = {
    monitorHost: process.env.REACT_APP_MONITOR_HOST,
    monitorStatHost: process.env.REACT_APP_MONITOR_STAT_HOST,
    monitorAccHost: process.env.REACT_APP_MONITOR_ACC_HOST,
}

const suffissiDomini = {
    suffissoAdm: 'ADM',
    suffissoAe: 'AE',
    suffissoAer: 'AER',
    suffissoSogei: 'SOGEI'
};

const hostAdm = process.env['REACT_APP_HOST_' + suffissiDomini.suffissoAdm];
const hostAe = process.env['REACT_APP_HOST_' + suffissiDomini.suffissoAe];
const hostAer = process.env['REACT_APP_HOST_' + suffissiDomini.suffissoAer];
const hostSogei = process.env['REACT_APP_HOST_' + suffissiDomini.suffissoSogei];

let suffissoDom;

// Riconoscimento dominio da host
switch (window.location.hostname) {
    case hostAdm:
        suffissoDom = suffissiDomini.suffissoAdm;
        break;
    case hostAe:
        suffissoDom = suffissiDomini.suffissoAe;
        break;
    case hostAer:
        suffissoDom = suffissiDomini.suffissoAer;
        break;
    case hostSogei:
        suffissoDom = suffissiDomini.suffissoSogei;
        break;
    default:
        suffissoDom = suffissiDomini.suffissoAdm;
        break

}
// Props per dominio
const propsDominio = {
    suffissoDom: suffissoDom,
    idDominio: process.env['REACT_APP_ID_DOMINIO_' + suffissoDom],
    denominazione: process.env['REACT_APP_DENOMINAZIONE_PA_' + suffissoDom],
    provenienzaUrl: process.env['REACT_APP_PROVENIENZA_URL_' + suffissoDom],
    finestraTemporale: process.env['REACT_APP_FINESTRA_TEMPORALE_' + suffissoDom],
}

export { configProps, suffissiDomini, propsDominio };