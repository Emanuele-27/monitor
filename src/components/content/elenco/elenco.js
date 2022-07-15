import React, { Component } from "react";
import "./elenco.css";

import { esitiPagamento, statiPagamento, formatEsito, replaceUnderscore } from 'model/tuttiIStati';

import { monitorClient } from "clients/clients";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { idDominio } from 'components/content/content';

import { columnMapper, sortMapper } from 'util/util';

const localeIT = 'it-IT';

const initialLazyParams = {
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: null
}

const initialFlussoForm = {
    // idDominio: idDominio, Commentato sennò non trovo dati n'agg
    idServizio: '',
    iuv: '',
    codiceContesto: '',
    statoPagamento: '',
    esitoPagamento: '',
    tempStatoOrEsito: '',
    area: '',
    servizio: '',
    idPagatore: '',
    idVersante: '',
}

class Elenco extends Component {


    constructor(props) {
        super(props);
        this.state = {
            flussoForm: structuredClone(initialFlussoForm),
            optionsServizi: [],
            optionsAree: [],
            optionsStatiAndEsito: [],
            loading: false,
            totalRecords: 0,
            flussiList: [],
            lazyParams: structuredClone(initialLazyParams)
        };

        this.loadLazyData = this.loadLazyData.bind(this);
        this.resetFiltri = this.resetFiltri.bind(this);
        this.onPage = this.onPage.bind(this);
        this.onSort = this.onSort.bind(this);
    }

    normalizeObject(state) {
        delete state.tempStatoOrEsito;
        return this.deleteUndefinedValues(state);
    }

    deleteUndefinedValues(obj) {
        Object.keys(obj).forEach(key => {
            if (!obj[key])
                delete obj[key];
        });
        return obj;
    }

    async loadLazyData() {
        this.props.blockContent();

        let flussoNormalized = this.normalizeObject(structuredClone(this.state.flussoForm));

        let flussoData = {
            filtroFlusso: {
                da: (this.state.lazyParams.first + 1),
                a: (this.state.lazyParams.first + this.state.lazyParams.rows),
                orderBy: columnMapper.get(this.state.lazyParams.sortField),
                orderType: sortMapper.get(this.state.lazyParams.sortOrder),
                flusso: flussoNormalized
            }
        }

        const fdResult = await monitorClient.getFlussi(flussoData);
        this.setState({
            totalRecords: fdResult.filtroFlusso.count,
            flussiList: fdResult.flussoList,
            loading: false
        });

        this.props.unblockContent();
    }

    resetFiltri() {
        this.setState({
            flussoForm: structuredClone(initialFlussoForm),
            lazyParams: structuredClone(initialLazyParams)
        }, this.loadLazyData);
    }

    onPage(event) {
        this.setState({ lazyParams: event }, this.loadLazyData);
    }

    onSort(event) {
        this.setState({ lazyParams: event }, this.loadLazyData);
    }

    componentDidMount() {
        this.loadLazyData();
        this.buildOptionsStatiEsiti();
        this.buildOptionsServiziEAree();
    }

    columnIUVCodContesto(rowData) {
        return rowData.iuv + ' - ' + rowData.codiceContesto;
    }

    columnPagatoreVersante(rowData) {
        return rowData.idPagatore + ' - ' + rowData.idVersante;
    }

    columnImporto(rowData) {
        return rowData.importo.toLocaleString(localeIT, {
            style: 'currency',
            currency: 'EUR',
        });
    }

    columnDataRichiesta(rowData) {
        if (rowData.dataRichiesta)
            return new Date(rowData.dataRichiesta).toLocaleString(localeIT);
        return '';
    }

    columnDataRicevuta(rowData) {
        if (rowData.dataRicevuta)
            return new Date(rowData.dataRicevuta).toLocaleString(localeIT).replace(',', '');
        return '';
    }

    columnStato(rowData) {
        if (rowData.esitoPagamento)
            return formatEsito(rowData.esitoPagamento);
        else if (rowData.statoPagamento)
            return replaceUnderscore(rowData.statoPagamento);
        return '';
    }

    changeState(value, attribute) {
        let newFlussoForm = this.state.flussoForm;
        newFlussoForm[attribute] = value;
        this.setState({
            flussoForm: newFlussoForm
        });
    }

    handleChangeForm(e, attribute) {
        this.changeState(e.target.value.trim(), attribute);
    }

