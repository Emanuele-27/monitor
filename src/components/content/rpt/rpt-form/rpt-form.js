import React, { useEffect, useMemo, useState } from "react";
import "./rpt-form.css";

import { monitorClient } from "clients/clients";

import { propsDominio } from 'util/config';

import { removeSpecialChars } from 'util/string-util';
import { addLocale } from 'primereact/api';
import { deleteUndefinedValues, localeDate } from 'util/util';

const initialFlussoForm = {
    // idDominio: propsDominio.idDominio, Commentato sennò non trovo dati D:
    iuv: '',
    codiceContesto: '',
    area: '',
    servizio: '',
}

export default function RptForm(props) {

    // Contiene i dati del form
    const [flussoForm, setFlussoForm] = useState(structuredClone(initialFlussoForm));

    // Options per select
    const [optionsServizi, setOptionsServizi] = useState([]);
    const [optionsAree, setOptionsAree] = useState([]);

    useEffect(() => {
        buildOptionsServiziEAree();
    }, []);

    useMemo(() => {
        addLocale('it', localeDate);
    }, [])

    const call = () => {
        props.call(prepareInput());
    }

    const prepareInput = () => {
        // Copia il flusso di state e elimina i valori non validi
        let flusso = deleteUndefinedValues(structuredClone(flussoForm));

        return flusso;
    }

    const resetFiltri = () => {
        setFlussoForm(structuredClone(initialFlussoForm));
        props.resetLazy();
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
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="area" className="form-label">Area:</label>
                                        <select id="area" name="area" className="form-select" value={flussoForm.area}
                                            onChange={(e) => handleChangeFlusso(e.target.value, e.target.name)}>
                                            <option value={null}></option>
                                            {optionsAree}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="servizio" className="form-label">Categoria:</label>
                                        <select id="servizio" name="servizio" className="form-select" value={flussoForm.servizio}
                                            onChange={(e) => handleChangeFlusso(e.target.value, e.target.name)}>
                                            <option value={null}></option>
                                            {optionsServizi}
                                        </select>
                                    </div>
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                                <button type="button" className="btn btn-primary" form="rpt-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={call}>Cerca</button>
                                <button type="button" className="btn btn-primary" form="rpt-form" style={{ fontWeight: "600", marginLeft: "0.05rem" }} onClick={resetFiltri}>Reset Filtri</button>
                            </div>

                            <p style={{ marginBottom: "0", marginTop: "1rem" }}>
                                <b>*</b> I campi <b>Iuv</b> e <b>Codice Contesto</b> consentono di effettuare una ricerca puntuale.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}