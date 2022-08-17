import React, { useEffect, useRef, useState } from "react";

import { propsDominio } from 'config/config';
import './elenco.css';

import { columnMapper, deleteUndefinedValues, sortMapper } from 'util/util';
import ElencoTable from "./elenco-table/elenco-table";
import ElencoForm from "./elenco-form/elenco-form";
import { initialLazyParams, isFinestraAbilitata, mapFasce, modalitaFinestra } from "../content";
import { useParams } from "react-router-dom";
import { buildFrase, calcolaDataPerFinestra, setLastMinute, transformFinestraToDates } from "util/date-util";
import { statiPagamento } from "model/tutti-i-stati";
import { monitorClient } from "clients/monitor-client";

export const emptyFlussoForm = (tab, iuv, codContesto) => {
    return {
        // idDominio: propsDominio.idDominio,
        ...(tab === 'avvisi' && { flagAnnullamento: 1 }),
        iuv: iuv ? iuv : '',
        codiceContesto: codContesto ? codContesto : '',
        area: '',
        servizio: '',
        idPagatore: '',
        idVersante: '',
        statoOrEsito: '',
        dataRichiestaDa: '',
        dataRichiestaA: '',
        dataRicevutaDa: '',
        dataRicevutaA: '',
        finestra: calcolaDataPerFinestra(modalitaFinestra),// Contiene le date in formato string come da specifiche html5 per input type date, week, month
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

    // Gestione Dettaglio RPT 
    const { iuv, codContesto } = useParams();

    const [flussoForm, setFlussoForm] = useState(emptyFlussoForm(props.tab, iuv, codContesto));

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

    const call = async () => {
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

        try {
            const res = await monitorClient.getFlussi(flussoData);
            setTotalRecords(res.filtroFlusso.count < 0 ? 0 : res.filtroFlusso.count);
            setFlussiList(res.flussoList);
        } catch (e) {
            props.showMsg("danger", "Errore:", "Errore durante il recupero delle informazioni. Riprovare più tardi");
        } finally {
            props.unblockContent();
        }
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