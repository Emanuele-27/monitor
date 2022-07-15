export const columnMapper = new Map([
    ['dataRichiesta', 'DATA_RICHIESTA'],
    ['dataRicevuta', 'DATA_RICEVUTA'],
]);

export const sortMapper = new Map([
    [1, 'ASC'],
    [-1, 'DESC'],
]);

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

export const acceptJson = 'application/json';
export const acceptLanguage = 'it';
export const localeIT = 'it-IT';