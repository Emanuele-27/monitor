import React from "react";
import "./elenco.css";

import { formatEsito, replaceUnderscore } from 'model/tuttiIStati';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { localeIT } from 'util/util';

export default function ElencoTable(props) {

    const onPage = (event) => {
        props.setLazyParams(event);
    };

    const onSort = (event) => {
        props.setLazyParams(event);
    };

    const columnIUVCodContesto = (rowData) => {
        return rowData.iuv + ' - ' + rowData.codiceContesto;
    };

    const columnPagatoreVersante = (rowData) => {
        return rowData.idPagatore + ' - ' + rowData.idVersante;
    };

    const columnImporto = (rowData) => {
        return rowData.importo.toLocaleString(localeIT, {
            style: 'currency',
            currency: 'EUR',
        });
    };

    const columnDataRichiesta = (rowData) => {
        if (rowData.dataRichiesta)
            return new Date(rowData.dataRichiesta).toLocaleString(localeIT);
        return '';
    };

    const columnDataRicevuta = (rowData) => {
        if (rowData.dataRicevuta)
            return new Date(rowData.dataRicevuta).toLocaleString(localeIT).replace(',', '');
        return '';
    };

    const columnStato = (rowData) => {
        if (rowData.esitoPagamento)
            return formatEsito(rowData.esitoPagamento);
        else if (rowData.statoPagamento)
            return replaceUnderscore(rowData.statoPagamento);
        return '';
    };

    const columnOpzioni = (rowData) => {
        return (<div id="opzioni-column">
            <span title="Visualizza dettaglio"><i className="pi pi-search"></i></span>
            {renderAltreOpzioni(rowData.statoPagamento, rowData.iuv)}
        </div>);
    };

    // Se stato non è valido non renderizza le altre due opzioni
    // altrimenti le renderizza, se iuv non inizia con RF saranno disabled
    const renderAltreOpzioni = (stato, iuv) => {
        if (isStatoValido(stato)) {
            if (isIuvRF(iuv))
                return <><span title="Aggiorna stato"><i className="pi pi-file-o"></i></span>
                    <span title="Chiedi ricevuta"><i className="pi pi-download"></i></span></>
            else
                return <><span title="Aggiorna stato" disabled><i className="pi pi-file-o"></i></span>
                    <span title="Chiedi ricevuta" disabled><i className="pi pi-download"></i></span></>
        }
        return <></>
    }

    const isIuvRF = (iuv) => {
        return iuv && iuv.startsWith('RF');
    }

    // Stato valido se non è uno tra questi
    const isStatoValido = (stato) => {
        return !['RT_ACCETTATA_PA', 'RPT_RIFIUTATA_NODO', 'RPT_RIFIUTATA_PSP', 'RPT_ERRORE_INVIO_A_PSP', 'RPT_ANNULLATA',
            'RPT_NON_ATTIVA'].includes(stato);
    }

    return (
        <div className="container-fluid" style={{ width: "85%" }}>
            <DataTable id="elenco-table" lazy showGridlines stripedRows value={props.flussiList} rows={10} rowsPerPageOptions={[10, 25, 50]} responsiveLayout="scroll"
                header={"Numero Transazioni: " + props.totalRecords} footer={"Numero Transazioni: " + props.totalRecords} totalRecords={props.totalRecords}
                first={props.lazyParams.first} onPage={onPage} paginator paginatorPosition="bottom" style={{ paddingTop: "2rem" }} emptyMessage="Nessun elemento presente"
                removableSort onSort={onSort} sortField={props.lazyParams.sortField} sortOrder={props.lazyParams.sortOrder}>
                <Column header="IUV - Codice Contesto" body={columnIUVCodContesto} />
                <Column field="area" header="Area" />
                <Column field="servizio" header="Categoria" />
                <Column sortable field="dataRichiesta" header="Data Richiesta" body={columnDataRichiesta} />
                <Column sortable field="dataRicevuta" header="Data Ricevuta" body={columnDataRicevuta} />
                <Column header="Pagatore - Versante" body={columnPagatoreVersante} />
                <Column header="Importo" body={columnImporto} />
                <Column header="Stato" body={columnStato} />
                <Column header="Opzioni" body={columnOpzioni} style={{ width: "6%" }} />
                {/* TO DO Opzioni, Opzioni comuni */}
                {/* <Column header="Opzioni" body={columnPagatoreVersante}  />
                <Column header="Opzioni Comuni" body={columnPagatoreVersante}  /> */}
            </DataTable>
        </div>
    );
}