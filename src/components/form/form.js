import { esitStatiOpt, initialMaxDateForInput, initialMinDateForInput, initialMinDate, maxMonth, maxWeek, minMonth, minWeek, oreOpt, TabsContext, modalitaFinestra } from "components/content/content";
import { isFinestraDisabled } from "components/content/elenco/elenco";
import { propsDominio } from "config/config";
import { useContext, useState } from "react";
import { aggiungiGiorni, formatDateForInput } from "util/date-util";
import { removeNumbers, removeSpecialChars } from "util/string-util";

/**
 * @param {{ 
 * initialFormData: object, // default values form
 * emptyFormData: object, // values on reset
 * cerca: Function,
 * reset: Function,
 * iuv: boolean,
 * codContesto: boolean,
 * stato: boolean,
 * area: boolean,
 * categoria: boolean,
 * pagatore: boolean,
 * versante: boolean,
 * tipoEvento: boolean,
 * dataEvento: boolean,
 * dataRichiesta: boolean,
 * dataRicevuta: boolean
 * }} props Props for the component
 */

export default function Form(props) {

    const [form, setForm] = useState(structuredClone(props.initialFormData));

    const content = useContext(TabsContext);

    const handleChangeForm = (value, name) => {
        setForm({
            ...form,
            [name]: value,
        })
    }

    const resetFiltri = () => {
        setForm(structuredClone(props.emptyFormData));
        props.reset();
    };

    const iuv = <>
        <label htmlFor="iuv" className="form-label">Iuv:*</label>
        <input type="text" id="iuv" name="iuv" className="form-control"
            value={form.iuv} onChange={(e) => handleChangeForm(removeSpecialChars(e.target.value).toUpperCase(), "iuv")}
            maxLength={24} />
    </>

    const codContesto = <>
        <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
        <input type="text" id="contesto" name="codiceContesto" className="form-control"
            value={form.codiceContesto} onChange={(e) => handleChangeForm(removeSpecialChars(e.target.value).toUpperCase(), "codiceContesto")}
            maxLength={35} />
    </>

    const stato = <>
        <label htmlFor="stato" className="form-label">Stato:</label>
        <select id="stato" name="tempStatoOrEsito" className="form-select" value={form.statoOrEsito}
            onChange={(e) => handleChangeForm(e.target.value, "statoOrEsito")}>
            <option value={null}></option>
            {esitStatiOpt}
        </select>
    </>

    const area = <>
        <label htmlFor="area" className="form-label">Area:</label>
        <select id="area" name="area" className="form-select" value={form.area}
            onChange={(e) => handleChangeForm(e.target.value, "area")}>
            <option value={null}></option>
            {content.aree}
        </select>
    </>

    const categoria = <>
        <label htmlFor="servizio" className="form-label">Categoria:</label>
        <select id="servizio" name="servizio" className="form-select" value={form.servizio}
            onChange={(e) => handleChangeForm(e.target.value, "servizio")}>
            <option value={null}></option>
            {content.servizi}
        </select>
    </>

    const pagatore = <>
        <label htmlFor="pagatore" className="form-label">Pagatore:</label>
        <input type="text" id="pagatore" name="idPagatore" className="form-control"
            value={form.idPagatore} onChange={(e) => handleChangeForm(removeSpecialChars(e.target.value).toUpperCase(), "idPagatore")}
            maxLength={17} />
    </>

    const versante = <>
        <label htmlFor="versante" className="form-label">Versante:</label>
        <input type="text" id="versante" name="idVersante" className="form-control" maxLength={24}
            value={form.idVersante} onChange={(e) => handleChangeForm(removeSpecialChars(e.target.value).toUpperCase(), "idVersante")} />
    </>

    const tipoEvento = <>
        <label htmlFor="iuv" className="form-label">Tipo Evento:</label>
        <input type="text" id="tipoEv" name="tipoEvento" className="form-control" maxLength={24}
            value={form.tipoEvento} onChange={(e) => handleChangeForm(removeNumbers(removeSpecialChars(e.target.value)), "tipoEvento")} />
    </>

    const dataEvento = <>
        <label htmlFor="data-evento" className="form-label">Data Evento:</label>
        <input type="date" value={form.dataOraEvento} onChange={(e) => handleChangeForm(e.target.value, "dataOraEvento")}
            id="data-evento" name="data-evento" className="form-control" />
    </>

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

    const dataRichiesta = <fieldset className="fieldset-bordered">
        <legend>Data Richiesta**</legend>
        <div className="row g-4">
            <div className="col-12 col-sm-12 col-lg-6">
                <label htmlFor="data-richiesta-da" className="form-label">Dal:</label>
                <input type="date" value={form.dataRichiestaDa} onChange={(e) => handleChangeForm(e.target.value, "dataRichiestaDa")}
                    name="data-richiesta-da" className="form-control" id="data-richiesta-da" onKeyDown={(e) => e.preventDefault()}
                    min={calcolaMinData(form.dataRichiestaA)} max={form.dataRichiestaA || initialMaxDateForInput} />
            </div>
            <div className="col-12 col-sm-12 col-lg-6">
                <label htmlFor="data-richiesta-a" className="form-label">Al:</label>
                <input type="date" value={form.dataRichiestaA} onChange={(e) => handleChangeForm(e.target.value, "dataRichiestaA")}
                    name="data-richiesta-a" className="form-control" id="data-richiesta-a" onKeyDown={(e) => e.preventDefault()}
                    min={form.dataRichiestaDa || initialMinDateForInput} max={calcolaMaxData(form.dataRichiestaDa)} />
            </div>
        </div>
    </fieldset>

    const dataRicevuta = <fieldset className="fieldset-bordered">
        <legend>Data Ricevuta**</legend>
        <div className="row g-4">
            <div className="col-12 col-sm-12 col-lg-6">
                <label htmlFor="data-ricevuta-da" className="form-label">Dal:</label>
                <input type="date" value={form.dataRicevutaDa} onChange={(e) => handleChangeForm(e.target.value, "dataRicevutaDa")}
                    name="data-ricevuta-da" className="form-control" id="data-ricevuta-da" onKeyDown={(e) => e.preventDefault()}
                    min={calcolaMinData(form.dataRicevutaA)} max={form.dataRicevutaA || initialMaxDateForInput} />
            </div>
            <div className="col-12 col-sm-12 col-lg-6">
                <label htmlFor="data-ricevuta-a" className="form-label">Al:</label>
                <input type="date" value={form.dataRicevutaA} onChange={(e) => handleChangeForm(e.target.value, "dataRicevutaA")}
                    name="data-ricevuta-a" className="form-control" id="data-ricevuta-a" onKeyDown={(e) => e.preventDefault()}
                    min={form.dataRicevutaDa || initialMinDateForInput} max={calcolaMaxData(form.dataRicevutaDa)} />
            </div>
        </div>
    </fieldset>

    const finestra = () => {
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
            return <>
                <label htmlFor="finestra-temporale" className="form-label">Finestra Temporale:***</label>
                <input type={type} value={form.finestra} id="finestra-temporale" name="finestra-temporale" className="form-control" onKeyDown={(e) => e.preventDefault()}
                    min={min} max={max} disabled={isFinestraDisabled(form)} onChange={(e) => handleChangeForm(e.target.value, "finestra")} />
            </>
        } else if (modalitaFinestra === 'ore') {
            return <fieldset className="fieldset-bordered">
                <legend>Finestra Temporale***</legend>
                <div className="row g-4">
                    <div className="col-12 col-sm-12 col-lg-6">
                        <label htmlFor="finestra-giorno" className="form-label">Giorno:</label>
                        <input type="date" value={form.finestra} id="finestra-giorno" name="finestra-giorno" className="form-control" min={initialMinDateForInput} max={initialMaxDateForInput}
                            disabled={isFinestraDisabled(form)} onKeyDown={(e) => e.preventDefault()} onChange={(e) => handleChangeForm(e.target.value, "finestra")} />
                    </div>
                    <div className="col-12 col-sm-12 col-lg-6">
                        <label htmlFor="fascia-oraria" className="form-label">Fascia oraria:</label>
                        <select id="fascia-oraria" name="fascia-oraria" className="form-select" disabled={isFinestraDisabled(form)}
                            value={form.fasciaOraria} onChange={(e) => handleChangeForm(parseInt(e.target.value), "fasciaOraria")}>
                            {oreOpt}
                        </select>
                    </div>
                </div>
            </fieldset>

        }
        return <></>
    }

    // Wrappa i componenti in base allo schema qui definito
    const wrapComponent = component => <div className="col-12 col-xs-12 col-lg-6 col-xl-4">{component}</div>

    return (
        <>
            <form>
                <div className="row gx-5 gy-3">
                    {props.iuv && wrapComponent(iuv)}
                    {props.codContesto && wrapComponent(codContesto)}
                    {props.stato && wrapComponent(stato)}
                    {props.area && wrapComponent(area)}
                    {props.categoria && wrapComponent(categoria)}
                    {props.pagatore && wrapComponent(pagatore)}
                    {props.versante && wrapComponent(versante)}
                    {props.tipoEvento && wrapComponent(tipoEvento)}
                    {props.dataEvento && wrapComponent(dataEvento)}
                    {props.dataRichiesta && wrapComponent(dataRichiesta)}
                    {props.dataRicevuta && wrapComponent(dataRicevuta)}
                    {props.finestra && wrapComponent(finestra())}
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                    <button type="button" className="btn btn-primary font-normal" form="elenco-form" style={{ marginRight: "0.05rem" }} onClick={() => props.cerca(form)}>Cerca</button>
                    <button type="button" className="btn btn-primary font-normal" form="elenco-form" style={{ marginLeft: "0.05rem" }} onClick={resetFiltri}>Reset Filtri</button>
                </div>
            </form>
        </>
    );
}