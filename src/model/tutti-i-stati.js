const esitiPagamento = [
    { name: 'PAGAMENTO_ESEGUITO', value: 0 },
    { name: 'PAGAMENTO_NON_ESEGUITO', value: 1 },
    { name: 'PAGAMENTO_PARZIALMENTE_ESEGUITO', value: 2 },
    { name: 'DECORRENZA_TERMINI', value: 3 },
    { name: 'DECORRENZA_TERMINI_PARZIALE', value: 4 }
];

const statiPagamento = [
    'RPT_ATTIVATA',
    'RPT_ERRORE_INVIO_A_NODO',
    'RPT_INVIO_A_NODO_FALLITO',
    'RPT_RIFIUTATA_PSP',
    'RPT_ACCETTATA_PSP',
    'RPT_ERRORE_INVIO_A_PSP',
    'RPT_INVIATA_A_PSP',
    'RPT_DECORSI_TERMINI',
    'RTP_ANNULLATA',
    'RT_RICEVUTA_NODO',
    'RT_RIFIUTATA_NODO',
    'RT_ACCETTATA_NODO',
    'RT_ACCETTATA_PA',
    'RT_RIFIUTATA_PA',
    'RT_ESITO_SCONOSCIUTO_PA'
]

function formatEsito(string){
    if(string.includes('PAGAMENTO'))
        string = string.slice(string.indexOf('PAGAMENTO') + 9);
    return replaceUnderscore(string);
}

function replaceUnderscore(string){
    return string.replaceAll('_', ' ').trim();
}

export { esitiPagamento, statiPagamento, formatEsito, replaceUnderscore}