import React from "react";
import "./rpt-table.css";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { exportExcel } from 'util/util';
import { formatDateTime } from "util/date-util";
import { capitalizeFirstLetter, splitCamelCase } from "util/string-util";
import { Link } from "react-router-dom";

export default function RptTable(props) {

    const onPage = (event) => {
        props.setLazyParams(event);
    };

    // Gestione date formattandole in dd/MM/yyy HH:mm:ss
    const columnData = (rowData, nomeData) => {
        if (rowData[nomeData])
            return formatDateTime(rowData[nomeData]);
        return '';
    }

    const columnOpzioni = (rowData) => {
        return (<Link to={`/elenco?iuv=${rowData.iuv}&codContesto=${rowData.codiceContesto}`}>
            <span title="Visualizza dettaglio" onClick={() => clickElencoTab()}><i className="pi pi-search"></i></span>
        </Link>
        );
    };

    const clickElencoTab = () => {
        document.getElementById('rpt-tab').classList.remove('entrypoint-focus');
        document.getElementById('elenco-tab').classList.add('entrypoint-focus');
    }

    const header = (
        <div style={{ marginRight: "0", marginLeft: "auto" }}>
            <button type="button" className="btn btn-success export-button" onClick={() => exportExcel(prepareList(props.listaRpt), 'rpt-senza-rpt')} title="Esporta in Excel">
                <i className="pi pi-file-excel" />
            </button>
        </div>
    );

    const prepareList = (list) => {
        let listNormalized = structuredClone(list);

        listNormalized.forEach(item => {
            item.dataRichiesta = item.dataRichiesta ? formatDateTime(item.dataRichiesta) : '';
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