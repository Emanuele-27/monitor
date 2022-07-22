// export function isAlphaNumeric(key){
//     return key.match(/[a-zA-Z0-9]{1}/);
// }

export function removeSpecialChars(string){
    return string.replace(/(\W|_)/g, '');
}

export function removeNumbers(string){
    return string.replace(/[0-9]/g, '');
}

export function replaceUnderscore(string){
    return string.replaceAll('_', ' ').trim();
}

export function splitCamelCase(string){
    return string.split(/(?=[A-Z])/).reduce((prev, current) => prev + " " + current)
}

export function capitalizeFirstLetter(string){
    return string.at(0).toUpperCase() + string.substring(1)
}