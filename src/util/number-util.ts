import { localeIT } from "./util";

// xx.xxx,xx €
export const formatEuro = (imp: number) => imp.toLocaleString(localeIT, {
    style: 'currency',
    currency: 'EUR',
});