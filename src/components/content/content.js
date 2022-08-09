import React, { useEffect, useMemo, useState } from "react";
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
import { addLocale } from "primereact/api";
import { localeDate } from "util/util";
import { monitorClient } from "clients/monitor-client";

export const initialLazyParams = {
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
};

export const isFinestraAbilitata = propsDominio.finestraTemporale === 'true';
export const modalitaFinestra = propsDominio.modalitaFinestra; // Valori consentiti 'mese', 'settimana'

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

export default function Content() {

    const [blockedContent, setBlockedContent] = useState(false);
    const [rptBadgeCount, setRptBadgeCount] = useState(0);

    const [serviziOpt, setServiziOpt] = useState(null);
    const [areeOpt, setAreeOpt] = useState(null);
    const [statiEsitiOpt, setStatiEsitiOpt] = useState(null);

    useMemo(() => {
        addLocale('it', localeDate);
    }, []);

    useEffect(() => {
        blockContent();
        buildOptionsStatiEsiti();
        Promise.allSettled([monitorClient.getServizi(), getRptBadgeCount()]).then(res => {
            buildOptionsServiziEAree(res[0].value);
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

    // Nel dropdown di stato ci sono sia stati che esiti, in fase  
    // di ricerca vengono distinti e valorizzati opportunamente
    function buildOptionsStatiEsiti() {
        const esitiOptions = esitiPagamento.map(esito => <option key={esito.name} value={esito.name}>{formatEsito(esito.name)}</option>);
        const statiOptions = statiPagamento.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => <option key={stato} value={stato}>{replaceUnderscore(stato)}</option>);
        setStatiEsitiOpt(esitiOptions.concat(statiOptions));
    };

    // Vengono recuperati i servizi, filtrati per l'idDominio corrente 
    // e vengono create le option per le select di servizi e aree
    function buildOptionsServiziEAree(serviziData) {
        const serviziDominioCorrente = serviziData.serviziList.filter(servizio => servizio.idDominio === propsDominio.idDominio);
        setServiziOpt(serviziDominioCorrente.map(servizio =>
            <option key={servizio.servizio} value={servizio.servizio}>{servizio.servizio + ' - ' + servizio.denominazioneServizio}</option>
        ));
        let areeMap = new Map();
        serviziDominioCorrente.forEach(servizio => {
            let area = servizio.area;
            if (!areeMap.has(area))
                areeMap.set(area, <option key={area} value={area}>{area}</option>);
        });
        setAreeOpt(Array.from(areeMap.values()));
    }

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
                    <Route path="/avvisi" element={<Elenco key="2" tab="avvisi" aree={areeOpt} servizi={serviziOpt} blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/rpt" element={<Rpt aree={areeOpt} servizi={serviziOpt} blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/elenco" element={<Elenco key="1" tab="elenco" aree={areeOpt} servizi={serviziOpt} stati={statiEsitiOpt} blockContent={blockContent} 
                                                            unblockContent={unblockContent} setRptBadgeCount={setRptBadgeCount} />} />
                    <Route path="/giornale" element={<Giornale stati={statiEsitiOpt} blockContent={blockContent} unblockContent={unblockContent} />} />
                </Routes>
            </div>
        </BlockUI >
    );
}