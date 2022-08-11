import React, { useState } from "react";
import "./rpt-form.css";

import { removeSpecialChars } from 'util/string-util';
import { emptyFlussoForm } from "../rpt";

export default function RptForm(props) {

    // Contiene i dati del form
    const [flussoForm, setFlussoForm] = useState(props.flussoForm);

    const resetFiltri = () => {
        setFlussoForm(emptyFlussoForm);
        props.resetFiltri();
    };

    const handleChangeFlusso = (value, name) => {
        setFlussoForm({
            ...flussoForm,
            [name]: value,
        })
    }

    return (<>
        <div className="container">
            <div className="accordion" id="rpt-accordion">
                <div className="accordion-item">
                    <h3 className="accordion-header" id="rpt-accordion-heading">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">
                            Ricerca
                        </button>
                    </h3>
                    <div id="div-collapsible-1" className="accordion-collapse collapse" aria-labelledby="rpt-accordion-heading" data-bs-parent="#rpt-accordion">
                        <div className="accordion-body">
                            <form id="rpt-form" name="rpt-form">
                                <div className="row gx-5 gy-3">
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="iuv" className="form-label">Iuv:*</label>
                                        <input type="text" id="iuv" name="iuv" className="form-control" maxLength={24}
                                            value={flussoForm.iuv} onChange={(e) => handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), "iuv")} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                        <input type="text" id="contesto" name="codiceContesto" className="form-control" maxLength={35}
                                            value={flussoForm.codiceContesto} onChange={(e) => handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), "codiceContesto")} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="area" className="form-label">Area:</label>
                                        <select id="area" name="area" className="form-select" value={flussoForm.area}
                                            onChange={(e) => handleChangeFlusso(removeSpecialChars(e.target.value).toUpperCase(), "area")}>
                                            <option value={null}></option>
                                            {props.aree}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="servizio" className="form-label">Categoria:</label>
                                        <select id="servizio" name="servizio" className="form-select" value={flussoForm.servizio}
                                            onChange={(e) => handleChangeFlusso(e.target.value, "servizio")}>
                                            <option value={null}></option>
                                            {props.servizi}
                                        </select>
                                    </div>
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                                <button type="button" className="btn btn-primary" form="rpt-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={() => props.setFlussoForm(flussoForm)}>Cerca</button>
                                <button type="button" className="btn btn-primary" form="rpt-form" style={{ fontWeight: "600", marginLeft: "0.05rem" }} onClick={resetFiltri}>Reset Filtri</button>
                            </div>
                            <p style={{ marginBottom: "0", marginTop: "1rem" }}>
                                <b>*</b> I campi <b>Iuv</b> e <b>Codice Contesto</b> consentono di effettuare una ricerca puntuale.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    </>
    );
}