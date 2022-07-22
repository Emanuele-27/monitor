import React from "react";
import "./giornale-table.css";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import {  localeIT } from 'util/util';
import { formatDateTime } from "util/date-util";
import { formatEsito } from "model/tutti-i-stati";

export default function GiornaleTable(props) {

    const onPage = (event) => {
        props.setLazyParams(event);
    };

    const onSort = (event) => {
        props.setLazyParams(event);
    };

    // Gestione date formattandole in dd/MM/yyy HH:mm:ss
    const columnData = (rowData, nomeData) => {
        if (rowData[nomeData])
            return formatDateTime(localeIT, rowData[nomeData]);
        return '';
    }

    const columnEsito = (rowData) => {
        if (rowData.esito)
            return formatEsito(rowData.esito);
        return '';
    };

    return (
        <div className="container">
           <DataTable id="giornale-table" lazy showGridlines stripedRows value={props.listGiornale} rows={props.lazyParams.rows} rowsPerPageOptions={[10, 25, 50]} responsiveLayout="scroll"
                totalRecords={props.totalRecords} first={props.lazyParams.first} onPage={onPage} paginator paginatorPosition="bottom" style={{ paddingTop: "2rem" }} emptyMessage="Nessun elemento presente"
                removableSort onSort={onSort} sortField={props.lazyParams.sortField} sortOrder={props.lazyParams.sortOrder}>
                <Column field="iuv" header="IUV" />
                <Column field="codContesto" header="Codice Contesto" />
                <Column sortable field="dataOraEvento" header="Data Evento" body={(rowData) => columnData(rowData, 'dataOraEvento')} />
                <Column field="tipoVersamento" header="Tipo Versamento" />
                <Column field="tipoEvento" header="Tipo Evento"  />
                <Column field="sottotipoEvento" header="Sottotipo Evento"  />
                <Column field="esito" header="Esito" body={columnEsito} />
                {/* <Column field="dettaglio" header="Dettaglio"  /> */}
            </DataTable>
        </div>
    );
}