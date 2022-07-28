import React, { useRef, useState } from "react";
import "./elenco-form.css";

import { propsDominio } from 'util/config';

import { removeSpecialChars } from 'util/string-util';
import { aggiungiGiorni, aggiungiMesi, calcolaDatePerFinestra, today } from "util/date-util";
import { isFinestraAbilitata, modalitaFinestra } from "components/content/content";
import { Calendar } from "primereact/calendar";
import { emptyFlussoForm, isFinestraDisabled } from "../elenco";

const initialMinDate = aggiungiMesi(new Date(Date.now()), parseInt(propsDominio.intervalloDate));

// Componente condiviso per il tab Elenco e Avvisi, differenziati da props.tab
export default function ElencoForm(props) {

    const [flussoForm, setFlussoForm] = useState(props.flussoForm);

    const minDataRichiesta = useRef(initialMinDate);
    const maxDataRichiesta = useRef(today)
    const minDataRicevuta = useRef(initialMinDate);
    const maxDataRicevuta = useRef(today);
    const minDataFinestra = useRef(initialMinDate);
    const maxDataFinestra = useRef(today);

    const resetFiltri = () => {
        props.resetFiltri();
        setFlussoForm(emptyFlussoForm(props.tab))
        minDataRichiesta.current = initialMinDate;
        maxDataRichiesta.current = today;
        minDataRicevuta.current = initialMinDate;
        maxDataRicevuta.current = today;
    };

    const handleChangeDataRichiesta = (e) => {
        // La prima data selezionata viene settata come minDate
        minDataRichiesta.current = e.value[0];
        // Aggiunge n giorni alla prima data selezionata (n è dato da prop) per impostare max date
        const maxDate = aggiungiGiorni(new Date(e.value[0]), -parseInt(propsDominio.intervalloFiltroDate));
        // Se maxDate supera il giorno corrente  maxDate = oggi
        maxDataRichiesta.current = maxDate > today ? today : maxDate;
        setFlussoForm({
            ...flussoForm,
            dataRichiestaList: e.value
        });
    }

    const handleChangeDataRicevuta = (e) => {
        // La prima data selezionata viene settata come minDate
        minDataRicevuta.current = e.value[0];
        // Aggiunge n giorni alla prima data selezionata (n è dato da prop) per impostare max date
        const maxDate = aggiungiGiorni(new Date(e.value[0]), -parseInt(propsDominio.intervalloFiltroDate));
        // Se maxDate supera il giorno corrente  maxDate = oggi
        maxDataRicevuta.current = maxDate > today ? today : maxDate;
        setFlussoForm({
            ...flussoForm,
            dataRicevutaList: e.value
        });
    }

    return (<>
        <div className="container">
            <div className="accordion" id="elenco-accordion">
                <div className="accordion-item">
                    <h3 className="accordion-header" id="elenco-accordion-heading">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">
                            Ricerca {props.fraseFinestra}
                        </button>
                    </h3>
                    <div id="div-collapsible-1" className="accordion-collapse collapse" aria-labelledby="elenco-accordion-heading" data-bs-parent="#elenco-accordion">
                        <div className="accordion-body">
                            <form id="elenco-form" name="elenco-form">
                                <div className="row gx-5 gy-3">
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="iuv" className="form-label">Iuv:*</label>
                                        <input type="text" id="iuv" name="iuv" className="form-control"
                                            value={flussoForm.iuv} onChange={(e) => setFlussoForm({
                                                ...flussoForm,
                                                iuv: removeSpecialChars(e.target.value).toUpperCase()
                                            })}
                                            maxLength={24} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                        <input type="text" id="contesto" name="codiceContesto" className="form-control"
                                            value={flussoForm.codiceContesto} onChange={(e) => setFlussoForm({
                                                ...flussoForm,
                                                codiceContesto: removeSpecialChars(e.target.value).toUpperCase()
                                            })}
                                            maxLength={35} />
                                    </div>
                                    {props.tab === 'elenco' && <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="stato" className="form-label">Stato:</label>
                                        <select id="stato" name="tempStatoOrEsito" className="form-select" value={flussoForm.statoOrEsito}
                                            onChange={(e) => setFlussoForm({
                                                ...flussoForm,
                                                statoOrEsito: e.target.value
                                            })}>
                                            <option value={null}></option>
                                            {props.stati}
                                        </select>
                                    </div>}
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="area" className="form-label">Area:</label>
                                        <select id="area" name="area" className="form-select" value={flussoForm.area}
                                            onChange={(e) => setFlussoForm({
                                                ...flussoForm,
                                                area: e.target.value
                                            })}>
                                            <option value={null}></option>
                                            {props.aree}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="servizio" className="form-label">Categoria:</label>
                                        <select id="servizio" name="servizio" className="form-select" value={flussoForm.servizio}
                                            onChange={(e) => setFlussoForm({
                                                ...flussoForm,
                                                servizio: e.target.value
                                            })}>
                                            <option value={null}></option>
                                            {props.servizi}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="pagatore" className="form-label">Pagatore:</label>
                                        <input type="text" id="pagatore" name="idPagatore" className="form-control"
                                            value={flussoForm.idPagatore} onChange={(e) => setFlussoForm({
                                                ...flussoForm,
                                                idPagatore: removeSpecialChars(e.target.value).toUpperCase()
                                            })}
                                            maxLength={17} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="dataRichiesta" className="form-label">Data Richiesta:**  (o intervallo)</label>
                                        <Calendar id="dataRichiesta" name="dataRichiestaList" value={flussoForm.dataRichiestaList} readOnlyInput locale="it"
                                            onChange={(e) => handleChangeDataRichiesta(e)} selectionMode="range" dateFormat="dd/mm/y" showIcon
                                            minDate={minDataRichiesta.current} maxDate={maxDataRichiesta.current} />
                                    </div>
                                    {props.tab === 'elenco' && <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="dataRicevuta" className="form-label">Data Ricevuta:**  (o intervallo)</label>
                                        <Calendar id="dataRicevuta" name="dataRicevutaList" value={flussoForm.dataRicevutaList} readOnlyInput locale="it"
                                            onChange={(e) => handleChangeDataRicevuta(e)} selectionMode="range" dateFormat="dd/mm/y" showIcon
                                            minDate={minDataRicevuta.current} maxDate={maxDataRicevuta.current} />
                                    </div>}
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="versante" className="form-label">Versante:</label>
                                        <input type="text" id="versante" name="idVersante" className="form-control"
                                            value={flussoForm.idVersante} onChange={(e) => setFlussoForm({
                                                ...flussoForm,
                                                idVersante: removeSpecialChars(e.target.value).toUpperCase()
                                            })}
                                            maxLength={24} />
                                    </div>
                                    {isFinestraAbilitata &&
                                        (<div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                            <label htmlFor="finestraTemporale" className="form-label">Finestra Temporale:***</label>
                                            <Calendar id="finestraTemporale" value={flussoForm.finestraTemporaleList} locale="it" selectionMode="range" finestra={modalitaFinestra}
                                                onChange={(e) => setFlussoForm({
                                                    ...flussoForm,
                                                    finestraTemporaleList: calcolaDatePerFinestra(modalitaFinestra, e.value)
                                                })} 
                                                disabled={isFinestraDisabled(flussoForm)} dateFormat="dd/mm/y" showIcon  minDate={minDataFinestra.current} maxDate={maxDataFinestra.current} />
                                        </div>)}
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>                                                            {/* Triggera il componente padre */}
                                <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={() => props.setFlussoForm(flussoForm)}>Cerca</button>
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
        </div >
    </>
    );
}