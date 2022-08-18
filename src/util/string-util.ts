export const removeSpecialChars = (str: string) => str.replace(/(\W|_)/g, '');

export const removeNumbers = (str: string) => str.replace(/[0-9]/g, '');

export const replaceUnderscore = (str: string) => str.replaceAll('_', ' ').trim();

export const splitCamelCase = (str: string) => str.split(/(?=[A-Z])/).reduce((prev, current) => prev + " " + current);

export const capitalizeFirstLetter = (str: string) => str.at(0)!.toUpperCase() + str.substring(1);

export const isIuvRF = (iuv: string) => iuv && iuv.startsWith('RF');

export const formatEsito = (str: string) => {
    if (str.includes('PAGAMENTO'))
        str = str.slice(str.indexOf('PAGAMENTO') + 9);
    return replaceUnderscore(str);
}