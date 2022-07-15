// export function isAlphaNumeric(key){
//     return key.match(/[a-zA-Z0-9]{1}/);
// }

export function removeSpecialChars(string){
    return string.replace(/(\W|_)/g, '');
}