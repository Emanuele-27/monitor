import React, { useEffect, useState } from "react";
import {
    Route,
    Routes,
    Link,
} from "react-router-dom";
import Elenco from "./elenco/elenco";
import Giornale from "./giornale/giornale";
import Home from "./home/home";
import Rpt from "./rpt/rpt";

import { BlockUI } from 'primereact/blockui';

import './content.css';
import { propsDominio } from "config/config";
import { esitiPagamento, formatEsito, statiPagamento } from "model/tutti-i-stati";
import { replaceUnderscore } from "util/string-util";
import { monitorClient } from "clients/monitor-client";
import { aggiungiMesi, creaIntervalliDiOre, formatDate, formatDateForInput, formatMonth, formatTimeShort, getISOWeekDate, minutesIn2Digits } from "util/date-util";

export const initialLazyParams = {
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
};

export const isFinestraAbilitata = propsDominio.finestraTemporale === 'true';
export const modalitaFinestra = propsDominio.modalitaFinestra;

const avvisiEnabled = propsDominio.avvisiEnabled === 'true';
const widthTabs = avvisiEnabled ? '20%' : '25%';

export const getRptBadgeCount = () => {
    const flussoData = {
        filtroFlusso: {
            da: 1,
            a: 2,
            flusso: {
                // idDominio: propsDominio.idDominio
            }
        }
    }
    return monitorClient.getRptSenzaRt(flussoData);
}

// Min Date formato Date
export const initialMinDate = aggiungiMesi(new Date(Date.now()), parseInt(propsDominio.intervalloDate));
// Min e Max Date formato yyyy-MM-dd
export const initialMinDateForInput = formatDateForInput(initialMinDate);
export const initialMaxDateForInput = formatDateForInput(new Date(Date.now()));
// Min e Max Date formato yyyy-MM
export const minMonth = formatMonth(initialMinDate);
export const maxMonth = formatMonth(new Date(Date.now()));
// Min e Max Date formato ISO date week string
export const minWeek = getISOWeekDate(initialMinDate);
export const maxWeek = getISOWeekDate(new Date(Date.now()));

// Nel dropdown di stato ci sono sia stati che esiti, in fase  
// di ricerca vengono distinti e valorizzati opportunamente
const buildOptionsStatiEsiti = () => {
    const esitiOptions = esitiPagamento.map(esito => <option key={esito.name} value={esito.name}>{formatEsito(esito.name)}</option>);
    const statiOptions = statiPagamento.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => <option key={stato} value={stato}>{replaceUnderscore(stato)}</option>);
    return esitiOptions.concat(statiOptions);
};
export const esitStatiOpt = buildOptionsStatiEsiti();

// Costruisce le option per la fascia oraria della finestra temporale
const buildIntervalliOre = () => {
    const intervalli = creaIntervalliDiOre(parseInt(propsDominio.intervalloOre));
    const options = [];
    const mapFasce = new Map();
    for (let i = 1; i < intervalli.length; i++) {
        const left = intervalli[i - 1];
        const right = intervalli[i];
        // Creo una mappa e associo a ogni indice la coppia di date per poterli manipolare agilmente successivamente
        mapFasce.set(i, [left, right]);
        options.push(<option key={i} value={i}>{left.getHours() + ":" + minutesIn2Digits(left.getMinutes()) + " - "
            + right.getHours() + ":" + minutesIn2Digits(right.getMinutes())}</option>);
    }
    return {
        oreOptions: options,
        fasce: mapFasce,
    };
}
const outputOre = buildIntervalliOre();
export const oreOpt = outputOre.oreOptions;
export const mapFasce = outputOre.fasce;

export const buildFrase = (mod, dates) => {
    switch (mod) {
        case 'mese' || 'settimana':
            return ` - Finestra Temporale: ${formatDate(dates[0])} - ${formatDate(dates[1])}`
        case 'ore':
            return ` - Finestra Temporale: ${formatDate(dates[0])} ${formatTimeShort(dates[0])} - ${formatTimeShort(dates[1])}`;
        default:
            return '';
    }
}

