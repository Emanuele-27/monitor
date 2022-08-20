import React, { useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import Elenco from "./elenco/elenco";
import Giornale from "./giornale/giornale";
import Home from "./home/home";
import Rpt from "./rpt/rpt";

import { BlockUI } from 'primereact/blockui';

import './content.css';
import { propsDominio } from "config/config";
import { statiPagamento, esitiPagamento } from "model/tutti-i-stati";
import { replaceUnderscore, formatEsito } from "util/string-util";
import { monitorClient } from "clients/monitor-client";
import { aggiungiMesi, creaIntervalliDiOre, formatDateForInput, formatMonth, getISOWeekDate, minutesIn2Digits } from "util/date-util";
import { Entrypoint } from "./entrypoint";
import { keys, LocalStorage } from "util/storage-util";

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

export const getRptBadgeCount = () => {
    const flussoData = {
        filtroFlusso: {
            da: 0,
            a: 1,
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
    const esitiOptions = esitiPagamento.map(esito => <option key={esito} value={esito}>{formatEsito(esito)}</option>);
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
        // Creo una mappa e associo a ogni indice la coppia di date per poterli manipolare successivamente
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

const SERVIZI_AREE = keys.SERVIZI_AREE;

export default function Content() {

    const [blockedContent, setBlockedContent] = useState(false);
    const [rptBadgeCount, setRptBadgeCount] = useState(0);

    const [servizi, setServizi] = useState(null);
    const [aree, setAree] = useState(null);

    useEffect(() => {
        const getData = async () => {
            block();
            getRptBadgeCount().then(res => setRptBadgeCount(res.filtroFlusso.count < 0 ? 0 : res.filtroFlusso.count))
                .finally(() => unblock());
            const serviziEAree = buildServiziEAree(LocalStorage.get(SERVIZI_AREE) ?? await callServizi());
            setServizi(serviziEAree.servizi);
            setAree(serviziEAree.aree);
        };
        getData()
    }, [])

    const callServizi = async () => {
        const res = await monitorClient.getServizi();
        LocalStorage.set(SERVIZI_AREE, res);
        return res;
    }

    const block = () => {
        setBlockedContent(true)
    }

    const unblock = () => {
        setBlockedContent(false)
    }

    // Costruisce option per le select di servizi e aree
    const buildServiziEAree = (serviziData) => {
        const serviziDominioCorrente = serviziData.serviziList.filter(servizio => servizio.idDominio === propsDominio.idDominio);
        const serviziOpt = serviziDominioCorrente.map(servizio =>
            <option key={servizio.servizio} value={servizio.servizio}>{servizio.servizio + (servizio.denominazioneServizio ? ' ' + servizio.denominazioneServizio : '')}</option>);
        // Crea una lista di option dalla lista di aree univoche del set
        const areeOpt = Array.from(new Set(serviziDominioCorrente.map(s => s.area))).map(a => <option key={a} value={a}>{a}</option>);
        return {
            servizi: serviziOpt,
            aree: areeOpt,
        }
    };

    return (
        <BlockUI id="content-bui" blocked={blockedContent} template={<i className="pi pi-spin pi-spinner" style={{ fontSize: "5rem", color: "whitesmoke" }}></i>} >
            <div className="container-fluid" style={{ width: "85%", paddingTop: "2rem" }}>
                <div id="tabs-row" >
                    <Entrypoint route="content/home" default>
                        HOME
                    </Entrypoint>
                    {avvisiEnabled && <Entrypoint route="content/avvisi">
                        AVVISI
                    </Entrypoint>}
                    <Entrypoint id="rpt-tab" route="content/rpt">
                        RPT SENZA RT <span style={{ marginLeft: "0.5rem" }} className={"badge badge-" + (rptBadgeCount > 0 ? "danger" : "success")}>{rptBadgeCount}</span>
                    </Entrypoint>
                    <Entrypoint id="elenco-tab" route="content/elenco">
                        ELENCO FLUSSI
                    </Entrypoint>
                    <Entrypoint route="content/giornale">
                        GIORNALE EVENTI
                    </Entrypoint>
                </div>
            </div>
            <div style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/content/home" />} />
                    <Route path="/home" element={<Home />} />
                    {/* L'attributo key diverso serve a far ricreare il componente invece di riutilizzarlo, causa query diversa */}
                    <Route path="/avvisi" element={<Elenco key="2" tab="avvisi" servizi={servizi} aree={aree} block={block} unblock={unblock} />} />
                    <Route path="/rpt" element={<Rpt servizi={servizi} aree={aree} block={block} unblock={unblock} />} />
                    <Route path="/elenco" element={
                        <Elenco key="1" tab="elenco" servizi={servizi} aree={aree} block={block} unblock={unblock} setRptBadgeCount={setRptBadgeCount} />} />
                    <Route path="/elenco/:iuv/:codContesto" element={
                        <Elenco key="1" tab="elenco" servizi={servizi} aree={aree} block={block} unblock={unblock} setRptBadgeCount={setRptBadgeCount} />} />
                    <Route path="/giornale" element={<Giornale block={block} unblock={unblock} />} />
                    <Route path="*" element={<Navigate to="/not-found" />} />
                </Routes>
            </div>
        </BlockUI >
    );
}