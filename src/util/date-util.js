import { localeIT } from "./util";

export function lastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0);
}

export function firstDayOfMonth(year, month) {
    return new Date(year, month, 1);
}

export const daysToAddUntilMonday = (day) => {
    switch (day) {
        case 0:
            return 1;
        case 1:
            return 0;
        case 2:
            return 6;
        case 3:
            return 5;
        case 4:
            return 4;
        case 5:
            return 3;
        case 6:
            return 2;
        default:
            break;
    }
}

export function aggiungiMesi(date, mesi) {
    const datePiuMesi = new Date(date);
    datePiuMesi.setMonth(datePiuMesi.getMonth() + mesi);
    return datePiuMesi;
}

export function aggiungiGiorni(date, giorni) {
    const datePiuGiorni = new Date(date);
    datePiuGiorni.setDate(datePiuGiorni.getDate() + giorni);
    return datePiuGiorni;
}

// dd/MM/yyyy HH:mm:ss
export function formatDateTime(date) {
    return new Date(date).toLocaleString(localeIT).replace(',', '');
}

// dd/MM/yyyy
export function formatDate(date) {
    return new Date(date).toLocaleDateString(localeIT)
}

// yyyy-MM-dd
export function formatDateForInput(date) {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset * 60 * 1000))
    return date.toISOString().split('T')[0]
}

// yyyy-MM
export function formatMonth(date) {
    const dateParts = formatDateForInput(date).split('-');
    return dateParts[0] + '-' + dateParts[1];
}

export function calcolaDataPerFinestra(modalita) {
    if (modalita === 'mese')
        return formatMonth(new Date(Date.now()));
    else if (modalita === 'settimana')
        return getISOWeekDate(new Date(Date.now()));
}

export const transformFinestraToDates = (modalita, finestra) => {
    if (modalita === 'mese') {
        const date = new Date(finestra);
        const year = date.getFullYear();
        const month = date.getMonth();
        return [firstDayOfMonth(year, month), lastDayOfMonth(year, month)];
    } else if (modalita === 'settimana') {
        return getDatesFromISOWeekDate(finestra);
    }
}

export const getISOWeekDate = (date) => {
    const anno = date.getFullYear()
    // Primo giorno dell'anno
    const firstDayYear = new Date(anno, 0, 1);
    // Primo lunedi dell'anno, quindi prima settimana dell'anno
    const firstMondayYear = aggiungiGiorni(firstDayYear, daysToAddUntilMonday(firstDayYear.getDay()));
    // Se date è minore del primo lunedì dell'anno, allora appartiene all'ultima settimana dell'anno precedente
    if (firstMondayYear.getTime() >= date.getTime())
        return (anno - 1) + "-W52";
    // Imposta il giorno della settimana a domenica
    const firstWeekYear = aggiungiGiorni(firstMondayYear, 6);
    // Avanzando di settimana in settimana controlla se incontra date
    for (let hunter = firstWeekYear, weeks = 1; hunter.getFullYear() === anno; hunter = aggiungiGiorni(hunter, 7), weeks++)
        if (hunter.getTime() >= date.getTime())
            return anno + "-W" + (weeks > 9 ? weeks : "0" + weeks);
}

export const getDatesFromISOWeekDate = (weekDate) => {
    const parts = weekDate.split('-W');
    const firstDayYear = new Date(parts[0], 0, 1);
    const weeks = parts[1];
    // Primo lunedi dell'anno, quindi prima settimana dell'anno
    const firstMondayYear = aggiungiGiorni(firstDayYear, daysToAddUntilMonday(firstDayYear.getDay()))
    // Aggiungiamo al primo lunedì (n settimane - 1) in giorni per trovare il lunedì della settimana selezionata
    const monday = aggiungiGiorni(firstMondayYear, (weeks - 1) * 7)
    return [monday, aggiungiGiorni(monday, 6)];// Monday + 6 giorni = Sunday
}