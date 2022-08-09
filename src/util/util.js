export const acceptJson = 'application/json';
export const acceptLanguage = 'it';
export const localeIT = 'it-IT';

export const columnMapper = new Map([
    ['dataRichiesta', 'DATA_RICHIESTA'],
    ['dataRicevuta', 'DATA_RICEVUTA'],
    ['dataOraEvento', 'DATA_ORA_EVENTO'],
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

export const deleteUndefinedValues = (obj) => {
    Object.keys(obj).forEach(key => {
        if (!obj[key])
            delete obj[key];
    });
    return obj;
};

export const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then(module => {
        if (module && module.default) {
            const data = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            });
            module.default.saveAs(data, fileName + '.xlsx');
        }
    });
}

export const exportExcel = (list, fileName) => {
    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(list);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, fileName);
    });
}

export const isIuvRF = (iuv) => {
    return iuv && iuv.startsWith('RF');
};