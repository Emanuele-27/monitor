import React, { useEffect, useState } from "react";


import RptForm from "./rpt-form/rpt-form";
import RptTable from "./rpt-table/rpt-table";
import { initialLazyParams } from "../content";
import { deleteEmptyValues } from "util/util";
import { monitorClient } from "clients/monitor-client";
import { Message, messageDefault, Severities } from "components/message/message";

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

    const [rptMsg, setRptMsg] = useState(messageDefault);

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flussoForm, lazyParams]);

    const call = async () => {
        props.block();

        let flussoParam = deleteEmptyValues(structuredClone(flussoForm));

        const flussoData = {
            filtroFlusso: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                flusso: flussoParam
            }
        }

        try {
            const res = await monitorClient.getRptSenzaRt(flussoData)
            setTotalRecords(res.filtroFlusso.count < 0 ? 0 : res.filtroFlusso.count);
            setListaRpt(res.flussoList);
        } catch (e) {
            showMsg(Severities.error, "Errore:", "Errore durante il recupero delle informazioni. Riprovare più tardi");
        } finally {
            props.unblock();
        }
    };

    const resetFiltri = () => {
        setFlussoForm(emptyFlussoForm);
        setLazyParams(structuredClone(initialLazyParams));
    };

    const showMsg = (severityParam, summaryParam, detailParam) => {
        setRptMsg({
            severity: severityParam,
            summary: summaryParam,
            detail: detailParam,
            show: true,
        });
    }

    const hideMsg = () => {
        setRptMsg({ show: false });
    }

    return (<>
        <Message id='rpt-msg' onHide={hideMsg} {...rptMsg} />
        <RptForm aree={props.aree} servizi={props.servizi} flussoForm={flussoForm} setFlussoForm={setFlussoForm} resetFiltri={resetFiltri} />
        <RptTable listaRpt={listaRpt} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
            block={props.block} unblock={props.unblock} />
    </>
    );
}