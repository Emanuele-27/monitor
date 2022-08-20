import { localeIT } from "./util";

// xx.xxx,xx €
export const formatEuro = imp => imp.toLocaleString(localeIT, {
    style: 'currency',
    currency: 'EUR',
});