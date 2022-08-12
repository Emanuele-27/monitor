import React, { useState } from "react";
import "./giornale-form.css";

import { removeNumbers, removeSpecialChars } from 'util/string-util';
import { propsDominio } from "config/config";
import { esitStatiOpt, isFinestraAbilitata, maxMonth, maxWeek, minMonth, minWeek, modalitaFinestra } from "components/content/content";
import { emptyGiornaleForm, isFinestraDisabled } from "../giornale";


export default function GiornaleForm(props) {

    // Contiene i dati del form
    const [giornaleForm, setGiornaleForm] = useState(props.giornaleForm);

    const resetFiltri = () => {
        props.resetFiltri();
        setGiornaleForm(emptyGiornaleForm());
    };

    const handleChangeGiornale = (value, name) => {
        setGiornaleForm({
            ...giornaleForm,
            [name]: value,
        })
    }

    const finestraJSX = () => {
        if (isFinestraAbilitata) {
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
                <input type={type} value={giornaleForm.finestra} id="finestra-temporale" name="finestra-temporale" className="form-control" onKeyDown={(e) => e.preventDefault()}
                    min={min} max={max} disabled={isFinestraDisabled(giornaleForm)} onChange={(e) => handleChangeGiornale(e.target.value, "finestra")} />
            </div>
        }
        return <></>
    }

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
                                        <input type="text" id="iuv" name="iuv" className="form-control" maxLength={24}
                                            value={giornaleForm.iuv} onChange={(e) => handleChangeGiornale(removeSpecialChars(e.target.value).toUpperCase(), "iuv")} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                        <input type="text" id="contesto" name="codContesto" className="form-control" maxLength={35}
                                            value={giornaleForm.codContesto} onChange={(e) => handleChangeGiornale(removeSpecialChars(e.target.value).toUpperCase(), "codContesto")} />

                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="esito" className="form-label">Stato:</label>
                                        <select id="esito" name="esito" className="form-select" value={giornaleForm.esito}
                                            onChange={(e) => handleChangeGiornale(e.target.value, "esito")}>
                                            <option value={null}></option>
                                            {esitStatiOpt}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="iuv" className="form-label">Tipo Evento:</label>
                                        <input type="text" id="tipoEv" name="tipoEvento" className="form-control" maxLength={24}
                                            value={giornaleForm.tipoEvento} onChange={(e) => handleChangeGiornale(removeNumbers(removeSpecialChars(e.target.value)), "tipoEvento")} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="data-evento" className="form-label">Data Evento:</label>
                                        <input type="date" value={giornaleForm.dataOraEvento} onChange={(e) => handleChangeGiornale(e.target.value, "dataOraEvento")}
                                            id="data-evento" name="data-evento" className="form-control" />
                                    </div>
                                    {finestraJSX()}
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
        </div >
    </>
    );
}