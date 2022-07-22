import { monitorClient } from "clients/clients";
import React, { useEffect, useState } from "react";
import { propsDominio } from "util/config";
import { columnMapper, sortMapper } from "util/util";
import GiornaleForm from "./giornale-form/giornale-form";
import GiornaleTable from "./giornale-table/giornale-table";

const initialLazyParams = {
  first: 0,
  rows: 10,
  page: 1,
  sortField: null,
  sortOrder: null,
}

export default function Giornale(props) {

  // Gestione lazy
  const [totalRecords, setTotalRecords] = useState(0);
  const [listGiornale, setListGiornale] = useState([]);
  const [lazyParams, setLazyParams] = useState(structuredClone(initialLazyParams));

  useEffect(() => {
    call();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);

  const call = (giornaleForm) => {
    props.blockContent();

    const flussoGiornaleEventi = {
      filtroflussoGiornaleEventi: {
        da: (lazyParams.first + 1),
        a: (lazyParams.first + lazyParams.rows),
        count: propsDominio.intervalloDate, //numero di mesi con cui il servizio formerà la default min date per il filtro
        orderBy: columnMapper.get(lazyParams.sortField),
        orderType: sortMapper.get(lazyParams.sortOrder),
        giornaleEventi: giornaleForm ? giornaleForm : {} // sempre valorizzato altrimenti count non viene considerato
      }
    }

    monitorClient.getGiornale(flussoGiornaleEventi).then(flussoResult => {
      setTotalRecords(flussoResult.filtroflussoGiornaleEventi.count < 0 ? 0 : flussoResult.filtroflussoGiornaleEventi.count);
      setListGiornale(flussoResult.giornaleList);
    })
      .finally(() => props.unblockContent());
  };

  const resetLazy = () => {
    setLazyParams(structuredClone(initialLazyParams));
  };

  return (
    <>
      <GiornaleForm call={call} resetLazy={resetLazy} />
      <GiornaleTable listGiornale={listGiornale} totalRecords={totalRecords} lazyParams={lazyParams} setLazyParams={setLazyParams}
        blockContent={props.blockContent} unblockContent={props.unblockContent} />
    </>
  );
}