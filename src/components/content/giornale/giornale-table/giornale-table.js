import React, { useState } from "react";
import "./giornale-table.css";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { localeIT } from 'util/util';
import { formatDateTime } from "util/date-util";
import { formatEsito } from "model/tutti-i-stati";

export default function GiornaleTable(props) {

    const [dettaglioGiornale, setDettaglioGiornale] = useState(null);

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

    const columnDettaglio = (rowData) => {
        return <span style={{ cursor: "pointer" }} title="Dettaglio Evento" onClick={() => setDettaglioGiornale(rowData)} data-bs-toggle="modal" data-bs-target="#dettaglio-modal" >
            <i className="pi pi-search"></i>
        </span>
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
                <Column field="tipoEvento" header="Tipo Evento" />
                <Column field="sottotipoEvento" header="Sottotipo Evento" />
                <Column field="esito" header="Esito" body={columnEsito} />
                <Column header="Dettaglio" body={columnDettaglio} />
            </DataTable>

            <div className="modal fade" id="dettaglio-modal" tabIndex="-1" aria-labelledby="dettaglio-modal-content-label" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="dettaglio-modal-content-label">Dettaglio Evento</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Chiudi finestra di dialogo"></button>
                        </div>
                        <div className="modal-body row gy-4">
                            <div className="col-3 col-xs-3">
                                <b>Dominio:</b>
                            </div>
                            <div className="col-3 col-xs-3">
                                {dettaglioGiornale.idDominio}
                            </div>
                            <div className="col-6 col-xs-6" />
                            <div className="col-3 col-xs-3">
                                <b>Codice contesto:</b>
                            </div>
                            <div className="col-3 col-xs-3">
                                {dettaglioGiornale.codContesto}
                            </div>
                            <div className="col-6 col-xs-6" />
                            <div className="col-3 col-xs-3">
                                <b>IUV:</b>
                            </div>
                            <div className="col-3 col-xs-3">
                                {dettaglioGiornale.iuv}
                            </div>
                            <div className="col-6 col-xs-6" />
                            <div className="col-3 col-xs-3">
                                <b>Fruitore:</b>
                            </div>
                            <div className="col-3 col-xs-3">
                                {dettaglioGiornale.idFruitore}
                            </div>
                            <div className="col-6 col-xs-6" />
                            <div className="col-3 col-xs-3">
                                <b>Erogatore:</b>
                            </div>
                            <div className="col-3 col-xs-3">
                                {dettaglioGiornale.idErogatore}
                            </div>
                            <div className="col-6 col-xs-6" />
                            <div className="col-3 col-xs-3">
                                <b>Stazione Intermediario:</b>
                            </div>
                            <div className="col-3 col-xs-3">
                                {dettaglioGiornale.idStazioneIntPa}
                            </div>
                            <div className="col-6 col-xs-6" />
                            <div className="col-3 col-xs-3">
                                <b>Canale pagamento:</b>
                            </div>
                            <div className="col-3 col-xs-3">
                                {dettaglioGiornale.canalePagamento}
                            </div>
                            <div className="col-6 col-xs-6" />
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Chiudi<span className="visually-hidden"> finestra di dialogo</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}