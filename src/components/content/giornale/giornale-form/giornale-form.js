import React, { useState } from "react";
import "./giornale-form.css";

import { removeNumbers, removeSpecialChars } from 'util/string-util';
import { deleteUndefinedValues } from 'util/util';
import { Calendar } from "primereact/calendar";
import { propsDominio } from "util/config";
import { getFirstDayOfMonth, getFirstDayOfWeek, getLastDayOfMonth, getLastDayOfWeek } from "util/date-util";
import { isFinestraAbilitata } from "components/content/content";

const initialGiornaleForm = {
    // idDominio: propsDominio.idDominio, Commentato sennò non trovo dati D:
    iuv: '',
    codContesto: '',
    tipoEvento: '',
    dataOraEvento: null,
    esito: '',
}

export default function GiornaleForm(props) {

    // Contiene i dati del form
    const [giornaleForm, setGiornaleForm] = useState(structuredClone(initialGiornaleForm));

    // Contiene temporaneamente alcuni dati del form
    const [finestraTemporaleList, setFinestraTemporaleList] = useState(null);

    const prepareInputAndCall = () => {
        // Copia il flusso di state e elimina i valori non validi
        let giornale = deleteUndefinedValues(structuredClone(giornaleForm));

        // Se finestraTemporale è abilitata e valorizzata, valorizza il filtro con la finestra
        // altrimenti dataOraEvento sarà già valorizzata
        if (isFinestraAbilitata && !isFinestraDisabled() && finestraTemporaleList)
            addDate(giornale, finestraTemporaleList, 'data')

        // Triggera call del componente padre
        props.setGiornale(giornale);
    }

    // Valorizza le date di un intervallo nel filtro
    const addDate = (giornale, dataList, attribute) => {
        if (dataList) {
            giornale[attribute + 'Da'] = dataList[0];
            if (dataList.length > 1 && dataList[1])
                giornale[attribute + 'A'] = dataList[1];
        }
    };

    const resetFiltri = () => {
        setGiornaleForm(structuredClone(initialGiornaleForm));
        setFinestraTemporaleList(null);
        props.resetFiltri();
    };

    // Gestion onChange di componenti di Giornale
    const handleChangeGiornale = (value, attribute) => {
        let giornaleFormNew = Object.assign({}, giornaleForm);
        giornaleFormNew[attribute] = value;
        setGiornaleForm(giornaleFormNew);
    };

    // Gestisce onChange di componenti di Flusso e input type=text
    const handleChangeText = (e) => {
        handleChangeGiornale(removeSpecialChars(e.target.value).toUpperCase(), e.target.name);
    };

    const handleChangeTipoEvento = (e) => {
        handleChangeGiornale(removeNumbers(removeSpecialChars(e.target.value)), e.target.name);
    };

    // Disabled se almeno uno di questi campi è valorizzato
    const isFinestraDisabled = () => {
        if (giornaleForm.iuv || giornaleForm.codiceContesto
            || giornaleForm.dataOraEvento)
            return true;
        return false;
    }

    const handleChangeFinestra = (e) => {
        if (propsDominio.modalitaFinestra === 'mese')
            setFinestraTemporaleList([getFirstDayOfMonth(e.value), getLastDayOfMonth(e.value)]);
        else if (propsDominio.modalitaFinestra === 'settimana')
            setFinestraTemporaleList([getFirstDayOfWeek(e.value), getLastDayOfWeek(e.value)]);
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
                            <form id="gionnale-form" name="giornale-form">
                                <div className="row gx-5 gy-3">
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="iuv" className="form-label">Iuv:*</label>
                                        <input type="text" id="iuv" name="iuv" className="form-control"
                                            value={giornaleForm.iuv} onChange={(e) => handleChangeText(e)}
                                            maxLength={24} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                        <input type="text" id="contesto" name="codContesto" className="form-control"
                                            value={giornaleForm.codContesto} onChange={(e) => handleChangeText(e)}
                                            maxLength={35} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="esito" className="form-label">Stato:</label>
                                        <select id="esito" name="esito" className="form-select" value={giornaleForm.esito}
                                            onChange={(e) => handleChangeGiornale(e.target.value, 'esito')}>
                                            <option value={null}></option>
                                            {props.stati}
                                        </select>
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="iuv" className="form-label">Tipo Evento:</label>
                                        <input type="text" id="tipoEv" name="tipoEvento" className="form-control"
                                            value={giornaleForm.tipoEvento} onChange={(e) => handleChangeTipoEvento(e)}
                                            maxLength={24} />
                                    </div>
                                    <div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                        <label htmlFor="dataRichiesta" className="form-label">Data Evento:</label>
                                        <Calendar id="dataEvento" name="dataOraEvento" value={giornaleForm.dataOraEvento} readOnlyInput locale="it"
                                            onChange={(e) => handleChangeGiornale(e.value, 'dataOraEvento')} dateFormat="dd/mm/y" showIcon
                                        />
                                    </div>
                                    {isFinestraAbilitata &&
                                        (<div className="col-12 col-xs-12 col-lg-6 col-xl-4">
                                            <label htmlFor="finestraTemporale" className="form-label">Finestra Temporale:**</label>
                                            <Calendar id="finestraTemporale" value={finestraTemporaleList} locale="it" selectionMode="range" finestra={propsDominio.modalitaFinestra}
                                                onChange={(e) => handleChangeFinestra(e)} disabled={isFinestraDisabled()} dateFormat="dd/mm/y" showIcon />{/*view="month"*/}
                                        </div>)}
                                </div>
                            </form>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                                <button type="button" className="btn btn-primary" form="giornale-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={prepareInputAndCall}>Cerca</button>
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