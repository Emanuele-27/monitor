const removeSpecialChars = str => str.replace(/(\W|_)/g, '');

const removeNumbers = str => str.replace(/[0-9]/g, '');

const replaceUnderscore = str => str.replaceAll('_', ' ').trim();

const splitCamelCase = str => str.split(/(?=[A-Z])/).reduce((prev, current) => prev + " " + current);

const capitalizeFirstLetter = str => str.at(0).toUpperCase() + str.substring(1);

export {removeSpecialChars, removeNumbers, replaceUnderscore, splitCamelCase, capitalizeFirstLetter};
