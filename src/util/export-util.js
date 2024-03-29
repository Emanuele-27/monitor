export const MimeTypes = {
    pd: 'application/pdf',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
}

export const saveAsFile = (data, fileName) => {
    import('file-saver').then(module => {
        if (module && module.default) {
            module.default.saveAs(data, fileName);
        }
    });
}

export const exportExcel = (list, fileName) => {
    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(list);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {
            type: MimeTypes.excel,
        });
        saveAsFile(data, fileName + '.xlsx');
    });
}