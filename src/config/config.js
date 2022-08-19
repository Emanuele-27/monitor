// Props generali
const configProps = {
    monitorHost: process.env.REACT_APP_MONITOR_HOST,
    monitorStatHost: process.env.REACT_APP_MONITOR_STAT_HOST,
    monitorAccHost: process.env.REACT_APP_MONITOR_ACC_HOST,
    auxHost: process.env.REACT_APP_AUX_HOST,
    advHost: process.env.REACT_APP_ADV_HOST,
}

// Inizio gestione riconoscimento dominio da url ******
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
// Fine gestione riconoscimento dominio da url ******

const dominioBase = process.env.REACT_APP_DOMINIO_BASE;
suffissoDom = dominioBase || suffissoDom;

// Props per dominio
const propsDominio = {
    suffissoDom,
    idDominio: process.env['REACT_APP_ID_DOMINIO_' + suffissoDom],
    denominazione: process.env['REACT_APP_DENOMINAZIONE_PA_' + suffissoDom],
    provenienzaUrl: process.env['REACT_APP_PROVENIENZA_URL_' + suffissoDom],
    finestraTemporale: process.env['REACT_APP_FINESTRA_TEMPORALE_' + suffissoDom],
    intervalloDate: process.env['REACT_APP_INTERVALLO_DATE_' + suffissoDom],
    intervalloFiltroDate: process.env['REACT_APP_INTERVALLO_FILTRO_DATE_' + suffissoDom],
    modalitaFinestra: process.env['REACT_APP_INTERVALLO_FINESTRA_TEMPORALE_' + suffissoDom],
    intervalloOre: process.env['REACT_APP_INTERVALLO_ORE_FASCIA_ORARIA_' + suffissoDom],
    avvisiEnabled: process.env['REACT_APP_AVVISI_ENABLE_' + suffissoDom],
    idIntermediarioPA: process.env['REACT_APP_ID_INTERMEDIARIO_PA_' + suffissoDom],
    idStazionePA: process.env['REACT_APP_ID_STAZIONE_PA_' + suffissoDom],
    pwdPA: process.env['REACT_APP_PWD_PA_' + suffissoDom],
    theme: process.env['REACT_APP_DEFAULT_THEME_' + suffissoDom],
}

export { configProps, suffissiDomini, propsDominio };