import React, { useEffect, useMemo, useRef, useState } from "react";

import { propsDominio } from 'config/config';
import './elenco.css';

import { columnMapper, deleteUndefinedValues, sortMapper } from 'util/util';
import ElencoTable from "./elenco-table/elenco-table";
import ElencoForm from "./elenco-form/elenco-form";
import { initialLazyParams, isFinestraAbilitata, mapFasce, modalitaFinestra } from "../content";
import { useLocation } from "react-router-dom";
import { buildFrase, calcolaDataPerFinestra, setLastMinute, transformFinestraToDates } from "util/date-util";
import { statiPagamento } from "model/tutti-i-stati";
import { monitorClient } from "clients/monitor-client";

const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export const emptyFlussoForm = (tab) => {
    return {
        // idDominio: propsDominio.idDominio,
        ...(tab === 'avvisi' && { flagAnnullamento: 1 }),
        iuv: '',
        codiceContesto: '',
        area: '',
        servizio: '',
        idPagatore: '',
        idVersante: '',
        statoOrEsito: '',
        dataRichiestaDa: '',
        dataRichiestaA: '',
        dataRicevutaDa: '',
        dataRicevutaA: '',
        finestra: calcolaDataPerFinestra(modalitaFinestra),
        fasciaOraria: Math.trunc(mapFasce.size / 2 + 1), // Fascia oraria indica l'indice della mappa di fasce, default value: fascia circa centrale
    }
}

// Disabled se almeno uno di questi campi è valorizzato
export const isFinestraDisabled = (flusso) => {
    if (flusso.iuv || flusso.codiceContesto || flusso.dataRichiestaDa || flusso.dataRichiestaA
        || flusso.dataRicevutaDa || flusso.dataRicevutaA)
        return true;
    return false;
}

// Componente condiviso per il tab Elenco e Avvisi
export default function Elenco(props) {

    // ***** Inizio Gestione Dettaglio RPT *****
    const query = useQuery();

    // Ritorna un oggetto valorizzato con i query params se presenti
    const manageUrlParams = () => {
        if (query.toString()) {
            let iuvParam = query.get("iuv");
            let codiceContestoParam = query.get("codContesto");
            query.delete("iuv");
            query.delete("codContesto");
            // Rimuove queryParams dall'url
            window.history.replaceState(null, '', window.location.origin + window.location.pathname);
            return {
                iuv: iuvParam,
                codiceContesto: codiceContestoParam
            }
        }
        return null;
    }

    // Per definire lo stato iniziale viene controllato se si proviene
    // dal dettaglio rpt
    const initialFlussoForm = () => {
        const urlParams = manageUrlParams();
        return {
            ...emptyFlussoForm(props.tab),
            iuv: urlParams ? urlParams.iuv : '',
            codiceContesto: urlParams ? urlParams.codiceContesto : '',
        }
    }
    // ****** Fine Gestione Dettaglio RPT *****

    const [flussoForm, setFlussoForm] = useState(initialFlussoForm());

    const [totalRecords, setTotalRecords] = useState(0);
    const [flussiList, setFlussiList] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    const [elencoMsg, setElencoMsg] = useState({
        show: false,
    });

    const fraseFinestra = useRef('');

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flussoForm, lazyParams]);

    useEffect(() => {
        document.getElementById("elenco-msg").scrollIntoView({ behavior: "smooth", block: "center" });
    }, [elencoMsg]);

    const call = () => {
        props.blockContent();

        const flussoRequest = prepareFlussoRequest();

        const flussoData = {
            filtroFlusso: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                count: propsDominio.intervalloDate, //numero di mesi con cui il servizio formerà la default min date per il filtro
                orderBy: columnMapper.get(lazyParams.sortField),
                orderType: sortMapper.get(lazyParams.sortOrder),
                flusso: flussoRequest
            }
        }
        monitorClient.getFlussi(flussoData).then(fdResult => {
            setTotalRecords(fdResult.filtroFlusso.count < 0 ? 0 : fdResult.filtroFlusso.count);
            setFlussiList(fdResult.flussoList);
        })
            .finally(() => props.unblockContent());
    };

    const prepareFlussoRequest = () => {
        let flusso = deleteUndefinedValues(structuredClone(flussoForm));
        valorizzaStatoOrEsito(flusso);
        // Se finestraTemporale è renderizzata e abilitata, valorizza il filtro con la finestra
        if (isFinestraAbilitata && !isFinestraDisabled(flusso) && flusso.finestra) {
            const dates = transformFinestraToDates(modalitaFinestra, flusso.finestra, flusso.fasciaOraria);
            flusso.dataRichiestaDa = dates[0];
            flusso.dataRichiestaA = dates[1];
            fraseFinestra.current = buildFrase(modalitaFinestra, dates);
        } else { // Altrimenti con le altre date
            fraseFinestra.current = '';
            flusso.dataRichiestaDa = flusso.dataRichiestaDa ? new Date(flusso.dataRichiestaDa) : undefined;
            flusso.dataRichiestaA = flusso.dataRichiestaA ? setLastMinute(flusso.dataRichiestaA) : undefined;
            flusso.dataRicevutaDa = flusso.dataRicevutaDa ? new Date(flusso.dataRicevutaDa) : undefined;
            flusso.dataRicevutaA = flusso.dataRicevutaA ? setLastMinute(flusso.dataRicevutaA) : undefined;
        }
        eliminaFormProperties(flusso);
        return flusso;
    }

    // Cerco il valore di statoOrEsito tra gli stati e valorizza opportunamente
    const valorizzaStatoOrEsito = (flusso) => {
        if (flusso.statoOrEsito)
            if (statiPagamento.includes(flusso.statoOrEsito))
                flusso.statoPagamento = flusso.statoOrEsito;
            else
                flusso.esitoPagamento = flusso.statoOrEsito;
    };

    // Elimina le proprietà necessarie al form ma non al filtro
    const eliminaFormProperties = (form) => {
        delete form.statoOrEsito;
        delete form.finestra;
        delete form.fasciaOraria;
    }

    const resetFiltri = () => {
        setFlussoForm(structuredClone(emptyFlussoForm(props.tab)));
        setLazyParams(structuredClone(initialLazyParams));
    };

    const showMsg = (severityParam, summaryParam, detailParam) => {
        setElencoMsg({
            severity: severityParam,
            summary: summaryParam,
            detail: detailParam,
            show: true,
        });
    }

    const hideMsg = () => {
        setElencoMsg({
            show: false
        });;
    }

    return (<>
        <div className="container">        {/* Severities possibili: success, danger, warning, info */}
            <div id="elenco-msg" className={"alert alert-" + elencoMsg.severity + " alert-dismissible fade show " + (elencoMsg.show ? '' : 'hidden')} role="alert">
                <b>{elencoMsg.summary + " "}</b>
                {elencoMsg.detail}
                <button type="button" onClick={hideMsg} className="btn-close" aria-label="Chiudi"></button>
            </div>
        </div>
        <ElencoForm tab={props.tab} aree={props.aree} servizi={props.servizi} resetFiltri={resetFiltri}
            flussoForm={flussoForm} setFlussoForm={setFlussoForm} fraseFinestra={fraseFinestra.current} />
        <ElencoTable tab={props.tab} flussiList={flussiList} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
            blockContent={props.blockContent} unblockContent={props.unblockContent} call={call} setRptBadgeCount={props.setRptBadgeCount}
            showMsg={showMsg} />
    </>
    );
}