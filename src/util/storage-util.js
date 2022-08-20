import { aggiungiGiorni } from "./date-util";

export class SessionStorage {
    static get(key) {
        const item = sessionStorage.getItem(key)
        return item ? JSON.parse(item) : null;
    }
    static set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}

export class LocalStorage {
    static get(key) {
        const item = localStorage.getItem(key);
        if (item) {
            const obj = JSON.parse(item);
            if (obj.expiry > new Date(Date.now())) {
                localStorage.removeItem(key);
                return null;
            }
            return obj.value;
        }
        return null;
    }
    static set(key, value) {
        const obj = { value, expiry: aggiungiGiorni(new Date(Date.now()), 7) }
        localStorage.setItem(key, JSON.stringify(obj));
    }
}

export const keys = {
    SERVIZI_AREE: 'servizi-aree',
    HOME_STATS: 'home-stats'
}