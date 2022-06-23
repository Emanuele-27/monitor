import React, { Component } from "react";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import "./elenco.css";

class Elenco extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iuv: '',
            codiceContesto: '',
            areaSelezionata: '',
            value4: '',
            value5: ''
        };

        this.aree = [
            { area: 'Seleziona', value: undefined},
            { area: 'DOGANE', value: 'DOGANE'},
            { area: 'MONOPOLI', value: 'MONOPOLI' },
            { area: 'MEF', value: 'MEF'},
            { area: 'EQUITALIA', value: 'EQUITALIA' },
            { area: 'ACCISE', value: 'ACCISE' }
        ];
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
                                <div className="row gy-3">

                                    {/* Riga1 */}
                                    <div className="col-md-1"></div>
                                    <div className="col-md-2 elenco-form-label">
                                        <label htmlFor="iuv" className="block"><b>Iuv:*</b></label>
                                    </div>
                                    <div className="col-md-3">
                                        <InputText id="iuv" value={this.state.iuv} onChange={(e) => this.setState({ iuv: e.target.value })} />
                                    </div>
                                    <div className="col-md-2 elenco-form-label">
                                        <label htmlFor="contesto" className="block"><b>Codice Contesto:*</b></label>
                                    </div>
                                    <div className="col-md-3">
                                        <InputText id="contesto" value={this.state.codiceContesto} onChange={(e) => this.setState({ codiceContesto: e.target.value })} />
                                    </div>
                                    <div className="col-md-1"></div>

                                    {/* Riga2 */}
                                    <div className="col-md-1"></div>
                                    <div className="col-md-2 elenco-form-label">
                                        <label htmlFor="area" className="block"><b>Area:</b></label>
                                    </div>
                                    <div className="col-md-3">
                                        <Dropdown id="area" value={this.state.areaSelezionata} options={this.aree} onChange={(e) => this.setState({ areaSelezionata: e.target.value })}
                                            optionLabel="area" placeholder="Seleziona" />
                                    </div>
                                    <div className="col-md-2 elenco-form-label">
                                        <label htmlFor="categoria" className="block"><b>Categoria:</b></label>
                                    </div>
                                    <div className="col-md-3">
                                        <Dropdown id="categoria" value={this.state.areaSelezionata} options={this.aree} onChange={(e) => this.setState({ codiceContesto: e.target.value })}
                                            optionLabel="area" placeholder="Seleziona" />
                                    </div>
                                    <div className="col-md-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Elenco;