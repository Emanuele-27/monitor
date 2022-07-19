import React, { useEffect, useMemo, useRef, useState } from "react";
import "./elenco.css";

import { esitiPagamento, statiPagamento, formatEsito, replaceUnderscore } from 'model/tuttiIStati';

import { monitorClient } from "clients/clients";

import { Calendar } from 'primereact/calendar';

import { propsDominio } from 'util/config';

import { columnMapper, sortMapper } from 'util/util';
import { removeSpecialChars } from 'util/stringUtil';
import { aggiungiGiorni, aggiungiMesi, getFirstDayOfMonth, getLastDayOfMonth } from "util/dateUtil";
import { addLocale } from 'primereact/api';
import { localeDate } from 'util/util';
import ElencoTable from "../elenco-table/elencoTable";

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

const isFinestraAbilitata = propsDominio.finestraTemporale === 'true';

const initialMinDate = aggiungiMesi(new Date(Date.now()), parseInt(propsDominio.intervalloDate));
const today = new Date(Date.now());

export default function ElencoForm(props) {

    // Contiene i dati del form
    const [flussoForm, setFlussoForm] = useState(structuredClone(initialFlussoForm));

    // Contiene temporaneamente alcuni dati del form
    const [statoOrEsito, setStatoOrEsito] = useState('');
    const [dataRichiestaList, setDataRichiestaList] = useState(null);
    const [dataRicevutaList, setDataRicevutaList] = useState(null);
    const [finestraTemporale, setFinestraTemporale] = useState(null);

    // Options per select
    const [optionsServizi, setOptionsServizi] = useState([]);
    const [optionsAree, setOptionsAree] = useState([]);
    const [optionsStatiAndEsito, setOptionsStatiAndEsito] = useState([]);

    // Gestione lazy
    const [totalRecords, setTotalRecords] = useState(0);
    const [flussiList, setFlussiList] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    const minDataRichiesta = useRef(initialMinDate);
    const maxDataRichiesta = useRef(today)
    const minDataRicevuta = useRef(initialMinDate);
    const maxDataRicevuta = useRef(today);

    useEffect(() => {
        loadLazyData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lazyParams]);

    useEffect(() => {
        buildOptionsStatiEsiti();
        buildOptionsServiziEAree();
    }, []);

    useMemo(() => {
        addLocale('it', localeDate);
    }, [])

    const loadLazyData = () => {
        props.blockContent();

        const flussoData = prepareInput();

        monitorClient.getFlussi(flussoData).then(fdResult => {
            setTotalRecords(fdResult.filtroFlusso.count < 0 ? 0 : fdResult.filtroFlusso.count);
            setFlussiList(fdResult.flussoList);
        })
            .finally(() => props.unblockContent());
    };

    const prepareInput = () => {
        // Copia il flusso di state e elimina i valori non validi
        let flusso = deleteUndefinedValues(structuredClone(flussoForm));

        // Aggiunge esito o stato al flusso in base al valore selezionato
        addStatoOrEsito(flusso, statoOrEsito);

        // Se finestraTemporale è abilitata e valorizzata, valorizza il filtro con la finestra
        if (isFinestraAbilitata && !isFinestraDisabled() && finestraTemporale) {
            const dateList = [getFirstDayOfMonth(finestraTemporale), getLastDayOfMonth(finestraTemporale)];
            addDate(flusso, dateList, 'dataRichiesta')
        } else { // Altrimenti con le altre date
            addDate(flusso, dataRichiestaList, 'dataRichiesta');
            addDate(flusso, dataRicevutaList, 'dataRicevuta');
        }

        return {
            filtroFlusso: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                count: propsDominio.intervalloDate, //numero di mesi con cui il servizio formerà la default min date per il filtro
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

    // Cerco il valore di statoOrEsito tra gli esiti e valorizzo opportunamente
    const addStatoOrEsito = (flusso, statoOrEsito) => {
        if (statoOrEsito) {
            if (esitiPagamento.filter(esito => esito.name === statoOrEsito).length === 1)
                flusso.esitoPagamento = statoOrEsito;
            else
                flusso.statoPagamento = statoOrEsito;
        }
    };

    // Valorizza le date del filtro
    const addDate = (flusso, dataList, attribute) => {
        if (dataList) {
            flusso[attribute + 'Da'] = dataList[0];
            if (dataList.length > 1 && dataList[1])
                flusso[attribute + 'A'] = dataList[1];
        }
    };

    const resetFiltri = () => {
        setFlussoForm(structuredClone(initialFlussoForm));
        setStatoOrEsito('');
        setDataRichiestaList(null);
        minDataRichiesta.current = initialMinDate;
        maxDataRichiesta.current = today;
        minDataRicevuta.current = initialMinDate;
        maxDataRicevuta.current = today;
        setDataRicevutaList(null);
        setFinestraTemporale(null);
        setLazyParams(structuredClone(initialLazyParams));
    };

    // Gestion onChange di componenti di Flusso
    const handleChangeFlusso = (value, attribute) => {
        let flussoFormNew = Object.assign({}, flussoForm);
        flussoFormNew[attribute] = value;
        setFlussoForm(flussoFormNew);
    };

    // Gestisce onChange di componenti di Flusso e input type=text
    const handleChangeText = (e) => {
        handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), e.target.name);
    };

    const handleChangeDataRichiesta = (e) => {
        // La prima data selezionata viene settata come minDate
        minDataRichiesta.current = e.value[0];
        // Aggiunge n giorni alla prima data selezionata
        const maxDate = aggiungiGiorni(new Date(e.value[0]), -parseInt(propsDominio.intervalloFiltroDate));
        // Se maxDate supera il giorno corrente  maxDate = oggi
        maxDataRichiesta.current = maxDate > today ? today : maxDate;
        setDataRichiestaList(e.value);
    }

    const handleChangeDataRicevuta = (e) => {
        // La prima data selezionata viene settata come minDate
        minDataRicevuta.current = e.value[0];
        // Aggiunge n giorni alla prima data selezionata
        const maxDate = aggiungiGiorni(new Date(e.value[0]), -parseInt(propsDominio.intervalloFiltroDate));
        // Se maxDate supera il giorno corrente  maxDate = oggi
        maxDataRicevuta.current = maxDate > today ? today : maxDate;
        setDataRicevutaList(e.value);
    }

    // Nel dropdown di stato ci sono sia stati che esiti, in fase  
    // di ricerca vengono distinti e valorizzati opportunamente
    const buildOptionsStatiEsiti = () => {
        const esitiOptions = esitiPagamento.map(esito => <option key={esito.name} value={esito.name}>{formatEsito(esito.name)}</option>);
        const statiOptions = statiPagamento.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => <option key={stato} value={stato}>{replaceUnderscore(stato)}</option>);
        setOptionsStatiAndEsito(esitiOptions.concat(statiOptions));
    };

    // Vengono recuperati i servizi, filtrati per l'idDominio corrente 
    // e vengono create le option per le select di servizi e aree
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

    // Disabled se almeno uno di questi campi è valorizzato
    const isFinestraDisabled = () => {
        if (flussoForm.iuv || flussoForm.codiceContesto
            || dataRichiestaList || dataRicevutaList)
            return true;
        return false;
    }

    return (<>
        <div className="container">
            <div className="accordion" id="elenco-accordion">
                <div className="accordion-item">
                    <h3 className="accordion-header" id="elenco-accordion-heading">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">
                            Ricerca
                        </button>
                    </h3>
                    <div id="div-collapsible-1" className="accordion-collapse collapse" aria-labelledby="elenco-accordion-heading" data-bs-parent="#elenco-accordion">
                        <div className="accordion-body">
                            <form id="elenco-form" name="elenco-form">
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
                                        <select id="stato" name="tempStatoOrEsito" className="form-select" value={statoOrEsito}
                                            onChange={(e) => setStatoOrEsito(e.target.value)}>
                                            <option value={null}></option>
                                            {optionsStatiAndEsito}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="area" className="form-label">Area:</label>
                                        <select id="area" name="area" className="form-select" value={flussoForm.area}
                                            onChange={(e) => handleChangeFlusso(e.target.value, e.target.name)}>
                                            <option value={null}></option>
                                            {optionsAree}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="servizio" className="form-label">Categoria:</label>
                                        <select id="servizio" name="servizio" className="form-select" value={flussoForm.servizio}
                                            onChange={(e) => handleChangeFlusso(e.target.value, e.target.name)}>
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
                                        <label htmlFor="dataRichiesta" className="form-label">Data Richiesta:**  (o intervallo)</label>
                                        <Calendar id="dataRichiesta" name="dataRichiestaList" value={dataRichiestaList} readOnlyInput locale="it"
                                            onChange={(e) => handleChangeDataRichiesta(e)} selectionMode="range" dateFormat="dd/mm/y" showIcon
                                            minDate={minDataRichiesta.current} maxDate={maxDataRichiesta.current} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="dataRicevuta" className="form-label">Data Ricevuta:**  (o intervallo)</label>
                                        <Calendar id="dataRicevuta" name="dataRicevutaList" value={dataRicevutaList} readOnlyInput locale="it"
                                            onChange={(e) => handleChangeDataRicevuta(e)} selectionMode="range" dateFormat="dd/mm/y" showIcon
                                            minDate={minDataRicevuta.current} maxDate={maxDataRicevuta.current} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-4">
                                        <label htmlFor="versante" className="form-label">Versante:</label>
                                        <input type="text" id="versante" name="idVersante" className="form-control"
                                            value={flussoForm.idVersante} onChange={(e) => handleChangeText(e)}
                                            maxLength={24} />
                                    </div>
                                    {isFinestraAbilitata &&
                                        (<div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="finestraTemporale" className="form-label">Finestra Temporale:***</label>
                                            <Calendar id="finestraTemporale" value={finestraTemporale} locale="it"
                                                onChange={(e) => setFinestraTemporale(e.value)} disabled={isFinestraDisabled()} view="month" dateFormat="MM yy" showIcon />
                                        </div>)}
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                                <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={loadLazyData}>Cerca</button>
                                <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginLeft: "0.05rem" }} onClick={resetFiltri}>Reset Filtri</button>
                            </div>

                            <p style={{ marginBottom: "0", marginTop: "1rem" }}>
                                <b>*</b> I campi <b>Iuv</b> e <b>Codice Contesto</b> consentono di effettuare una ricerca puntuale entro gli ultimi {-propsDominio.intervalloDate} mesi a meno che venga specificata la <b>data</b>. <br />
                                <b>**</b> I campi <b>data</b> consentono di effettuare filtro di ricerca per un intervallo massimo di {-propsDominio.intervalloFiltroDate} giorni.<br />
                                {isFinestraAbilitata && (<><b>***</b> La ricerca per <b>Iuv</b> , <b>Codice Contesto</b> e/o per <b>data</b> disabilita la finestra temporale.</>)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ElencoTable flussiList={flussiList} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams} />
        </>
    );
}