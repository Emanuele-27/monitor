export function getLastDayOfMonth(date){
    date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getFirstDayOfMonth(date){
    date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function aggiungiMesi(date, mesi){
    return new Date(date.setMonth(date.getMonth() + mesi));
}

export function aggiungiGiorni(date, giorni){
    return new Date(date.setDate(date.getDate() + giorni))
}