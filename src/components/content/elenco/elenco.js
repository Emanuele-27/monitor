import React, { Component } from "react";
import "./elenco.css";

import { esitiPagamento, stati } from 'model/tuttiIStati';

import { monitorClient } from "clients/clients";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { idDominio } from 'components/content/content';

class Elenco extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iuv: '',
            codiceContesto: '',
            stato: '',
            optionsServizi: [],
            optionsAree: [],
            list: [
                {
                    iuvCodContesto: '30005436298 - EQRAV321634986',
                    area: 'ADM',
                    categoria: 'BOLLO',
                    stato: 'RPT ATTIVATA'
                },
                {
                    iuvCodContesto: '30005436298 - EQRAV321634986',
                    area: 'DOGANE',
                    categoria: 'ALCOL',
                    stato: 'RPT ACCETTATA'
                },
                {
                    iuvCodContesto: '30005436298 - EQRAV321634986',
                    area: 'ENTRATE',
                    categoria: 'EQRAV',
                    stato: 'RPT INVIATA A PSP'
                }
            ]
        };
        this.optionsStati = this.buildOptionsStati();
        this.buildOptionsServiziEAree();
    }

    render() {
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
                                    <div className="row gx-5 gy-3">
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
                                                <option value={null}></option>
                                                {this.optionsStati}
                                            </select>
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="area" className="form-label">Area:</label>
                                            <select id="area" name="area" className="form-select">
                                                <option value={null}></option>
                                                {this.state.optionsAree}
                                            </select>
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="categoria" className="form-label">Categoria:</label>
                                            <select id="categoria" name="categoria" className="form-select">
                                                <option value={null}></option>
                                                {this.state.optionsServizi}
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable paginator removableSort stripedRows showGridlines value={this.state.list} rows={10} rowsPerPageOptions={[10,20,50]} responsiveLayout="scroll" header="Numero Transazioni: 3" footer="Numero Transazioni: 3"
                    style={{ paddingTop: "2rem" }} >
                    <Column sortable field="iuvCodContesto" header="IUV - Codice Contesto" />
                    <Column sortable field="area" header="Area" />
                    <Column sortable field="categoria" header="Categoria" />
                    <Column sortable field="stato" header="Stato" />
                </DataTable>
            </div>
        );
    }

    buildOptionsStati() {
        const esitiFormattati = esitiPagamento.map(esito => {
            if (esito.label.includes('PAGAMENTO'))
                esito.label = esito.label.slice(esito.label.indexOf('PAGAMENTO') + 9);
            return esito.label.replaceAll('_', ' ').trim();
        })
        const statiFormattati = stati.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => stato.replaceAll('_', ' ').trim());
        return (esitiFormattati.concat(statiFormattati)).map(option => <option key={option} value={option}>{option}</option>);
    }

    async buildOptionsServiziEAree() {
        const serviziData = await monitorClient.getServizi();
        const serviziDominioCorrente = serviziData.serviziList.filter(servizio => servizio.idDominio === idDominio);
        const serviziOpt = serviziDominioCorrente.map(servizio =>
            <option key={servizio.servizio} value={servizio.servizio}>{servizio.servizio + ' - ' + servizio.denominazioneServizio}</option>
        );

        let areeMap = new Map();
        serviziDominioCorrente.forEach(servizio => {
            let area = servizio.area;
            if (!areeMap.has(area))
                areeMap.set(area, <option key={area} value={area}>{area}</option>);
        });

        this.setState({
            optionsServizi: serviziOpt,
            optionsAree: Array.from(areeMap.values())
        });
    }
}

export default Elenco;