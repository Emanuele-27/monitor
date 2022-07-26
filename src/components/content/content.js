import React, { useMemo, useState } from "react";
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
import { monitorClient } from "clients/clients";
import { propsDominio } from "util/config";
import { esitiPagamento, formatEsito, statiPagamento } from "model/tutti-i-stati";
import { replaceUnderscore } from "util/string-util";
import { addLocale } from "primereact/api";
import { localeDate } from "util/util";

// Fuori dal componente content sono dichiarate le costanti che verranno utilizzate
// in condivisione tra tutti i step

// Nel dropdown di stato ci sono sia stati che esiti, in fase  
// di ricerca vengono distinti e valorizzati opportunamente
function buildOptionsStatiEsiti() {
    const esitiOptions = esitiPagamento.map(esito => <option key={esito.name} value={esito.name}>{formatEsito(esito.name)}</option>);
    const statiOptions = statiPagamento.filter(stato => stato !== 'RT_ACCETTATA_PA').map(stato => <option key={stato} value={stato}>{replaceUnderscore(stato)}</option>);
    return esitiOptions.concat(statiOptions);
};

// Vengono recuperati i servizi, filtrati per l'idDominio corrente 
// e vengono create le option per le select di servizi e aree
async function buildOptionsServiziEAree() {
    const serviziData = await monitorClient.getServizi();
    const serviziDominioCorrente = serviziData.serviziList.filter(servizio => servizio.idDominio === propsDominio.idDominio);
    const serviziOpt = serviziDominioCorrente.map(servizio =>
        <option key={servizio.servizio} value={servizio.servizio}>{servizio.servizio + ' - ' + servizio.denominazioneServizio}</option>
    );
    let areeMap = new Map();
    serviziDominioCorrente.forEach(servizio => {
        let area = servizio.area;
        if (!areeMap.has(area))
            areeMap.set(area, <option key={area} value={area}>{area}</option>);
    });
    return {
        servizi: serviziOpt,
        aree: Array.from(areeMap.values())
    };
}

const serviziEAreeOptions = buildOptionsServiziEAree();
export const serviziOptions = serviziEAreeOptions.servizi;
export const areeOptions = serviziEAreeOptions.aree;
export const statiEsitiOptions = buildOptionsStatiEsiti();
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

export default function Content() {

    const [blockedContent, setBlockedContent] = useState(false);

    useMemo(() => {
        addLocale('it', localeDate);
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

    // const buildTab = (route, content, width) =>
    //     <Link to={route} style={{ width: width }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
    //         {content}
    //     </Link>

    return (
        <BlockUI blocked={blockedContent} >
            <div className="container-fluid" style={{ width: "85%", paddingTop: "2rem" }}>
                <div id="tabsRow" >
                    <Link to="/home" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint entrypoint-focus">
                        HOME
                    </Link>
                    {avvisiEnabled &&
                        <Link to="/avvisi" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                            AVVISI
                        </Link>
                    }
                    <Link to="/rpt" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                        RPT SENZA RT
                    </Link>
                    <Link to="/elenco" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                        ELENCO FLUSSI
                    </Link>
                    <Link to="/giornale" style={{ width: widthTabs }} onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                        GIORNALE EVENTI
                    </Link>
                </div>
            </div>
            <div style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                <Routes>
                    <Route exact path="/" element={<Home blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/home" element={<Home blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/avvisi" element={<Elenco tab="avvisi" blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/rpt" element={<Rpt blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/elenco" element={<Elenco tab="elenco" blockContent={blockContent} unblockContent={unblockContent} />} />
                    <Route path="/giornale" element={<Giornale blockContent={blockContent} unblockContent={unblockContent} />} />
                </Routes>
            </div>
        </BlockUI >
    );
}