import React, { useRef, useState } from "react";
import "./elenco-form.css";

import {  statiPagamento } from 'model/tutti-i-stati';

import { Calendar } from 'primereact/calendar';

import { propsDominio } from 'util/config';

import { removeSpecialChars } from 'util/string-util';
import { aggiungiGiorni, aggiungiMesi, getFirstDayOfMonth, getFirstDayOfWeek, getLastDayOfMonth, getLastDayOfWeek } from "util/date-util";
import { deleteUndefinedValues } from 'util/util';
import { areeOptions, isFinestraAbilitata, modalitaFinestra, serviziOptions, statiEsitiOptions } from "components/content/content";

const initialFlussoForm = {
    // idDominio: propsDominio.idDominio, Commentato sennò non trovo dati D:
    iuv: '',
    codiceContesto: '',
    area: '',
    servizio: '',
    idPagatore: '',
    idVersante: '',
}

const initialMinDate = aggiungiMesi(new Date(Date.now()), parseInt(propsDominio.intervalloDate));
const today = new Date(Date.now());

// Componente condiviso per il tab Elenco e Avvisi, differenziati da props.tab
export default function ElencoForm(props) {

    // Contiene i dati del form, e verrà direttamente usato come filtro
    const [flussoForm, setFlussoForm] = useState(structuredClone(initialFlussoForm));

    // Contiene temporaneamente alcuni dati del form
    const [statoOrEsito, setStatoOrEsito] = useState('');
    const [dataRichiestaList, setDataRichiestaList] = useState(null);
    const [dataRicevutaList, setDataRicevutaList] = useState(null);
    const [finestraTemporaleList, setFinestraTemporaleList] = useState(null);

    const minDataRichiesta = useRef(initialMinDate);
    const maxDataRichiesta = useRef(today)
    const minDataRicevuta = useRef(initialMinDate);
    const maxDataRicevuta = useRef(today);

    const call = () => {
        props.call(prepareInput());
    }

    const prepareInput = () => {
        // Copia il flusso del form elimina i valori non validi
        let flusso = deleteUndefinedValues(structuredClone(flussoForm));
        // Aggiunge esito o stato al flusso in base al valore selezionato
        addStatoOrEsito(flusso, statoOrEsito);
        // Se finestraTemporale è abilitata e valorizzata, valorizza il filtro con la finestra
        if (isFinestraAbilitata && !isFinestraDisabled() && finestraTemporaleList) {
            addDate(flusso, finestraTemporaleList, 'dataRichiesta')
        } else { // Altrimenti con le altre date
            addDate(flusso, dataRichiestaList, 'dataRichiesta');
            addDate(flusso, dataRicevutaList, 'dataRicevuta');
        }
        if(props.tab === "avvisi")
            flusso.flagAnnullamento = 1;

        return flusso;
    }

    // Cerco il valore di statoOrEsito tra gli stati e valorizzo opportunamente
    const addStatoOrEsito = (flusso, statoOrEsito) => {
        if (statoOrEsito) {
            if(statiPagamento.includes(statoOrEsito))
                flusso.statoPagamento = statoOrEsito;
            else
                flusso.esitoPagamento = statoOrEsito;
        }
    };

    // Valorizza le date con range del filtro
    const addDate = (flusso, dataList, attribute) => {
        if (dataList && dataList[0]) {
            flusso[attribute + 'Da'] = dataList[0];
            if (dataList.length > 1 && dataList[1])
                flusso[attribute + 'A'] = dataList[1];
        }
    };

    const resetFiltri = () => {
        setFlussoForm(structuredClone(initialFlussoForm));
        setStatoOrEsito('');
        setDataRichiestaList(null);
        setDataRicevutaList(null);
        minDataRichiesta.current = initialMinDate;
        maxDataRichiesta.current = today;
        minDataRicevuta.current = initialMinDate;
        maxDataRicevuta.current = today;
        setFinestraTemporaleList(null);
        props.resetLazy();
    };

    // Gestion onChange di componenti di Flusso
    const handleChangeFlusso = (value, attribute) => {
        let flussoFormNew = Object.assign({}, flussoForm);
        flussoFormNew[attribute] = value;
        setFlussoForm(flussoFormNew);
    };

    // Gestisce onChange di componenti di Flusso e input type=text
    // rimuove i caratteri speciali e trasforma in maiuscolo
    const handleChangeText = (e) => {
        handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), e.target.name);
    };

    const handleChangeDataRichiesta = (e) => {
        // La prima data selezionata viene settata come minDate
        minDataRichiesta.current = e.value[0];
        // Aggiunge n giorni alla prima data selezionata (n è dato da prop) per impostare max date
        const maxDate = aggiungiGiorni(new Date(e.value[0]), -parseInt(propsDominio.intervalloFiltroDate));
        // Se maxDate supera il giorno corrente  maxDate = oggi
        maxDataRichiesta.current = maxDate > today ? today : maxDate;
        setDataRichiestaList(e.value);
    }

    const handleChangeDataRicevuta = (e) => {
        // La prima data selezionata viene settata come minDate
        minDataRicevuta.current = e.value[0];
        // Aggiunge n giorni alla prima data selezionata (n è dato da prop) per impostare max date
        const maxDate = aggiungiGiorni(new Date(e.value[0]), -parseInt(propsDominio.intervalloFiltroDate));
        // Se maxDate supera il giorno corrente  maxDate = oggi
        maxDataRicevuta.current = maxDate > today ? today : maxDate;
        setDataRicevutaList(e.value);
    }

    // Disabled se almeno uno di questi campi è valorizzato
    const isFinestraDisabled = () => {
        if (flussoForm.iuv || flussoForm.codiceContesto
            || dataRichiestaList || dataRicevutaList)
            return true;
        return false;
    }

    const handleChangeFinestra = (e) => {
        if (modalitaFinestra === 'mese')
            setFinestraTemporaleList([getFirstDayOfMonth(e.value), getLastDayOfMonth(e.value)]);
        else if (modalitaFinestra === 'settimana')
            setFinestraTemporaleList([getFirstDayOfWeek(e.value), getLastDayOfWeek(e.value)]);
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
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="iuv" className="form-label">Iuv:*</label>
                                        <input type="text" id="iuv" name="iuv" className="form-control"
                                            value={flussoForm.iuv} onChange={(e) => handleChangeText(e)}
                                            maxLength={24} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                        <input type="text" id="contesto" name="codiceContesto" className="form-control"
                                            value={flussoForm.codiceContesto} onChange={(e) => handleChangeText(e)}
                                            maxLength={35} />
                                    </div>
                                    { props.tab === 'elenco' && <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="stato" className="form-label">Stato:</label>
                                        <select id="stato" name="tempStatoOrEsito" className="form-select" value={statoOrEsito}
                                            onChange={(e) => setStatoOrEsito(e.target.value)}>
                                            <option value={null}></option>
                                            {statiEsitiOptions}
                                        </select>
                                    </div>}
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="area" className="form-label">Area:</label>
                                        <select id="area" name="area" className="form-select" value={flussoForm.area}
                                            onChange={(e) => handleChangeFlusso(e.target.value, e.target.name)}>
                                            <option value={null}></option>
                                            {areeOptions}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="servizio" className="form-label">Categoria:</label>
                                        <select id="servizio" name="servizio" className="form-select" value={flussoForm.servizio}
                                            onChange={(e) => handleChangeFlusso(e.target.value, e.target.name)}>
                                            <option value={null}></option>
                                            {serviziOptions}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="pagatore" className="form-label">Pagatore:</label>
                                        <input type="text" id="pagatore" name="idPagatore" className="form-control"
                                            value={flussoForm.idPagatore} onChange={(e) => handleChangeText(e)}
                                            maxLength={17} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="dataRichiesta" className="form-label">Data Richiesta:**  (o intervallo)</label>
                                        <Calendar id="dataRichiesta" name="dataRichiestaList" value={dataRichiestaList} readOnlyInput locale="it"
                                            onChange={(e) => handleChangeDataRichiesta(e)} selectionMode="range" dateFormat="dd/mm/y" showIcon
                                            minDate={minDataRichiesta.current} maxDate={maxDataRichiesta.current} />
                                    </div>
                                    { props.tab === 'elenco' && <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="dataRicevuta" className="form-label">Data Ricevuta:**  (o intervallo)</label>
                                        <Calendar id="dataRicevuta" name="dataRicevutaList" value={dataRicevutaList} readOnlyInput locale="it"
                                            onChange={(e) => handleChangeDataRicevuta(e)} selectionMode="range" dateFormat="dd/mm/y" showIcon
                                            minDate={minDataRicevuta.current} maxDate={maxDataRicevuta.current} />
                                    </div>}
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="versante" className="form-label">Versante:</label>
                                        <input type="text" id="versante" name="idVersante" className="form-control"
                                            value={flussoForm.idVersante} onChange={(e) => handleChangeText(e)}
                                            maxLength={24} />
                                    </div>
                                    {isFinestraAbilitata &&
                                        (<div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                            <label htmlFor="finestraTemporale" className="form-label">Finestra Temporale:***</label>
                                            <Calendar id="finestraTemporale" value={finestraTemporaleList} locale="it" selectionMode="range" finestra={modalitaFinestra}
                                                onChange={(e) => handleChangeFinestra(e)} disabled={isFinestraDisabled()} dateFormat="dd/mm/y" showIcon />{/*view="month"*/}
                                        </div>)}
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                                <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={call}>Cerca</button>
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
    </>
    );
}