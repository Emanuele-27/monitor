import React, { Component } from "react";
import "./elenco.css";
import { esitiPagamento, stati } from 'model/tuttiIStati';

class Elenco extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iuv: '',
            codiceContesto: '',
            stato: ''
        };

    }

    buildOptionsStato() {
        const esitiFormattati = esitiPagamento.map(esito => {
            if (esito.label.includes('PAGAMENTO'))
                esito.label = esito.label.slice(esito.label.indexOf('PAGAMENTO') + 9);
            return esito.label.replaceAll('_', ' ').trim();
        })
        const statiFormattati = stati.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => stato.replaceAll('_', ' ').trim());
        return (esitiFormattati.concat(statiFormattati)).map(option => <option key={option} value={option}>{option}</option>);
    }

    render() {
        const optionsStato = this.buildOptionsStato();
        return (
            <div>
                <div className="accordion" id="elenco-accordion">
                    <div className="accordion-item">
                        <h3 className="accordion-header" id="elenco-accordion-heading">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">
                                Ricerca
                            </button>
                        </h3>
                        <div id="div-collapsible-1" className="accordion-collapse collapse" aria-labelledby="elenco-accordion-heading" data-bs-parent="#elenco-accordion">
                            <div className="accordion-body">
                                <form>
                                    <div className="row gx-5">
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="iuv" className="form-label">Iuv:*</label>
                                            <input type="text" id="iuv" name="iuv" className="form-control"
                                                value={this.state.iuv} onChange={(e) => this.setState({ iuv: e.target.value })} />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                            <input type="text" id="contesto" name="contesto" className="form-control"
                                                value={this.state.codiceContesto} onChange={(e) => this.setState({ codiceContesto: e.target.value })} />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="stato" className="form-label">Stato:</label>
                                            <select id="stato" name="stato" className="form-select">
                                                <option value={undefined}></option>
                                                {optionsStato}
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Elenco;