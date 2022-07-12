const esitiPagamento = [
    { label: 'PAGAMENTO_ESEGUITO', value: 0 },
    { label: 'PAGAMENTO_NON_ESEGUITO', value: 1 },
    { label: 'PAGAMENTO_PARZIALMENTE_ESEGUITO', value: 2 },
    { label: 'DECORRENZA_TERMINI', value: 3 },
    { label: 'DECORRENZA_TERMINI_PARZIALE', value: 4 }
];

const stati = [
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

export { esitiPagamento, stati }