    handleChangeStato(e) {
        this.changeState(e.target.value, 'tempStatoOrEsito');
        let found = false;
        for (const esito of esitiPagamento) {
            if (esito.name === e.target.value) {
                this.changeState(esito.name, 'esitoPagamento');
                this.changeState('', 'statoPagamento')
                found = true;
                break;
            }
        }

        if (!found) {
            for (const stato of statiPagamento) {
                if (stato === e.target.value) {
                    this.changeState(stato, 'statoPagamento');
                    this.changeState('', 'esitoPagamento');
                    break;
                }
            }
        }
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
                                <form id="elenco-form">
                                    <div className="row gx-5 gy-3">
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="iuv" className="form-label">Iuv:*</label>
                                            <input type="text" id="iuv" name="iuv" className="form-control"
                                                value={this.state.flussoForm.iuv} onChange={(e) => this.handleChangeForm(e, 'iuv')} />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                            <input type="text" id="contesto" name="contesto" className="form-control"
                                                value={this.state.flussoForm.codiceContesto} onChange={(e) => this.handleChangeForm(e, 'codiceContesto')} />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="stato" className="form-label">Stato:</label>
                                            <select id="stato" name="stato" className="form-select" value={this.state.flussoForm.tempStatoOrEsito}
                                                onChange={(e) => this.handleChangeStato(e)}>
                                                <option value={null}></option>
                                                {this.state.optionsStatiAndEsito}
                                            </select>
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="area" className="form-label">Area:</label>
                                            <select id="area" name="area" className="form-select" value={this.state.flussoForm.area}
                                                onChange={(e) => this.handleChangeForm(e, 'area')}>
                                                <option value={null}></option>
                                                {this.state.optionsAree}
                                            </select>
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="servizio" className="form-label">Categoria:</label>
                                            <select id="servizio" name="servizio" className="form-select" value={this.state.flussoForm.servizio}
                                                onChange={(e) => this.handleChangeForm(e, 'servizio')}>
                                                <option value={null}></option>
                                                {this.state.optionsServizi}
                                            </select>
                                        </div>
                                    </div>
                                </form>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                                    <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginRight: "0.1rem" }} onClick={this.loadLazyData}>Cerca</button>
                                    <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginLeft: "0.1rem" }} onClick={this.resetFiltri}>Reset Filtri</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable id="elenco-table" lazy showGridlines stripedRows value={this.state.flussiList} rows={10} rowsPerPageOptions={[10, 25, 50]} responsiveLayout="scroll"
                    header={"Numero Transazioni: " + this.state.totalRecords} footer={"Numero Transazioni: " + this.state.totalRecords} totalRecords={this.state.totalRecords}
                    first={this.state.lazyParams.first} onPage={this.onPage} loading={this.state.loading} paginator paginatorPosition="bottom" style={{ paddingTop: "2rem" }}
                    removableSort onSort={this.onSort} sortField={this.state.lazyParams.sortField} sortOrder={this.state.lazyParams.sortOrder}>
                    <Column header="IUV - Codice Contesto" body={this.columnIUVCodContesto} />
                    <Column field="area" header="Area" />
                    <Column field="servizio" header="Categoria" />
                    <Column sortable field="dataRichiesta" header="Data Richiesta" body={this.columnDataRichiesta} />
                    <Column sortable field="dataRicevuta" header="Data Ricevuta" body={this.columnDataRicevuta} />
                    <Column header="Pagatore - Versante" body={this.columnPagatoreVersante} />
                    <Column header="Importo" body={this.columnImporto} />
                    <Column header="Stato" body={this.columnStato} />
                    {/* TO DO Opzioni, Opzioni comuni */}
                    {/* <Column header="Opzioni" body={this.columnPagatoreVersante}  />
                    <Column header="Opzioni Comuni" body={this.columnPagatoreVersante}  /> */}
                </DataTable>
            </div>
        );
    }

    buildOptionsStatiEsiti() {
        const esitiOptions = esitiPagamento.map(esito => <option key={esito.name} value={esito.name}>{formatEsito(esito.name)}</option>);
        const statiOptions = statiPagamento.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => <option key={stato} value={stato}>{replaceUnderscore(stato)}</option>);

        this.setState({
            optionsStatiAndEsito: esitiOptions.concat(statiOptions)
        });
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