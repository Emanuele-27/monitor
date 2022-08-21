import { esitiPagamento, statiPagamento } from "model/tutti-i-stati";
import { formatEsito, replaceUnderscore } from "./string-util";

export const localeIT = 'it-IT';

export const localeDate = {
    firstDayOfWeek: 1,
    dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
    monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    today: 'Oggi',
    clear: 'Clear'
};

export const columnMapper = new Map([
    ['dataRichiesta', 'DATA_RICHIESTA'],
    ['dataRicevuta', 'DATA_RICEVUTA'],
    ['dataOraEvento', 'DATA_ORA_EVENTO'],
]);

export const sortMapper = new Map([
    [1, 'ASC'],
    [-1, 'DESC'],
]);

export const deleteEmptyValues = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (!obj[key])
            delete obj[key];
    });
    return obj;
};

// Nel dropdown di stato ci sono sia stati che esiti, in fase  
// di ricerca vengono distinti e valorizzati opportunamente
export const buildOptionsStatiEsiti = () => {
    const esitiOptions = esitiPagamento.map(esito => <option key={esito} value={esito}>{formatEsito(esito)}</option>);
    const statiOptions = statiPagamento.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => <option key={stato} value={stato}>{replaceUnderscore(stato)}</option>);
    return esitiOptions.concat(statiOptions);
};

// Costruisce option per le select di servizi e aree
export const buildServiziEAree = (serviziData, idDominio) => {
    const serviziDominioCorrente = serviziData.serviziList.filter(servizio => servizio.idDominio === idDominio);
    const serviziOpt = serviziDominioCorrente.map(servizio =>
        <option key={servizio.servizio} value={servizio.servizio}>{servizio.servizio + (servizio.denominazioneServizio ? ' ' + servizio.denominazioneServizio : '')}</option>);
    // Crea una lista di option dalla lista di aree univoche del set
    const areeOpt = Array.from(new Set(serviziDominioCorrente.map(s => s.area))).map(a => <option key={a} value={a}>{a}</option>);
    return {
        servizi: serviziOpt,
        aree: areeOpt,
    }
};