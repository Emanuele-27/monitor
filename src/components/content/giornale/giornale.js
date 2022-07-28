import { monitorClient } from "clients/clients";
import React, { useEffect, useState } from "react";
import { propsDominio } from "util/config";
import { columnMapper, sortMapper } from "util/util";
import { initialLazyParams } from "../content";
import GiornaleForm from "./giornale-form/giornale-form";
import GiornaleTable from "./giornale-table/giornale-table";

export default function Giornale(props) {

    const [giornale, setGiornale] = useState({});
    // Gestione lazy
    const [totalRecords, setTotalRecords] = useState(0);
    const [listGiornale, setListGiornale] = useState([]);
    const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

    useEffect(() => {
        call();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [giornale, lazyParams]);

    const call = () => {
        props.blockContent();

        const flussoGiornaleEventi = {
            filtroflussoGiornaleEventi: {
                da: (lazyParams.first + 1),
                a: (lazyParams.first + lazyParams.rows),
                count: propsDominio.intervalloDate, //numero di mesi con cui il servizio formerà la default min date per il filtro
                orderBy: columnMapper.get(lazyParams.sortField),
                orderType: sortMapper.get(lazyParams.sortOrder),
                giornaleEventi: giornale
            }
        }

        monitorClient.getGiornale(flussoGiornaleEventi).then(flussoResult => {
            setTotalRecords(flussoResult.filtroflussoGiornaleEventi.count < 0 ? 0 : flussoResult.filtroflussoGiornaleEventi.count);
            setListGiornale(flussoResult.giornaleList);
        })
            .finally(() => props.unblockContent());
    };

    const resetFiltri = () => {
        setGiornale({});
        setLazyParams(structuredClone(initialLazyParams));
    };

    return (
        <>
            <GiornaleForm stati={props.stati} resetFiltri={resetFiltri} setGiornale={setGiornale} />
            <GiornaleTable listGiornale={listGiornale} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
                blockContent={props.blockContent} unblockContent={props.unblockContent} />
        </>
    );
}