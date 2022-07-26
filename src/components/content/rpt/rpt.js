import React, { useEffect, useState } from "react";

import { monitorClient } from "clients/clients";

import RptForm from "./rpt-form/rpt-form";
import RptTable from "./rpt-table/rpt-table";
import { initialLazyParams } from "../content";

export default function Rpt(props) {

    const [flusso, setFlusso] = useState({});
    // Gestione lazy
    const [totalRecords, setTotalRecords] = useState(0);
    const [listaRpt, setListaRpt] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flusso, lazyParams]);

    const call = (flussoForm) => {
        props.blockContent();

        const flussoData = {
            filtroFlusso: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                flusso: flusso
            }
        }

        monitorClient.getRptSenzaRt(flussoData).then(fdResult => {
            setTotalRecords(fdResult.filtroFlusso.count < 0 ? 0 : fdResult.filtroFlusso.count);
            setListaRpt(fdResult.flussoList);
        })
            .finally(() => props.unblockContent());
    };

    const resetFiltri = () => {
        setFlusso({});
        setLazyParams(structuredClone(initialLazyParams));
    };

    return (<>
        <RptForm aree={props.aree} servizi={props.servizi} setFlusso={setFlusso} resetFiltri={resetFiltri} />
        <RptTable listaRpt={listaRpt} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
            blockContent={props.blockContent} unblockContent={props.unblockContent} />
    </>
    );
}