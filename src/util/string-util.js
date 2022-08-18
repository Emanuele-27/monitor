export const removeSpecialChars = str => str.replace(/(\W|_)/g, '');

export const removeNumbers = str => str.replace(/[0-9]/g, '');

export const replaceUnderscore = str => str.replaceAll('_', ' ').trim();

export const splitCamelCase = str => str.split(/(?=[A-Z])/).reduce((prev, current) => prev + " " + current);

export const capitalizeFirstLetter = str => str.at(0).toUpperCase() + str.substring(1);

export const isIuvRF = iuv => iuv && iuv.startsWith('RF');

export const formatEsito = str => {
    if (str.includes('PAGAMENTO'))
        str = str.slice(str.indexOf('PAGAMENTO') + 9);
    return replaceUnderscore(str);
}