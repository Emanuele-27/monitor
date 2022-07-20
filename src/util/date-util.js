export function getLastDayOfMonth(date) {
    date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getFirstDayOfMonth(date) {
    date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getFirstDayOfWeek(date, locale) {
    let dayName = new Date(date).toLocaleString(locale, { weekday: "short" });
    return aggiungiGiorni(new Date(date), -daysLeftToMonday(dayName));
}
export function getLastDayOfWeek(date, locale) {
    let dayName = new Date(date).toLocaleString(locale, { weekday: "short" });
    return aggiungiGiorni(new Date(date), (6 -daysLeftToMonday(dayName)));
}

function daysLeftToMonday(dayName) {
    switch (dayName) {
        case 'mar':
            return 1;
        case 'mer':
            return 2;
        case 'gio':
            return 3;
        case 'ven':
            return 4;
        case 'sab':
            return 5;
        case 'dom':
            return 6;
        default:
            return 0;
    }
}

export function aggiungiMesi(date, mesi) {
    return new Date(date.setMonth(date.getMonth() + mesi));
}

export function aggiungiGiorni(date, giorni) {
    return new Date(date.setDate(date.getDate() + giorni))
}

export function formatDateTime(locale, date) {
    return new Date(date).toLocaleString(locale).replace(',', '');
}