import React, { useContext, useState } from "react";

import { propsDominio } from 'config/config';

import { removeSpecialChars } from 'util/string-util';
import { aggiungiGiorni, formatDateForInput } from "util/date-util";
import { esitStatiOpt, initialMaxDateForInput, initialMinDate, initialMinDateForInput, isFinestraAbilitata, maxMonth, maxWeek, minMonth, minWeek, modalitaFinestra, oreOpt, TabsContext } from "components/content/content";
import { emptyFlussoForm, isFinestraDisabled } from "../elenco";

// Componente condiviso per il tab Elenco e Avvisi, differenziati da props.tab
export default function ElencoForm(props) {

    const [flussoForm, setFlussoForm] = useState(props.flussoForm);

    const content = useContext(TabsContext);

    const resetFiltri = () => {
        props.resetFiltri();
        setFlussoForm(emptyFlussoForm(props.tab))
    };

    const handleChangeFlusso = (value, name) => {
        setFlussoForm({
            ...flussoForm,
            [name]: value,
        })
    }

    const calcolaMinData = (dataA) => {
        // Se data A è settata allora la min date è data A - giorni intervallo
        if (dataA) {
            const minDateIntervallo = aggiungiGiorni(new Date(dataA), parseInt(propsDominio.intervalloFiltroDate));
            // Se min date è minore della data minima selezionabile viene usata quest'ultima
            return formatDateForInput(minDateIntervallo < initialMinDate ? initialMinDate : minDateIntervallo);
        }
        return initialMinDateForInput;
    }

    const calcolaMaxData = (dataDa) => {
        // Se data DA è settata allora la max date è data DA + giorni intervallo
        if (dataDa) {
            const maxDateIntervallo = aggiungiGiorni(new Date(dataDa), -parseInt(propsDominio.intervalloFiltroDate));
            const today = new Date(Date.now());
            // Se max date supera il giorno odierno viene usato quest'ultimo
            return formatDateForInput(maxDateIntervallo > today ? today : maxDateIntervallo);
        }
        return initialMaxDateForInput;
    }

    const finestraJSX = () => {
        if (isFinestraAbilitata) {
            if (['mese', 'settimana'].includes(modalitaFinestra)) {
                let type, min, max;
                if (modalitaFinestra === 'mese') {
                    type = "month";
                    min = minMonth;
                    max = maxMonth;
                } else if (modalitaFinestra === 'settimana') {
                    type = "week";
                    min = minWeek;
                    max = maxWeek;
                }
                return <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                    <label htmlFor="finestra-temporale" className="form-label">Finestra Temporale:***</label>
                    <input type={type} value={flussoForm.finestra} id="finestra-temporale" name="finestra-temporale" className="form-control" onKeyDown={(e) => e.preventDefault()}
                        min={min} max={max} disabled={isFinestraDisabled(flussoForm)} onChange={(e) => handleChangeFlusso(e.target.value, "finestra")} />
                </div>
            } else if (modalitaFinestra === 'ore') {
                return <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                    <fieldset className="fieldset-bordered">
                        <legend>Finestra Temporale***</legend>
                        <div className="row g-4">
                            <div className="col-12 col-sm-12 col-lg-6">
                                <label htmlFor="finestra-giorno" className="form-label">Giorno:</label>
                                <input type="date" value={flussoForm.finestra} id="finestra-giorno" name="finestra-giorno" className="form-control" min={initialMinDateForInput} max={initialMaxDateForInput}
                                    disabled={isFinestraDisabled(flussoForm)} onKeyDown={(e) => e.preventDefault()} onChange={(e) => handleChangeFlusso(e.target.value, "finestra")} />
                            </div>
                            <div className="col-12 col-sm-12 col-lg-6">
                                <label htmlFor="fascia-oraria" className="form-label">Fascia oraria:</label>
                                <select id="fascia-oraria" name="fascia-oraria" className="form-select" disabled={isFinestraDisabled(flussoForm)}
                                    value={flussoForm.fasciaOraria} onChange={(e) => handleChangeFlusso(parseInt(e.target.value), "fasciaOraria")}>
                                    {oreOpt}
                                </select>
                            </div>
                        </div>
                    </fieldset>
                </div>
            }
        }
        return <></>
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
                                            value={flussoForm.iuv} onChange={(e) => handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), "iuv")}
                                            maxLength={24} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                        <input type="text" id="contesto" name="codiceContesto" className="form-control"
                                            value={flussoForm.codiceContesto} onChange={(e) => handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), "codiceContesto")}
                                            maxLength={35} />
                                    </div>
                                    {props.tab === 'elenco' && <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="stato" className="form-label">Stato:</label>
                                        <select id="stato" name="tempStatoOrEsito" className="form-select" value={flussoForm.statoOrEsito}
                                            onChange={(e) => handleChangeFlusso(e.target.value, "statoOrEsito")}>
                                            <option value={null}></option>
                                            {esitStatiOpt}
                                        </select>
                                    </div>}
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="area" className="form-label">Area:</label>
                                        <select id="area" name="area" className="form-select" value={flussoForm.area}
                                            onChange={(e) => handleChangeFlusso(e.target.value, "area")}>
                                            <option value={null}></option>
                                            {content.aree}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="servizio" className="form-label">Categoria:</label>
                                        <select id="servizio" name="servizio" className="form-select" value={flussoForm.servizio}
                                            onChange={(e) => handleChangeFlusso(e.target.value, "servizio")}>
                                            <option value={null}></option>
                                            {content.servizi}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="pagatore" className="form-label">Pagatore:</label>
                                        <input type="text" id="pagatore" name="idPagatore" className="form-control"
                                            value={flussoForm.idPagatore} onChange={(e) => handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), "idPagatore")}
                                            maxLength={17} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="versante" className="form-label">Versante:</label>
                                        <input type="text" id="versante" name="idVersante" className="form-control" maxLength={24}
                                            value={flussoForm.idVersante} onChange={(e) => handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), "idVersante")} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <fieldset className="fieldset-bordered">
                                            <legend>Data Richiesta**</legend>
                                            <div className="row g-4">
                                                <div className="col-12 col-sm-12 col-lg-6">
                                                    <label htmlFor="data-richiesta-da" className="form-label">Dal:</label>
                                                    <input type="date" value={flussoForm.dataRichiestaDa} onChange={(e) => handleChangeFlusso(e.target.value, "dataRichiestaDa")}
                                                        name="data-richiesta-da" className="form-control" id="data-richiesta-da" onKeyDown={(e) => e.preventDefault()}
                                                        min={calcolaMinData(flussoForm.dataRichiestaA)} max={flussoForm.dataRichiestaA || initialMaxDateForInput} />
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-6">
                                                    <label htmlFor="data-richiesta-a" className="form-label">Al:</label>
                                                    <input type="date" value={flussoForm.dataRichiestaA} onChange={(e) => handleChangeFlusso(e.target.value, "dataRichiestaA")}
                                                        name="data-richiesta-a" className="form-control" id="data-richiesta-a" onKeyDown={(e) => e.preventDefault()}
                                                        min={flussoForm.dataRichiestaDa || initialMinDateForInput} max={calcolaMaxData(flussoForm.dataRichiestaDa)} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <fieldset className="fieldset-bordered">
                                            <legend>Data Ricevuta**</legend>
                                            <div className="row g-4">
                                                <div className="col-12 col-sm-12 col-lg-6">
                                                    <label htmlFor="data-ricevuta-da" className="form-label">Dal:</label>
                                                    <input type="date" value={flussoForm.dataRicevutaDa} onChange={(e) => handleChangeFlusso(e.target.value, "dataRicevutaDa")}
                                                        name="data-ricevuta-da" className="form-control" id="data-ricevuta-da" onKeyDown={(e) => e.preventDefault()}
                                                        min={calcolaMinData(flussoForm.dataRicevutaA)} max={flussoForm.dataRicevutaA || initialMaxDateForInput} />
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-6">
                                                    <label htmlFor="data-ricevuta-a" className="form-label">Al:</label>
                                                    <input type="date" value={flussoForm.dataRicevutaA} onChange={(e) => handleChangeFlusso(e.target.value, "dataRicevutaA")}
                                                        name="data-ricevuta-a" className="form-control" id="data-ricevuta-a" onKeyDown={(e) => e.preventDefault()}
                                                        min={flussoForm.dataRicevutaDa || initialMinDateForInput} max={calcolaMaxData(flussoForm.dataRicevutaDa)} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    {finestraJSX()}
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>                                                        {/* Triggera il componente padre per eseguire una chiamata*/}
                                <button type="button" className="btn btn-primary font-normal" form="elenco-form" style={{ marginRight: "0.05rem" }} onClick={() => props.setFlussoForm(flussoForm)}>Cerca</button>
                                <button type="button" className="btn btn-primary font-normal" form="elenco-form" style={{ marginLeft: "0.05rem" }} onClick={resetFiltri}>Reset Filtri</button>
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