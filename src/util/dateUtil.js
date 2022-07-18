export function getLastDayOfMonth(date){
    date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getFirstDayOfMonth(date){
    date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth(), 1);
}