import { useContext, useState } from "react";
import "./elenco-table.css";

import { formatEsito, isIuvRF } from "util/string-util";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { exportExcel, MimeTypes, saveAsFile } from 'util/export-util';
import { capitalizeFirstLetter, replaceUnderscore, splitCamelCase } from "util/string-util";
import { formatDateTime } from "util/date-util";
import { monitorClient } from "clients/monitor-client";
import { propsDominio } from "config/config";
import { getRptBadgeCount, TabsContext } from "components/content/content";
import { auxClient } from "clients/aux-client";
import { advClient } from "clients/adv-client";
import { formatEuro } from "util/number-util";
import { Severities } from "components/message/message";
import { deleteProps } from "util/util";

const esitoStatoRPTMap = new Map();

// Componente condiviso per il tab Elenco e Avvisi, differenziati da props.tab
export default function ElencoTable(props) {

    // Primo tab opzione dettaglio
    const [flussoModal, setFlussoModal] = useState({});
    // Secondo tab opzione dettaglio
    const [listGiornaleModal, setListGiornaleModal] = useState({});
    // Terzo tab opzione dettaglio
    const [infoStatoRPT, setInfoStatoRPT] = useState({});

    const content = useContext(TabsContext);

    const onPage = (event) => {
        props.setLazyParams(event);
    };

    const onSort = (event) => {
        props.setLazyParams(event);
    };

    const header = () => {
        return <>
            <div style={{ fontSize: "1.2rem" }}>
                Numero Transazioni: {props.totalRecords}
            </div>
            <div style={{ marginRight: "0", marginLeft: "auto" }}>
                <button type="button" className="btn btn-success export-button" onClick={() => exportExcel(prepareList(props.flussiList), 'elenco')} title="Esporta in Excel">
                    <i className="pi pi-file-excel" />
                </button>
                <button type="button" className="btn btn-primary header-button font-normal" onClick={props.call}>Aggiorna Elenco</button>
                {props.tab === 'elenco' &&
                    <button type="button" onClick={aggiornaStati} className="btn btn-primary header-button font-normal">Aggiorna Stati</button>}
            </div>
        </>
    }

    const prepareList = (list) => {
        let listNormalized = structuredClone(list);
        listNormalized.forEach(item => {
            item.dataRichiesta = item.dataRichiesta ? formatDateTime(item.dataRichiesta) : '';
            item.dataRicevuta = item.dataRicevuta ? formatDateTime(item.dataRicevuta) : '';
            deleteProps(item, 'idDominio', 'idServizio', 'idBeneficiario', 'idFlusso',
                'dataRegistrazione', 'dataScadenza', 'dataModifica', 'idRichiesta',
                'redirectUrl', 'idPsp', 'tipoVersamento', 'idCarrello', 'numPagamenti')
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
        return formatEuro(rowData.importo)
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
            {renderAltreOpzioni(rowData)}
        </div>);
    };

    const renderAltreOpzioni = (rowData) => {
        if (props.tab === 'elenco') {
            if (isStatoValido(rowData.statoPagamento))
                if (isIuvRF(rowData.iuv))
                    return <><span title="Aggiorna stato" onClick={() => aggiornaStato(rowData)}><i className="pi pi-file-o"></i></span>
                        <span title="Chiedi ricevuta" onClick={() => chiediRicevuta(rowData)}><i className="pi pi-download"></i></span></>
                else
                    return <><span disabled><i className="pi pi-file-o"></i></span>
                        <span disabled><i className="pi pi-download"></i></span></>
        }
        else if (props.tab === 'avvisi')
            return <span title="Download avviso" onClick={() => downloadAvviso(rowData)}><i className="pi pi-download"></i></span>
    };

    const columnOpzioniComuni = (rowData) => {
        if (isStatoValido(rowData.statoPagamento) && rowData.idCarrello)
            if (rowData.idRicevuta && isIuvRF(rowData.iuv))
                return <div id="opzioni-comuni-column">
                    <span title="Aggiorna stato" onClick={() => aggiornaStatoCarrello(rowData)}><i className="pi pi-wallet"></i></span>
                    <span title="Download ricevute" onClick={() => chiediRicevutaCarrello(rowData)}><i className="pi pi-download"></i></span>
                </div>
            else
                return <div id="opzioni-comuni-column">
                    <span disabled><i className="pi pi-wallet"></i></span>
                    <span disabled><i className="pi pi-download"></i></span>
                </div>
        return <></>;
    };

    // Stato valido se non è uno tra questi
    const isStatoValido = (stato) => {
        return !['RT_ACCETTATA_PA', 'RPT_RIFIUTATA_NODO', 'RPT_RIFIUTATA_PSP', 'RPT_ERRORE_INVIO_A_PSP', 'RPT_ANNULLATA',
            'RPT_NON_ATTIVA'].includes(stato);
    };

    // Recupera i dati da mostrare nel modal
    const getModalInfo = async (rowData) => {

        // Dati per primo tab
        setFlussoModal(rowData);

        // Recupero dati per secondo tab
        const giornaleEventi = {
            idDominio: rowData.idDominio,
            iuv: rowData.iuv,
            codContesto: rowData.codiceContesto
        };

        setListGiornaleModal((await monitorClient.getGiornalePerPagamento(giornaleEventi)).giornaleList);

        // Dati per terzo tab
        setInfoStatoRPT(esitoStatoRPTMap.get(rowData.idFlusso));
    };

    const aggiornaStati = async () => {

        content.block();

        const flussoData = {
            filtroFlusso: {
                da: 1,
                a: props.totalRecords,
                count: propsDominio.intervalloDate,
                flusso: {
                    // idDominio: propsDominio.idDominio,
                    statoPagamento: 'RPT_ACCETTATA_NODO'
                }
            }
        }
        try {
            const dataResult = await monitorClient.getFlussi(flussoData);

            let rptPromises = [];

            // Raccolta pending promises 
            dataResult.flussoList.forEach((flusso) => {
                const nodoChiediStatoRPT = getNodoChiediStatoRPTParam(flusso.codiceContesto, flusso.idDominio, flusso.iuv);
                rptPromises.push(auxClient.nodoChiediStatoRPT(nodoChiediStatoRPT));
            });

            // Sync promises on fullfilled
            const responses = await Promise.allSettled(rptPromises);

            let countOK = 0;
            responses.forEach(res => {
                const stato = res.value;
                if (stato && !stato.faultBean && ((stato.nodoChiediCopiaRTRisposta && !stato.nodoChiediCopiaRTRisposta.fault) || (!stato.nodoChiediCopiaRTRisposta)))
                    countOK++;
            });

            props.call();
            props.showMsg(Severities.info, "Info:", "Operazione effettuata. Sono stati aggiornati " + countOK + " flussi su " + responses.length);

        } catch (e) {
            content.unblock();
            props.showMsg(Severities.error, "Errore:", "Riprovare in un altro momento");
        }
    }

    // Condiviso con chiediCopiaRT
    const getNodoChiediStatoRPTParam = (contesto, dominio, iuv) => {
        return {
            codiceContestoPagamento: contesto,
            identificativoDominio: dominio,
            identificativoUnivocoVersamento: iuv,
            identificativoIntermediarioPA: propsDominio.idIntermediarioPA,
            identificativoStazioneIntermediarioPA: propsDominio.idStazionePA,
            password: propsDominio.pwdPA
        }
    }

    const aggiornaStato = async (rowData) => {
        content.block();

        const nodoChiediStatoRPT = getNodoChiediStatoRPTParam(rowData.codiceContesto, rowData.idDominio, rowData.iuv);
        try {
            const stato = await auxClient.nodoChiediStatoRPT(nodoChiediStatoRPT);

            if (!stato)
                throw new Error("Riprovare in un altro momento");

            esitoStatoRPTMap.set(rowData.idFlusso, stato.esitoChiediStatoRPT)

            if (stato.faultBean)
                throw new Error(stato.faultBean.description);

            const ricevuta = stato.nodoChiediCopiaRTRisposta;

            if (ricevuta && ricevuta.fault)
                throw new Error(ricevuta.fault.description);

            props.call();
            const count = (await getRptBadgeCount()).filtroFlusso.count;
            content.setRptBadgeCount(count > 0 ? count : 0);
            props.showMsg(Severities.info, "Info:", "Operazione effettuata con successo. E' possibile consultare l'esito nel pannello dettagli");
        } catch (e) {
            props.showMsg(Severities.error, "Errore di sistema:", e.message);
        } finally {
            content.unblock();
        }
    };

    const aggiornaStatoCarrello = async (rowData) => {

        content.block();

        const statoRPTCopiaRTCarrello = {
            password: propsDominio.pwdPA,
            intestazioneCarrelloPPT: {
                identificativoCarrello: rowData.idCarrello,
                identificativoIntermediarioPA: propsDominio.idIntermediarioPA,
                identificativoStazioneIntermediarioPA: propsDominio.idStazionePA,
            }
        }

        try {
            const stato = await auxClient.nodoChiediStatoRPTCarrello(statoRPTCopiaRTCarrello);

            // Se nessun elemento della lista contiene errore
            if (stato && stato.statoRPTCopiaRT && !stato.statoRPTCopiaRT.find((element) => element.nodoChiediCopiaRTRisposta.fault))
                props.showMsg(Severities.info, "Info:", "Operazione effettuata con successo. E' possibile consultare l'esito nel pannello dettagli");
            else
                throw new Error();
        } catch (e) {
            props.showMsg(Severities.error, "Errore di sistema:", "Riprovare in un altro momento");
        } finally {
            content.unblock();
        }
    };

    const chiediRicevuta = async (rowData) => {

        content.block();

        const nodoChiediCopiaRT = getNodoChiediStatoRPTParam(rowData.codiceContesto, rowData.idDominio, rowData.iuv);

        try {
            const ricevuta = await auxClient.nodoChiediCopiaRT(nodoChiediCopiaRT);

            if (ricevuta) {
                if (ricevuta.fault)
                    props.showMsg(Severities.warn, "Attenzione:", ricevuta.fault.description);
                else
                    props.showMsg(Severities.info, "Info:", "Operazione effettuata con successo. E' possibile consultare l'esito nel pannello dettagli");
            } else {
                throw new Error();
            }

        } catch (e) {
            props.showMsg(Severities.error, "Errore:", "Errore nel recupero della ricevuta");
        } finally {
            content.unblock();
        }
    };

    const chiediRicevutaCarrello = async (rowData) => {

        content.block();

        const statoRPTCopiaRTCarrello = {
            password: propsDominio.pwdPA,
            intestazioneCarrelloPPT: {
                identificativoCarrello: rowData.idCarrello,
                identificativoIntermediarioPA: propsDominio.idIntermediarioPA,
                identificativoStazioneIntermediarioPA: propsDominio.idStazionePA,
            },
        }

        try {
            const ricevuta = await auxClient.nodoChiediCopiaRTCarrello(statoRPTCopiaRTCarrello);

            if (ricevuta && ricevuta.nodoChiediCopiaRTRisposta && !ricevuta.nodoChiediCopiaRTRisposta.find(element => !element || element.nodoChiediCopiaRTRisposta.fault))
                props.showMsg(Severities.info, "Info:", "Operazione effettuata con successo. E' possibile consultare l'esito nel pannello dettagli");
            else
                throw new Error();
        } catch (e) {
            props.showMsg(Severities.error, "Errore di sistema:", "Riprovare in un altro momento");
        } finally {
            content.unblock();
        }
    };

    const downloadAvviso = async (rowData) => {

        content.block();

        let avvisoPagamentoDoc = {
            richiesta: {
                codCcontesto: rowData.codiceContesto,
                iuv: rowData.iuv,
                idDominio: rowData.idDominio,
            }
        };
        try {
            avvisoPagamentoDoc = await advClient.recuperaAvvisoPagamento(avvisoPagamentoDoc);
            const blob = await (await fetch("data:" + MimeTypes.pdf + ";base64," + avvisoPagamentoDoc.avvisoPagamento.pdfDoc)).blob();
            saveAsFile(blob, avvisoPagamentoDoc.avvisoPagamento.nomeFile + '.pdf')
        } catch (e) {
            props.showMsg(Severities.warn, "Attenzione:", "Download avviso di pagamento non disponibile");
        } finally {
            content.unblock();
        }
    }

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
                {props.tab === 'elenco' &&
                    <Column sortable field="dataRicevuta" header="Data Ricevuta" body={(rowData) => columnData(rowData, 'dataRicevuta')} />}
                <Column header="Pagatore - Versante" body={columnPagatoreVersante} />
                <Column header="Importo" body={columnImporto} />
                {props.tab === 'elenco' &&
                    <Column header="Stato" body={columnStato} />}
                <Column header="Opzioni" body={columnOpzioni} style={{ width: "7%" }} />
                {props.tab === 'elenco' &&
                    <Column header="Opzioni comuni" body={columnOpzioniComuni} />}
            </DataTable>

            {/* MODAL */}
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
                                            <DataTable showGridlines stripedRows value={listGiornaleModal} emptyMessage="Nessun elemento presente">
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
                                        <div className="accordion-body">
                                            {infoStatoRPT
                                                ? (<>
                                                    <div className="row" style={{ marginBottom: "1.5rem" }}>
                                                        <div className="col-3 col-xs-3">
                                                            <b>Stato finale:</b>
                                                        </div>
                                                        <div className="col-3 col-xs-3">
                                                            {infoStatoRPT.stato}
                                                        </div>
                                                        <div className="col-6 col-xs-6" />
                                                        <div className="col-3 col-xs-3">
                                                            <b>Url redirect:</b>
                                                        </div>
                                                        <div className="col-3 col-xs-3">
                                                            {infoStatoRPT.url}
                                                        </div>
                                                        <div className="col-6 col-xs-6" />
                                                    </div>

                                                    <DataTable showGridlines stripedRows value={infoStatoRPT.elementoStoricoRPT} rows={5} emptyMessage="Nessun elemento presente"
                                                        header={"Storico stati RPT"} style={{ marginBottom: "1.5rem" }}>
                                                        <Column header="Data" body={(rowData) => columnData(rowData, 'data')} />
                                                        <Column header="Stato" body={(rowData) => replaceUnderscore(rowData.stato)} />
                                                        <Column header="Descrizione" field="descrizione" />
                                                    </DataTable>

                                                    <DataTable showGridlines stripedRows value={infoStatoRPT.elementoStoricoVersamento} emptyMessage="Nessun elemento presente"
                                                        header={"Storico versamenti"}>
                                                        <Column header="Progressivo" field="progressivo" />
                                                        <Column header="Data" body={(rowData) => columnData(rowData, 'data')} />
                                                        <Column header="Stato" body={(rowData) => replaceUnderscore(rowData.stato)} />
                                                        <Column header="Descrizione" field="descrizione" />
                                                    </DataTable>
                                                </>
                                                )
                                                : (<div style={{ textAlign: "center" }}> Informazioni aggiuntive presenti solo dopo l'esecuzione dell'aggiornamento dello stato </div>)}
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
            {/* FINE MODAL */}

        </div>
    );
}