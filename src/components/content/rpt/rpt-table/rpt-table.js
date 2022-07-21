import React from "react";
import "./rpt-table.css";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { exportExcel, localeIT } from 'util/util';
import { formatDateTime } from "util/date-util";
import { capitalizeFirstLetter, splitCamelCase } from "util/string-util";

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

    const header = (
        <div style={{ marginRight: "0", marginLeft: "auto"}}>
            <Button type="button" icon="pi pi-file-excel" onClick={() => exportExcel(prepareList(props.listaRpt), 'rpt-senza-rpt')} className="p-button-success mr-2" data-pr-tooltip="XLS" />
        </div>
    );

    const prepareList = (list) => {
        let listNormalized = structuredClone(list);
    
        listNormalized.forEach(item => {
            item.dataRichiesta = item.dataRichiesta ? formatDateTime(localeIT, item.dataRichiesta) : '';
            delete item.statoPagamento;
            delete item.idDominio;
            delete item.numPagamenti;
            delete item.idServizio;
            Object.keys(item).forEach(key => {
                let newKey = capitalizeFirstLetter(splitCamelCase(key));
                item[newKey] = item[key];
                delete item[key];
            })
        });
        return listNormalized;
    }

    return (
        <div className="container">
            <DataTable id="rpt-table" lazy showGridlines stripedRows value={props.listaRpt} rows={props.lazyParams.rows} rowsPerPageOptions={[10, 25, 50]} responsiveLayout="scroll"
                totalRecords={props.totalRecords} first={props.lazyParams.first} onPage={onPage} paginator paginatorPosition="bottom" style={{ paddingTop: "2rem" }}
                emptyMessage="Nessun elemento presente" header={header}>
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