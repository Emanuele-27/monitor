import React from "react";
import "./rpt-table.css";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { localeIT } from 'util/util';
import { formatDateTime } from "util/date-util";

export default function RptTable(props) {

    const onPage = (event) => {
        props.setLazyParams(event);
    };

    // Gestione date formattandole in dd/MM/yyy HH:mm:ss
    const columnData = (rowData, nomeData) => {
        if (rowData[nomeData])
            return formatDateTime(localeIT, rowData[nomeData]);
        return '';
    }

    // TO DO Implementare logica opzioni
    const columnOpzioni = (rowData) => {
        return (
            <span title="Visualizza dettaglio"><i className="pi pi-search"></i></span>
        );
    };

    return (
        <div className="container">
            <DataTable id="rpt-table" lazy showGridlines stripedRows value={props.listaRpt} rows={props.lazyParams.rows} rowsPerPageOptions={[10, 25, 50]} responsiveLayout="scroll"
                totalRecords={props.totalRecords} first={props.lazyParams.first} onPage={onPage} paginator paginatorPosition="bottom" style={{ paddingTop: "2rem" }}
                emptyMessage="Nessun elemento presente">
                <Column field="iuv" header="IUV" />
                <Column field="codiceContesto" header="Codice Contesto" />
                <Column field="area" header="Area" />
                <Column field="servizio" header="Categoria" />
                <Column field="dataRichiesta" header="Data Richiesta" body={(rowData) => columnData(rowData, 'dataRichiesta')} />
                <Column header="Opzioni" body={columnOpzioni} />
            </DataTable>
        </div>
    );
}