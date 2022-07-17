import React, { useEffect, useState } from "react";
import "./elenco.css";

import { esitiPagamento, statiPagamento, formatEsito, replaceUnderscore } from 'model/tuttiIStati';

import { monitorClient } from "clients/clients";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';

import { propsDominio } from 'util/config';

import { columnMapper, sortMapper, localeIT} from 'util/util';
import { removeSpecialChars } from 'util/stringUtil';

const initialLazyParams = {
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
}

const initialFlussoForm = {
    // idDominio: propsDominio.idDominio, Commentato sennò non trovo dati D:
    iuv: '',
    codiceContesto: '',
    area: '',
    servizio: '',
    idPagatore: '',
    idVersante: '',
}

export default function Elenco(props) {

    // Contiene i dati del form
    const [flussoForm, setFlussoForm] = useState(structuredClone(initialFlussoForm));

    // Contiene temporaneamente alcuni dati del form
    const [tempStatoOrEsito, setTempStatoOrEsito] = useState('');
    const [dataRichiestaList, setDataRichiestaList] = useState(null);
    const [dataRicevutaList, setDataRicevutaList] = useState(null);

    // Options per select
    const [optionsServizi, setOptionsServizi] = useState([]);
    const [optionsAree, setOptionsAree] = useState([]);
    const [optionsStatiAndEsito, setOptionsStatiAndEsito] = useState([]);

    // Gestione lazy
    const [totalRecords, setTotalRecords] = useState(0);
    const [flussiList, setFlussiList] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    useEffect(() => {
        loadLazyData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lazyParams]);

    useEffect(() => {
        buildOptionsStatiEsiti();
        buildOptionsServiziEAree();;
    }, []);

    const loadLazyData = () => {
        props.blockContent();

        const flussoData = prepareInput();

        monitorClient.getFlussi(flussoData).then(fdResult => {
            setTotalRecords(fdResult.filtroFlusso.count);
            setFlussiList(fdResult.flussoList);
        })
            .finally(() => props.unblockContent());
    };

    const prepareInput = () => {
        // Copia il flusso di state e elimina i valori non validi
        let flusso = deleteUndefinedValues(structuredClone(flussoForm));

        // Aggiunge esito o stato al flusso in base al valore selezionato
        addStatoOrEsito(flusso, tempStatoOrEsito);

        // Aggiunge data da e/o data a, in base ai valori selezionati
        addDate(flusso, dataRichiestaList, 'dataRichiesta');
        addDate(flusso, dataRicevutaList, 'dataRicevuta');

        return {
            filtroFlusso: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                orderBy: columnMapper.get(lazyParams.sortField),
                orderType: sortMapper.get(lazyParams.sortOrder),
                flusso: flusso
            }
        }
    };

    const deleteUndefinedValues = (obj) => {
        Object.keys(obj).forEach(key => {
            if (!obj[key])
                delete obj[key];
        });
        return obj;
    };

    const addStatoOrEsito = (flusso, statoOrEsito) => {
        if (statoOrEsito) {
            let found = false;
            for (const esito of esitiPagamento) {
                if (esito.name === statoOrEsito) {
                    flusso.esitoPagamento = esito.name;
                    found = true;
                    break;
                }
            }

            if (!found) {
                for (const stato of statiPagamento) {
                    if (stato === statoOrEsito) {
                        flusso.statoPagamento = stato
                        break;
                    }
                }
            }
        }
    };

    const addDate = (flusso, dataList, attribute) => {
        if (dataList) {
            flusso[attribute + 'Da'] = dataList[0];
            if (dataList.length > 1 && dataList[1])
                flusso[attribute + 'A'] = dataList[1];
        }
    };

    const resetFiltri = () => {
        setFlussoForm(structuredClone(initialFlussoForm));
        setTempStatoOrEsito('');
        setDataRichiestaList(null);
        setDataRicevutaList(null);
        setLazyParams(structuredClone(initialLazyParams));
    };

    const onPage = (event) => {
        setLazyParams(event);
    };

    const onSort = (event) => {
        setLazyParams(event);
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

    // Gestion onChange di componenti di Flusso
    const changeStateForm = (value, attribute) => {
        let flussoFormNew = Object.assign({}, flussoForm);
        flussoFormNew[attribute] = value;
        setFlussoForm(flussoFormNew);
    };

    // Gestisce onChange di componenti che salvano lo stato
    // fuori da flusso perchè necessitano di altre operaz.
    const changeState = (value, attribute) => {
        switch (attribute) {
            case 'tempStatoOrEsito':
                setTempStatoOrEsito(value);
                break;
            case 'dataRichiestaList':
                setDataRichiestaList(value);
                break;
            case 'dataRicevutaList':
                setDataRicevutaList(value);
                break;
            default:
                break;
        }
    };

    // Gestisce onChange di componenti di Flusso e input type=text
    const handleChangeText = (e) => {
        changeStateForm(removeSpecialChars(e.target.value).toUpperCase(), e.target.name);
    };

    // Nel dropdown di stato ci sono sia stati che esiti, in fase  
    // di ricerca vengono distinti e valorizzati opportunamente
    const buildOptionsStatiEsiti = () => {
        const esitiOptions = esitiPagamento.map(esito => <option key={esito.name} value={esito.name}>{formatEsito(esito.name)}</option>);
        const statiOptions = statiPagamento.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => <option key={stato} value={stato}>{replaceUnderscore(stato)}</option>);
        setOptionsStatiAndEsito(esitiOptions.concat(statiOptions));
    };

    // Vengono recuperati i servizi, filtrati per l'idDominio corrente 
    // e vengono create le option per le select partendo dai servizi
    const buildOptionsServiziEAree = async () => {
        const serviziData = await monitorClient.getServizi();
        const serviziDominioCorrente = serviziData.serviziList.filter(servizio => servizio.idDominio === propsDominio.idDominio);
        const serviziOpt = serviziDominioCorrente.map(servizio =>
            <option key={servizio.servizio} value={servizio.servizio}>{servizio.servizio + ' - ' + servizio.denominazioneServizio}</option>
        );

        let areeMap = new Map();
        serviziDominioCorrente.forEach(servizio => {
            let area = servizio.area;
            if (!areeMap.has(area))
                areeMap.set(area, <option key={area} value={area}>{area}</option>);
        });

        setOptionsServizi(serviziOpt);
        setOptionsAree(Array.from(areeMap.values()));
    };

    return (
        <>
            <div className="accordion" id="elenco-accordion">
                <div className="accordion-item">
                    <h3 className="accordion-header" id="elenco-accordion-heading">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">
                            Ricerca
                        </button>
                    </h3>
                    <div id="div-collapsible-1" className="accordion-collapse collapse" aria-labelledby="elenco-accordion-heading" data-bs-parent="#elenco-accordion">
                        <div className="accordion-body">
                            <form id="elenco-form">
                                <div className="row gx-5 gy-3">
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="iuv" className="form-label">Iuv:*</label>
                                        <input type="text" id="iuv" name="iuv" className="form-control"
                                            value={flussoForm.iuv} onChange={(e) => handleChangeText(e)}
                                            maxLength={24} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                        <input type="text" id="contesto" name="codiceContesto" className="form-control"
                                            value={flussoForm.codiceContesto} onChange={(e) => handleChangeText(e)}
                                            maxLength={35} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="stato" className="form-label">Stato:</label>
                                        <select id="stato" name="tempStatoOrEsito" className="form-select" value={tempStatoOrEsito}
                                            onChange={(e) => changeState(e.target.value, e.target.name)}>
                                            <option value={null}></option>
                                            {optionsStatiAndEsito}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="area" className="form-label">Area:</label>
                                        <select id="area" name="area" className="form-select" value={flussoForm.area}
                                            onChange={(e) => changeStateForm(e.target.value, e.target.name)}>
                                            <option value={null}></option>
                                            {optionsAree}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="servizio" className="form-label">Categoria:</label>
                                        <select id="servizio" name="servizio" className="form-select" value={flussoForm.servizio}
                                            onChange={(e) => changeStateForm(e.target.value, e.target.name)}>
                                            <option value={null}></option>
                                            {optionsServizi}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="pagatore" className="form-label">Pagatore:</label>
                                        <input type="text" id="pagatore" name="idPagatore" className="form-control"
                                            value={flussoForm.idPagatore} onChange={(e) => handleChangeText(e)}
                                            maxLength={17} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="dataRichiesta" className="form-label">Data Richiesta:**</label>
                                        <Calendar id="dataRichiesta" name="dataRichiestaList" value={dataRichiestaList} readOnlyInput locale="it"
                                            onChange={(e) => changeState(e.value, e.target.name)} selectionMode="range" dateFormat="dd/mm/y" />
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="dataRicevuta" className="form-label">Data Ricevuta:**</label>
                                        <Calendar id="dataRicevuta" name="dataRicevutaList" value={dataRicevutaList} readOnlyInput locale="it"
                                            onChange={(e) => changeState(e.value, e.target.name)} selectionMode="range" dateFormat="dd/mm/y" />
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="versante" className="form-label">Versante:</label>
                                        <input type="text" id="versante" name="idVersante" className="form-control"
                                            value={flussoForm.idVersante} onChange={(e) => handleChangeText(e)}
                                            maxLength={24} />
                                    </div>
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                                <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={loadLazyData}>Cerca</button>
                                <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginLeft: "0.05rem" }} onClick={resetFiltri}>Reset Filtri</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DataTable id="elenco-table" lazy showGridlines stripedRows value={flussiList} rows={10} rowsPerPageOptions={[10, 25, 50]} responsiveLayout="scroll"
                header={"Numero Transazioni: " + totalRecords} footer={"Numero Transazioni: " + totalRecords} totalRecords={totalRecords}
                first={lazyParams.first} onPage={onPage} paginator paginatorPosition="bottom" style={{ paddingTop: "2rem" }}
                removableSort onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}>
                <Column header="IUV - Codice Contesto" body={columnIUVCodContesto} />
                <Column field="area" header="Area" />
                <Column field="servizio" header="Categoria" />
                <Column sortable field="dataRichiesta" header="Data Richiesta" body={columnDataRichiesta} />
                <Column sortable field="dataRicevuta" header="Data Ricevuta" body={columnDataRicevuta} />
                <Column header="Pagatore - Versante" body={columnPagatoreVersante} />
                <Column header="Importo" body={columnImporto} />
                <Column header="Stato" body={columnStato} />
                {/* TO DO Opzioni, Opzioni comuni */}
                {/* <Column header="Opzioni" body={columnPagatoreVersante}  />
                <Column header="Opzioni Comuni" body={columnPagatoreVersante}  /> */}
            </DataTable>
        </>
    );
}