import React, { useState } from "react";
import "./elenco-table.css";

import { formatEsito } from 'model/tutti-i-stati';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { exportExcel, localeIT } from 'util/util';
import { monitorClient } from "clients/clients";
import { capitalizeFirstLetter, replaceUnderscore, splitCamelCase } from "util/string-util";
import { formatDateTime } from "util/date-util";

// Componente condiviso per il tab Elenco e Avvisi, differenziati da props.tab
export default function ElencoTable(props) {

    const [flussoModal, setFlussoModal] = useState(0);
    const [listGiornaleModal, setListGiornaleModal] = useState(0);

    const onPage = (event) => {
        props.setLazyParams(event);
    };

    const onSort = (event) => {
        props.setLazyParams(event);
    };

    const header = () => {
        return <>
                Numero Transazioni: {props.totalRecords}
            <div style={{ marginRight: "0", marginLeft: "auto"}}>
                <Button type="button" icon="pi pi-file-excel" onClick={() => exportExcel(prepareList(props.flussiList), 'elenco')} className="p-button-success mr-2" data-pr-tooltip="XLS" />
            </div>
        </>
    }

    const prepareList = (list) => {
        let listNormalized = structuredClone(list);
        listNormalized.forEach(item => {
            item.dataRichiesta = item.dataRichiesta ? formatDateTime(item.dataRichiesta) : '';
            item.dataRicevuta = item.dataRicevuta ? formatDateTime(item.dataRicevuta) : '';
            delete item.idDominio;
            delete item.idServizio;
            delete item.idBeneficiario;
            delete item.idFlusso;
            delete item.dataRegistrazione;
            delete item.dataScadenza;
            delete item.dataModifica;
            delete item.idRichiesta;
            delete item.redirectUrl;
            delete item.idPsp;
            delete item.tipoVersamento;
            delete item.idCarrello;
            delete item.numPagamenti;
            Object.keys(item).forEach(key => {
                let newKey = capitalizeFirstLetter(splitCamelCase(key));
                item[newKey] = item[key];
                delete item[key];
            })
        });
        return listNormalized;
    }

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

    // Gestione date formattandole in dd/MM/yyy HH:mm:ss
    const columnData = (rowData, nomeData) => {
        if (rowData[nomeData])
            return formatDateTime(rowData[nomeData]);
        return '';
    }

    const columnTipoEvento = (rowData) => {
        return `${rowData.tipoEvento} - ${rowData.sottotipoEvento}`;
    };

    const columnEsito = (rowData) => {
        if (rowData.esito)
            return replaceUnderscore(rowData.esito);
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
            <span title="Visualizza dettaglio" onClick={() => getModalInfo(rowData)} data-bs-toggle="modal" data-bs-target="#dettaglio-modal" ><i className="pi pi-search"></i></span>
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
    };

    const isIuvRF = (iuv) => {
        return iuv && iuv.startsWith('RF');
    };

    // Stato valido se non è uno tra questi
    const isStatoValido = (stato) => {
        return !['RT_ACCETTATA_PA', 'RPT_RIFIUTATA_NODO', 'RPT_RIFIUTATA_PSP', 'RPT_ERRORE_INVIO_A_PSP', 'RPT_ANNULLATA',
            'RPT_NON_ATTIVA'].includes(stato);
    };

    // Recupera i dati da mostrare nel modal
    const getModalInfo = async (rowInfo) => {
        props.blockContent();

        setFlussoModal(rowInfo);

        const giornaleEventi = {
            idDominio: rowInfo.idDominio,
            iuv: rowInfo.iuv,
            codContesto: rowInfo.codiceContesto
        };

        monitorClient.getGiornalePerPagamento(giornaleEventi).then(
            res => setListGiornaleModal(res.giornaleList)
        ).finally(() => props.unblockContent());
    };

    return (
        <div className="container-fluid" style={{ width: "85%" }}>
            <DataTable id="elenco-table" lazy showGridlines stripedRows value={props.flussiList} rows={props.lazyParams.rows} rowsPerPageOptions={[10, 25, 50]} responsiveLayout="scroll"
                header={header} footer={header} totalRecords={props.totalRecords}
                first={props.lazyParams.first} onPage={onPage} paginator paginatorPosition="bottom" style={{ paddingTop: "2rem" }} emptyMessage="Nessun elemento presente"
                removableSort onSort={onSort} sortField={props.lazyParams.sortField} sortOrder={props.lazyParams.sortOrder}>
                <Column header="IUV - Codice Contesto" body={columnIUVCodContesto} />
                <Column field="area" header="Area" />
                <Column field="servizio" header="Categoria" />
                <Column sortable field="dataRichiesta" header="Data Richiesta" body={(rowData) => columnData(rowData, 'dataRichiesta')} />
                { props.tab === 'elenco' && 
                    <Column sortable field="dataRicevuta" header="Data Ricevuta" body={(rowData) => columnData(rowData, 'dataRicevuta')} />}
                <Column header="Pagatore - Versante" body={columnPagatoreVersante} />
                <Column header="Importo" body={columnImporto} />
                { props.tab === 'elenco' && 
                    <Column header="Stato" body={columnStato} />}
                <Column header="Opzioni" body={columnOpzioni} style={{ width: "7%" }} />
                {/* TO DO Finire Opzioni, iniziare Opzioni comuni */}
                {/* <Column header="Opzioni Comuni" body={columnOpzioniComuni}  /> */}
            </DataTable>

            <div className="modal fade" id="dettaglio-modal" tabIndex="-1" aria-labelledby="dettaglio-modal-content" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="dettaglio-modal-content">Riepilogo transazione</h3>
                        </div>
                        <div className="modal-body">
                            <div className="accordion" id="dettaglio-modal-accordion">
                                <div className="accordion-item">
                                    <h3 className="accordion-header" id="dettaglio-modal-accordion-heading-1">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#heading-collapse-1" aria-controls="heading-collapse-1">
                                            Dettaglio
                                        </button>
                                    </h3>
                                    <div id="heading-collapse-1" className="accordion-collapse collapse show" aria-labelledby="heading-collapse-1" data-bs-parent="#dettaglio-modal-accordion">
                                        <div className="accordion-body row">
                                            <div className="col-3 col-xs-3">
                                                <b>Dominio:</b>
                                            </div>
                                            <div className="col-3 col-xs-3">
                                                {flussoModal.idDominio}
                                            </div>
                                            <div className="col-6 col-xs-6" />
                                            <div className="col-3 col-xs-3">
                                                <b>Codice contesto:</b>
                                            </div>
                                            <div className="col-3 col-xs-3">
                                                {flussoModal.codiceContesto}
                                            </div>
                                            <div className="col-6 col-xs-6" />
                                            <div className="col-3 col-xs-3">
                                                <b>IUV:</b>
                                            </div>
                                            <div className="col-3 col-xs-3">
                                                {flussoModal.iuv}
                                            </div>
                                            <div className="col-6 col-xs-6" />
                                            {flussoModal.esitoPagamento === 'PAGAMENTO_NON_ESEGUITO' && (<>
                                                <div className="col-3 col-xs-3">
                                                    <b>Esito:</b>
                                                </div>
                                                <div className="col-3 col-xs-3">
                                                    {flussoModal.descrizionePendenza}
                                                </div>
                                                <div className="col-6 col-xs-6" /></>)
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h3 className="accordion-header" id="dettaglio-modal-accordion-heading-2">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#heading-collapse-2" aria-controls="heading-collapse-2">
                                            Giornale degli eventi
                                        </button>
                                    </h3>
                                    <div id="heading-collapse-2" className="accordion-collapse collapse" aria-labelledby="heading-collapse-2" data-bs-parent="#dettaglio-modal-accordion">
                                        <div className="accordion-body">
                                            <DataTable id="elenco-table" showGridlines stripedRows value={listGiornaleModal} emptyMessage="Nessun elemento presente">
                                                <Column header="Data Evento" body={(rowData) => columnData(rowData, 'dataOraEvento')} />
                                                <Column header="Tipo Evento" body={columnTipoEvento} />
                                                <Column field="idFruitore" header="Fruitore" />
                                                <Column field="idErogatore" header="Erogatore" />
                                                <Column field="canalePagamento" header="Canale Pagamento" />
                                                <Column header="Esito" body={columnEsito} />
                                            </DataTable>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h3 className="accordion-header" id="dettaglio-modal-accordion-heading-3">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#heading-collapse-3" aria-controls="heading-collapse-3">
                                            Informazioni sullo stato della RPT
                                        </button>
                                    </h3>
                                    <div id="heading-collapse-3" className="accordion-collapse collapse" aria-labelledby="heading-collapse-3" data-bs-parent="#dettaglio-modal-accordion">
                                        <div className="accordion-body">{/*TO DO Implementare logica terzo tab */}
                                            <div style={{ textAlign: "center" }}> Informazioni aggiuntive presenti solo dopo l'esecuzione dell'aggiornamento dello stato </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-primary" data-bs-dismiss="modal">Chiudi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}