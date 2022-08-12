import React, { useEffect, useRef, useState } from "react";
import { propsDominio } from "config/config";
import { calcolaDataPerFinestra, transformFinestraToDates } from "util/date-util";
import { columnMapper, deleteUndefinedValues, sortMapper } from "util/util";
import { buildFrase, initialLazyParams, isFinestraAbilitata, mapFasce, modalitaFinestra } from "../content";
import GiornaleForm from "./giornale-form/giornale-form";
import GiornaleTable from "./giornale-table/giornale-table";
import { monitorClient } from "clients/monitor-client";

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

    const fraseFinestra = useRef('');

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [giornaleForm, lazyParams]);

    const call = () => {
        props.blockContent();

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

        monitorClient.getGiornale(flussoGiornaleEventi).then(flussoResult => {
            setTotalRecords(flussoResult.filtroflussoGiornaleEventi.count < 0 ? 0 : flussoResult.filtroflussoGiornaleEventi.count);
            setListGiornale(flussoResult.giornaleList);
        })
            .finally(() => props.unblockContent());
    };

    const prepareGiornaleRequest = () => {
        // Copia il flusso e elimina i valori non validi
        let giornale = deleteUndefinedValues(structuredClone(giornaleForm));
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

    return (
        <>
            <GiornaleForm resetFiltri={resetFiltri} giornaleForm={giornaleForm} setGiornaleForm={setGiornaleForm} fraseFinestra={fraseFinestra.current} />
            <GiornaleTable listGiornale={listGiornale} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
                blockContent={props.blockContent} unblockContent={props.unblockContent} />
        </>
    );
}