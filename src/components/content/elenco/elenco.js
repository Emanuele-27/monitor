import React, { useEffect, useMemo, useRef, useState } from "react";

import { monitorClient } from "clients/clients";

import { propsDominio } from 'util/config';

import { columnMapper, deleteUndefinedValues, sortMapper } from 'util/util';
import ElencoTable from "./elenco-table/elenco-table";
import ElencoForm from "./elenco-form/elenco-form";
import { initialLazyParams, isFinestraAbilitata, modalitaFinestra } from "../content";
import { useLocation } from "react-router-dom";
import { calcolaDatePerFinestra, formatDate, today } from "util/date-util";
import { statiPagamento } from "model/tutti-i-stati";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

// Disabled se almeno uno di questi campi è valorizzato
export const isFinestraDisabled = (flusso) => {
    if (flusso.iuv || flusso.codiceContesto || flusso.dataRichiestaList || flusso.dataRicevutaList)
        return true;
    return false;
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
        dataRichiestaList: null,
        dataRicevutaList: null,
        finestraTemporaleList: calcolaDatePerFinestra(modalitaFinestra, today),
    }
}

// Componente condiviso per il tab Elenco e Avvisi
export default function Elenco(props) {

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

    const initialFlussoForm = () => {
        const urlParams = manageUrlParams();
        return {
            ...emptyFlussoForm(props.tab),
            iuv: urlParams ? urlParams.iuv : '',
            codiceContesto: urlParams ? urlParams.codiceContesto : '',
        }
    }
    const [flussoForm, setFlussoForm] = useState(initialFlussoForm());

    // Gestione lazy
    const [totalRecords, setTotalRecords] = useState(0);
    const [flussiList, setFlussiList] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    const fraseFinestra = useRef('');

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flussoForm, lazyParams]);

    const call = () => {
        props.blockContent();

        let flussoRequest = prepareFlussoForCall();

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

    const prepareFlussoForCall = () => {
        let flusso = deleteUndefinedValues(structuredClone(flussoForm));
        valorizzaStatoOrEsito(flusso);
        // Se finestraTemporale è renderizzata e abilitata, valorizza il filtro con la finestra
        if (isFinestraAbilitata && !isFinestraDisabled(flusso)) {
            valorizzaDate(flusso, flusso.finestraTemporaleList, 'dataRichiesta')
            fraseFinestra.current = ` - Finestra Temporale: ${formatDate(flusso.finestraTemporaleList[0])} - ${formatDate(flusso.finestraTemporaleList[1])}` 
        } else { // Altrimenti con le altre date
            valorizzaDate(flusso, flusso.dataRichiestaList, 'dataRichiesta');
            valorizzaDate(flusso, flusso.dataRicevutaList, 'dataRicevuta');
        }
        eliminaFormProperties(flusso);
        return flusso;
    }

    // Cerco il valore di statoOrEsito tra gli stati e valorizza opportunamente
    const valorizzaStatoOrEsito = (flusso) => {
        if (flusso.statoOrEsito) {
            if (statiPagamento.includes(flusso.statoOrEsito))
                flusso.statoPagamento = flusso.statoOrEsito;
            else
                flusso.esitoPagamento = flusso.statoOrEsito;
        }
    };

    // Valorizza le date con range del filtro
    const valorizzaDate = (flusso, dataList, attribute) => {
        if (dataList && dataList[0]) {
            flusso[attribute + 'Da'] = dataList[0];
            if (dataList.length > 1 && dataList[1])
                flusso[attribute + 'A'] = dataList[1];
        }
    };

    // Elimina le proprietà necessarie al form ma non al filtro
    const eliminaFormProperties = (form) => {
        delete form.statoOrEsito;
        delete form.dataRichiestaList;
        delete form.dataRicevutaList;
        delete form.finestraTemporaleList;
    }

    const resetFiltri = () => {
        setFlussoForm(structuredClone(emptyFlussoForm(props.tab)));
        setLazyParams(structuredClone(initialLazyParams));
    };

    return (<>
        <ElencoForm tab={props.tab} aree={props.aree} servizi={props.servizi} stati={props.stati} resetFiltri={resetFiltri}
            flussoForm={flussoForm} setFlussoForm={setFlussoForm} fraseFinestra={fraseFinestra.current}/>
        <ElencoTable tab={props.tab} flussiList={flussiList} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
            blockContent={props.blockContent} unblockContent={props.unblockContent} />
    </>
    );
}