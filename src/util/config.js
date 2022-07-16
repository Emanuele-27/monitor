// Props generali
const configProps = {
    monitorHost: process.env.REACT_APP_MONITOR_HOST,
    monitorStatHost: process.env.REACT_APP_MONITOR_STAT_HOST,
    monitorAccHost: process.env.REACT_APP_MONITOR_ACC_HOST,
}

// Riconoscimento dominio da host
const suffissiDomini = {
    suffissoAdm: 'ADM',
    suffissoAe: 'AE'
};
const hostAdm = process.env.REACT_APP_HOST_ADM;
const hostAe = process.env.REACT_APP_HOST_AE;

let suffissoDom;
switch(window.location.hostname){
    case hostAdm:
        suffissoDom = suffissiDomini.suffissoAdm;
        break;
    case hostAe:
        suffissoDom = suffissiDomini.suffissoAe;
        break;
    default:
        suffissoDom = suffissiDomini.suffissoAdm;
        break

}

// Props per dominio
const propsDominio = {
    suffissoDom: suffissoDom,
    idDominio: process.env['REACT_APP_ID_DOMINIO_' + suffissoDom]
}

export { configProps, suffissiDomini, propsDominio };