export default function Content() {

    const [blockedContent, setBlockedContent] = useState(false);
    const [rptBadgeCount, setRptBadgeCount] = useState(0);

    const [servizi, setServizi] = useState(null);
    const [aree, setAree] = useState(null);

    useEffect(() => {
        blockContent();
        Promise.allSettled([monitorClient.getServizi(), getRptBadgeCount()]).then(res => {
            const serviziEAree = buildServiziEAree(res[0].value);
            setServizi(serviziEAree.servizi);
            setAree(serviziEAree.aree);
            setRptBadgeCount(res[1].value.filtroFlusso.count < 0 ? 0 : res[1].value.filtroFlusso.count);
        }).finally(() => unblockContent())
    }, [])

    const blockContent = () => {
        setBlockedContent(true)
    }

    const unblockContent = () => {
        setBlockedContent(false)
    }

    // Toggle classi css per il focus tra steps in base al click
    const toggleFocusClass = (ev) => {
        document.getElementById('tabsRow').getElementsByClassName('entrypoint-focus')[0].classList.remove('entrypoint-focus');
        ev.target.classList.add('entrypoint-focus');
    }

    // Costruisce option per le select di servizi e aree
    const buildServiziEAree = (serviziData) => {
        const serviziDominioCorrente = serviziData.serviziList.filter(servizio => servizio.idDominio === propsDominio.idDominio);
        const serviziOpt = serviziDominioCorrente.map(servizio =>
            <option key={servizio.servizio} value={servizio.servizio}>{servizio.servizio + (servizio.denominazioneServizio ? ' - ' + servizio.denominazioneServizio : '')}</option>);
        // Crea una lista di option dalla lista di aree univoche del set
        const areeOpt = Array.from(new Set(serviziDominioCorrente.map(s => s.area))).map(a => <option key={a} value={a}>{a}</option>);
        return {
            servizi: serviziOpt,
            aree: areeOpt,
        }
    };

    return (
        <BlockUI blocked={blockedContent} >
            <div className="container-fluid" style={{ width: "85%", paddingTop: "2rem" }}>
                <div id="tabsRow" >
                    <Link to="/home" id="home-tab" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint entrypoint-focus">
                        HOME
                    </Link>
                    {avvisiEnabled &&
                        <Link to="/avvisi" id="avvisi-tab" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                            AVVISI
                        </Link>
                    }
                    <Link to="/rpt" id="rpt-tab" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                        RPT SENZA RT <span style={{ marginLeft: "0.5rem" }} className={"badge badge-" + (rptBadgeCount > 0 ? "danger" : "success")}>{rptBadgeCount}</span>
                    </Link>
                    <Link to="/elenco" id="elenco-tab" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                        ELENCO FLUSSI
                    </Link>
                    <Link to="/giornale" id="giornale-tab" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                        GIORNALE EVENTI
                    </Link>
                </div>
            </div>
            <div style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                <Routes>
                    <Route exact path="/" element={<Home blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/home" element={<Home blockContent={blockContent} unblockContent={unblockContent} />} />
                    {/* L'attributo key diverso serve a far ricreare il componente invece di riutilizzarlo, causa query diversa */}
                    <Route path="/avvisi" element={<Elenco key="2" tab="avvisi" servizi={servizi} aree={aree} blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/rpt" element={<Rpt servizi={servizi} aree={aree} blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/elenco" element={<Elenco key="1" tab="elenco" servizi={servizi} aree={aree} blockContent={blockContent} unblockContent={unblockContent} setRptBadgeCount={setRptBadgeCount} />} />
                    <Route path="/giornale" element={<Giornale blockContent={blockContent} unblockContent={unblockContent} />} />
                </Routes>
            </div>
        </BlockUI >
    );
}