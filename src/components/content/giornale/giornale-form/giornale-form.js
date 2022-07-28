import React, { useState } from "react";
import "./giornale-form.css";

import { removeNumbers, removeSpecialChars } from 'util/string-util';
import { Calendar } from "primereact/calendar";
import { propsDominio } from "util/config";
import { calcolaDatePerFinestra } from "util/date-util";
import { isFinestraAbilitata, modalitaFinestra } from "components/content/content";
import { emptyGiornaleForm, isFinestraDisabled } from "../giornale";


export default function GiornaleForm(props) {

    // Contiene i dati del form
    const [giornaleForm, setGiornaleForm] = useState(props.giornaleForm);

    const resetFiltri = () => {
        props.resetFiltri();
        setGiornaleForm(emptyGiornaleForm());
    };

    return (<>
        <div className="container">
            <div className="accordion" id="rpt-accordion">
                <div className="accordion-item">
                    <h3 className="accordion-header" id="rpt-accordion-heading">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">
                            Ricerca {props.fraseFinestra}
                        </button>
                    </h3>
                    <div id="div-collapsible-1" className="accordion-collapse collapse" aria-labelledby="rpt-accordion-heading" data-bs-parent="#rpt-accordion">
                        <div className="accordion-body">
                            <form id="gionnale-form" name="giornale-form">
                                <div className="row gx-5 gy-3">
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="iuv" className="form-label">Iuv:*</label>
                                        <input type="text" id="iuv" name="iuv" className="form-control"
                                            value={giornaleForm.iuv} onChange={(e) => setGiornaleForm({
                                                ...giornaleForm,
                                                iuv: removeSpecialChars(e.target.value).toUpperCase()
                                            })}
                                            maxLength={24} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                        <input type="text" id="contesto" name="codContesto" className="form-control"
                                            value={giornaleForm.codContesto} onChange={(e) => setGiornaleForm({
                                                ...giornaleForm,
                                                codContesto: removeSpecialChars(e.target.value).toUpperCase()
                                            })}
                                            maxLength={35} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="esito" className="form-label">Stato:</label>
                                        <select id="esito" name="esito" className="form-select" value={giornaleForm.esito}
                                            onChange={(e) => setGiornaleForm({
                                                ...giornaleForm,
                                                esito: e.target.value
                                            })}>
                                            <option value={null}></option>
                                            {props.stati}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="iuv" className="form-label">Tipo Evento:</label>
                                        <input type="text" id="tipoEv" name="tipoEvento" className="form-control"
                                            value={giornaleForm.tipoEvento} onChange={(e) => setGiornaleForm({
                                                ...giornaleForm,
                                                tipoEvento: removeNumbers(removeSpecialChars(e.target.value))
                                            })}
                                            maxLength={24} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="dataRichiesta" className="form-label">Data Evento:</label>
                                        <Calendar id="dataEvento" name="dataOraEvento" value={giornaleForm.dataOraEvento} readOnlyInput locale="it"
                                            onChange={(e) => setGiornaleForm({
                                                ...giornaleForm,
                                                dataOraEvento: e.value
                                            })} dateFormat="dd/mm/y" showIcon
                                        />
                                    </div>
                                    {isFinestraAbilitata &&
                                        (<div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                            <label htmlFor="finestraTemporale" className="form-label">Finestra Temporale:**</label>
                                            <Calendar id="finestraTemporale" value={giornaleForm.finestraTemporaleList} locale="it" selectionMode="range" finestra={propsDominio.modalitaFinestra}
                                                onChange={(e) => setGiornaleForm({
                                                    ...giornaleForm,
                                                    finestraTemporaleList: calcolaDatePerFinestra(modalitaFinestra, e.value)
                                                })}
                                                disabled={isFinestraDisabled(giornaleForm)} dateFormat="dd/mm/y" showIcon />{/*view="month"*/}
                                        </div>)}
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                                <button type="button" className="btn btn-primary" form="giornale-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={() => props.setGiornaleForm(giornaleForm)}>Cerca</button>
                                <button type="button" className="btn btn-primary" form="giornale-form" style={{ fontWeight: "600", marginLeft: "0.05rem" }} onClick={resetFiltri}>Reset Filtri</button>
                            </div>

                            <p style={{ marginBottom: "0", marginTop: "1rem" }}>
                                <b>*</b> I campi <b>Iuv</b> e <b>Codice Contesto</b> consentono di effettuare una ricerca puntuale entro gli ultimi {-propsDominio.intervalloDate} mesi a meno che venga specificata la <b>data</b>. <br />
                                {isFinestraAbilitata && (<><b>**</b> La ricerca per <b>Iuv</b> , <b>Codice Contesto</b> e/o per <b>data</b> disabilita la finestra temporale.</>)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}