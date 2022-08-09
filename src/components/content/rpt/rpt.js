import React, { useEffect, useState } from "react";


import RptForm from "./rpt-form/rpt-form";
import RptTable from "./rpt-table/rpt-table";
import { initialLazyParams } from "../content";
import { deleteUndefinedValues } from "util/util";
import { monitorClient } from "clients/monitor-client";

export const emptyFlussoForm = {
    // idDominio: propsDominio.idDominio,
    iuv: '',
    codiceContesto: '',
    area: '',
    servizio: '',
}

export default function Rpt(props) {

    const [flussoForm, setFlussoForm] = useState(emptyFlussoForm);

    // Gestione lazy
    const [totalRecords, setTotalRecords] = useState(0);
    const [listaRpt, setListaRpt] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flussoForm, lazyParams]);

    const call = () => {
        props.blockContent();

        let flussoParam = deleteUndefinedValues(structuredClone(flussoForm));

        const flussoData = {
            filtroFlusso: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                flusso: flussoParam
            }
        }
        monitorClient.getRptSenzaRt(flussoData).then(fdResult => {
            setTotalRecords(fdResult.filtroFlusso.count < 0 ? 0 : fdResult.filtroFlusso.count);
            setListaRpt(fdResult.flussoList);
        })
            .finally(() => props.unblockContent());
    };

    const resetFiltri = () => {
        setFlussoForm(emptyFlussoForm);
        setLazyParams(structuredClone(initialLazyParams));
    };

    return (<>
        <RptForm aree={props.aree} servizi={props.servizi} flussoForm={flussoForm} setFlussoForm={setFlussoForm} resetFiltri={resetFiltri} />
        <RptTable listaRpt={listaRpt} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
            blockContent={props.blockContent} unblockContent={props.unblockContent} />
    </>
    );
}