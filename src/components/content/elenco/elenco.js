import React, { useEffect, useState } from "react";

import { monitorClient } from "clients/clients";

import { propsDominio } from 'util/config';

import { columnMapper, sortMapper } from 'util/util';
import ElencoTable from "./elenco-table/elenco-table";
import ElencoForm from "./elenco-form/elenco-form";
import { initialLazyParams } from "../content";

// Componente condiviso per il tab Elenco e Avvisi
export default function Elenco(props) {

    // Gestione lazy
    const [totalRecords, setTotalRecords] = useState(0);
    const [flussiList, setFlussiList] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lazyParams]);

    const call = (flussoForm) => {
        props.blockContent();

        const flussoData = {
            filtroFlusso: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                count: propsDominio.intervalloDate, //numero di mesi con cui il servizio formerà la default min date per il filtro
                orderBy: columnMapper.get(lazyParams.sortField),
                orderType: sortMapper.get(lazyParams.sortOrder),
                flusso: flussoForm ? flussoForm : {} // sempre valorizzato altrimenti count non viene considerato
            }
        }

        monitorClient.getFlussi(flussoData).then(fdResult => {
            setTotalRecords(fdResult.filtroFlusso.count < 0 ? 0 : fdResult.filtroFlusso.count);
            setFlussiList(fdResult.flussoList);
        })
            .finally(() => props.unblockContent());
    };

    const resetLazy = () => {
        setLazyParams(structuredClone(initialLazyParams));
    };

    return (<>
        <ElencoForm tab={props.tab} call={call} resetLazy={resetLazy} />
        <ElencoTable tab={props.tab} flussiList={flussiList} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
            blockContent={props.blockContent} unblockContent={props.unblockContent} />
    </>
    );
}