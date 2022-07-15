import React, { Component } from "react";
import "./elenco.css";

import { esitiPagamento, statiPagamento, formatEsito, replaceUnderscore } from 'model/tuttiIStati';

import { monitorClient } from "clients/clients";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

import { idDominio } from 'components/content/content';

import { columnMapper, sortMapper, localeIT, localeDate, acceptLanguage } from 'util/util';
import { removeSpecialChars } from 'util/stringUtil';

const initialLazyParams = {
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: null
}

const initialFlussoForm = {
    // idDominio: idDominio, Commentato sennò non trovo dati D:
    iuv: '',
    codiceContesto: '',
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
            tempStatoOrEsito: '',
            dataRichiestaList: null,
            dataRicevutaList: null,
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

        addLocale(acceptLanguage, localeDate);
    }

    deleteUndefinedValues(obj) {
        Object.keys(obj).forEach(key => {
            if (!obj[key])
                delete obj[key];
        });
        return obj;
    }

    addStatoOrEsito(flusso, statoOrEsito) {
        if (statoOrEsito) {
            let found = false;
            for (const esito of esitiPagamento) {
                if (esito.name === statoOrEsito) {
                    flusso.esitoPagamento = esito.name;
                    found = true;
                    break;
                }
            }

            if (!found) {
                for (const stato of statiPagamento) {
                    if (stato === statoOrEsito) {
                        flusso.statoPagamento = stato
                        break;
                    }
                }
            }
        }
    }

    addDate(flusso, dataList, attribute) {
        if (dataList) {
            flusso[attribute + 'Da'] = dataList[0];
            if (dataList.length > 1 && dataList[1])
                flusso[attribute + 'A'] = dataList[1];
        }
    }

    loadLazyData() {
        this.props.blockContent();

        // Copia il flusso di state e elimina i valori non validi
        let flussoNormalized = this.deleteUndefinedValues(structuredClone(this.state.flussoForm));

        // Aggiunge esito o stato al flusso in base al valore selezionato
        this.addStatoOrEsito(flussoNormalized, this.state.tempStatoOrEsito);

        // Aggiunge data da e/o data a in base ai valori selezionati
        this.addDate(flussoNormalized, this.state.dataRichiestaList, 'dataRichiesta');
        this.addDate(flussoNormalized, this.state.dataRicevutaList, 'dataRicevuta');

        let flussoData = {
            filtroFlusso: {
                da: (this.state.lazyParams.first + 1),
                a: (this.state.lazyParams.first + this.state.lazyParams.rows),
                orderBy: columnMapper.get(this.state.lazyParams.sortField),
                orderType: sortMapper.get(this.state.lazyParams.sortOrder),
                flusso: flussoNormalized
            }
        }
        monitorClient.getFlussi(flussoData).then(fdResult => {
            this.setState({
                totalRecords: fdResult.filtroFlusso.count,
                flussiList: fdResult.flussoList,
                loading: false
            });
        })
        .catch(error => console.log(error))
        .finally(() => this.props.unblockContent());
    }

    resetFiltri() {
        this.setState({
            flussoForm: structuredClone(initialFlussoForm),
            tempStatoOrEsito: '',
            dataRichiestaList: null,
            dataRicevutaList: null,
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

    // Gestion onChange di componenti di Flusso
    changeStateForm(value, attribute) {
        let flussoFormNew = Object.assign({}, this.state.flussoForm);
        flussoFormNew[attribute] = value;
        this.setState({
            flussoForm: flussoFormNew
        });
    }

    // Gestisce onChange di componenti che salvano lo stato
    // fuori da flusso perchè necessitano di altre operaz.
    changeState(value, attribute) {
        let stateNew = Object.assign({}, this.state);
        stateNew[attribute] = value;
        this.setState(stateNew);
    }

    // Gestisce onChange di componenti di Flusso e input type=text
    handleChangeText(e) {
        this.changeStateForm(removeSpecialChars(e.target.value).toUpperCase(), e.target.name);
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
                                                value={this.state.flussoForm.iuv} onChange={(e) => this.handleChangeText(e)}
                                                maxLength={24} />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="contesto" className="form-label">Codice Contesto:*</label>
                                            <input type="text" id="contesto" name="codiceContesto" className="form-control"
                                                value={this.state.flussoForm.codiceContesto} onChange={(e) => this.handleChangeText(e)}
                                                maxLength={35} />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="stato" className="form-label">Stato:</label>
                                            <select id="stato" name="tempStatoOrEsito" className="form-select" value={this.state.tempStatoOrEsito}
                                                onChange={(e) => this.changeState(e.target.value, e.target.name)}>
                                                <option value={null}></option>
                                                {this.state.optionsStatiAndEsito}
                                            </select>
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="area" className="form-label">Area:</label>
                                            <select id="area" name="area" className="form-select" value={this.state.flussoForm.area}
                                                onChange={(e) => this.changeStateForm(e.target.value, e.target.name)}>
                                                <option value={null}></option>
                                                {this.state.optionsAree}
                                            </select>
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="servizio" className="form-label">Categoria:</label>
                                            <select id="servizio" name="servizio" className="form-select" value={this.state.flussoForm.servizio}
                                                onChange={(e) => this.changeStateForm(e.target.value, e.target.name)}>
                                                <option value={null}></option>
                                                {this.state.optionsServizi}
                                            </select>
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="pagatore" className="form-label">Pagatore:</label>
                                            <input type="text" id="pagatore" name="idPagatore" className="form-control"
                                                value={this.state.flussoForm.idPagatore} onChange={(e) => this.handleChangeText(e)}
                                                maxLength={17} />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="versante" className="form-label">Versante:</label>
                                            <input type="text" id="versante" name="idVersante" className="form-control"
                                                value={this.state.flussoForm.idVersante} onChange={(e) => this.handleChangeText(e)}
                                                maxLength={24} />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="dataRichiesta" className="form-label">Data Richiesta:**</label>
                                            <Calendar id="dataRichiesta" name="dataRichiestaList" value={this.state.dataRichiestaList} readOnlyInput locale="it"
                                                onChange={(e) => this.changeState(e.value, e.target.name)} selectionMode="range" dateFormat="dd/mm/y" />
                                        </div>
                                        <div className="col-12 col-xs-12 col-md-4">
                                            <label htmlFor="dataRicevuta" className="form-label">Data Ricevuta:**</label>
                                            <Calendar id="dataRicevuta" name="dataRicevutaList" value={this.state.dataRicevutaList} readOnlyInput locale="it"
                                                onChange={(e) => this.changeState(e.value, e.target.name)} selectionMode="range" dateFormat="dd/mm/y" />
                                        </div>
                                    </div>
                                </form>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                                    <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginRight: "0.05rem" }} onClick={this.loadLazyData}>Cerca</button>
                                    <button type="button" className="btn btn-primary" form="elenco-form" style={{ fontWeight: "600", marginLeft: "0.05rem" }} onClick={this.resetFiltri}>Reset Filtri</button>
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