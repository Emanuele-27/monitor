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
import { monitorClient } from "clients/monitor-client";
import { aggiungiMesi, buildIntervalliOre, formatDateForInput, formatMonth, getISOWeekDate } from "util/date-util";
import { Entrypoint } from "../entrypoint/entrypoint";
import { buildOptionsStatiEsiti, buildServiziEAree } from "util/util";

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

export const esitStatiOpt = buildOptionsStatiEsiti();

const outputOre = buildIntervalliOre(propsDominio.intervalloOre);
export const oreOpt = outputOre.oreOptions;
export const mapFasce = outputOre.fasce;

export const TabsContext = React.createContext({});

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
            const serviziEAree = buildServiziEAree(await monitorClient.getServizi(), propsDominio.idDominio);
            setServizi(serviziEAree.servizi);
            setAree(serviziEAree.aree);
        };
        getData()
    }, [])

    const block = () => {
        setBlockedContent(true)
    }

    const unblock = () => {
        setBlockedContent(false)
    }

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
                <TabsContext.Provider value={{ servizi, aree, block, unblock, setRptBadgeCount }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/content/home" />} />
                        <Route path="/home" element={<Home />} />
                        {/* L'attributo key diverso serve a far ricreare il componente invece di riutilizzarlo, causa query diversa */}
                        <Route path="/avvisi" element={<Elenco key="2" tab="avvisi" />} />
                        <Route path="/rpt" element={<Rpt />} />
                        <Route path="/elenco" element={<Elenco key="1" tab="elenco" />} />
                        <Route path="/elenco/:iuv/:codContesto" element={<Elenco key="1" tab="elenco" />} />
                        <Route path="/giornale" element={<Giornale />} />
                        <Route path="*" element={<Navigate to="/not-found" />} />
                    </Routes>
                </TabsContext.Provider>
            </div>
        </BlockUI >
    );
}