import React, { useContext, useEffect, useRef, useState } from "react";
import { propsDominio } from "config/config";
import { buildFrase, calcolaDataPerFinestra, transformFinestraToDates } from "util/date-util";
import { columnMapper, deleteEmptyValues, sortMapper } from "util/util";
import { initialLazyParams, isFinestraAbilitata, mapFasce, modalitaFinestra, TabsContext } from "../content";
import GiornaleForm from "./giornale-form/giornale-form";
import GiornaleTable from "./giornale-table/giornale-table";
import { monitorClient } from "clients/monitor-client";
import { Message, messageDefault, Severities } from "components/message/message";

// Disabled se almeno uno di questi campi è valorizzato
export const isFinestraDisabled = (giornale) => {
    if (giornale.iuv || giornale.codiceContesto || giornale.dataOraEvento)
        return true;
    return false;
}

export const emptyGiornaleForm = () => {
    return {
        // idDominio: propsDominio.idDominio,
        iuv: '',
        codiceContesto: '',
        esito: '',
        tipoEvento: '',
        dataOraEvento: '',
        finestra: calcolaDataPerFinestra(modalitaFinestra),
        fasciaOraria: Math.trunc(mapFasce.size / 2 + 1), // Fascia oraria indica l'indice della mappa di fasce, default value: fascia circa centrale
    }
}

export default function Giornale(props) {

    const [giornaleForm, setGiornaleForm] = useState(emptyGiornaleForm());
    const [totalRecords, setTotalRecords] = useState(0);
    const [listGiornale, setListGiornale] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    const [giornaleMsg, setGiornaleMsg] = useState(messageDefault);

    const fraseFinestra = useRef('');

    const content = useContext(TabsContext);

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [giornaleForm, lazyParams]);

    const call = async () => {
        content.block();

        let giornaleRequest = prepareGiornaleRequest();

        const flussoGiornaleEventi = {
            filtroflussoGiornaleEventi: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                count: propsDominio.intervalloDate, //numero di mesi con cui il servizio formerà la default min date per il filtro
                orderBy: columnMapper.get(lazyParams.sortField),
                orderType: sortMapper.get(lazyParams.sortOrder),
                giornaleEventi: giornaleRequest
            }
        }

        try {
            const res = await monitorClient.getGiornale(flussoGiornaleEventi);
            setTotalRecords(res.filtroflussoGiornaleEventi.count < 0 ? 0 : res.filtroflussoGiornaleEventi.count);
            setListGiornale(res.giornaleList);
        } catch (e) {
            showMsg(Severities.error, "Errore di sistema:", "Riprovare in un altro momento");
        } finally {
            content.unblock();
        }
    };

    const prepareGiornaleRequest = () => {
        // Copia il flusso e elimina i valori non validi
        let giornale = deleteEmptyValues(structuredClone(giornaleForm));
        // Se finestraTemporale è renderizzata e abilitata, valorizza il filtro con la finestra
        // altrimenti con dataOraEvento che sarà già valorizzata
        if (isFinestraAbilitata && !isFinestraDisabled(giornale) && giornale.finestra) {
            const dates = transformFinestraToDates(modalitaFinestra, giornale.finestra, giornale.fasciaOraria);
            giornale.dataDa = dates[0];
            giornale.dataA = dates[1];
            fraseFinestra.current = buildFrase(modalitaFinestra, dates);
        } else {
            fraseFinestra.current = '';
            giornale.dataOraEvento = giornale.dataOraEvento ? new Date(giornale.dataOraEvento) : undefined;
        }
        eliminaFormProperties(giornale);
        return giornale;
    }

    // Elimina le proprietà necessarie al form ma non al filtro
    const eliminaFormProperties = (form) => {
        delete form.finestra;
        delete form.fasciaOraria;
    }

    const resetFiltri = () => {
        setGiornaleForm(emptyGiornaleForm());
        setLazyParams(structuredClone(initialLazyParams));
    };

    const showMsg = (severityParam, summaryParam, detailParam) => {
        setGiornaleMsg({
            severity: severityParam,
            summary: summaryParam,
            detail: detailParam,
            show: true,
        });
    }

    const hideMsg = () => {
        setGiornaleMsg({ show: false });
    }

    return (
        <>
            <Message id='giornale-msg' onHide={hideMsg} {...giornaleMsg} />
            <GiornaleForm resetFiltri={resetFiltri} giornaleForm={giornaleForm} setGiornaleForm={setGiornaleForm} fraseFinestra={fraseFinestra.current} />
            <GiornaleTable listGiornale={listGiornale} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams} />
        </>
    );
}