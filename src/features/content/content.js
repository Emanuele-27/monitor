import React, { useEffect, useState } from "react";
import {
    Route,
    Routes,
    Link
} from "react-router-dom";
import Elenco from "./elenco/elenco";
import Giornale from "./giornale/giornale";
import Home from "./home/home";
import Rpt from "./rpt/rpt";

import { BlockUI } from 'primereact/blockui';
import { addLocale } from 'primereact/api';
import {  localeDate } from 'util/util';

import './content.css';

export const idDominio = process.env.REACT_APP_ID_DOMINIO;

export default function Content() {

    const [blockedContent, setBlockedContent] = useState(false);

    const blockContent = () => {
        setBlockedContent(true)
    }

    const unblockContent = () => {
        setBlockedContent(false)
    }

    // Switch classi css per il focus tra link in base al click
    const toggleFocusClass = (ev) => {
        document.getElementById('stepRow').getElementsByClassName('entrypoint-focus')[0].classList.remove('entrypoint-focus');
        ev.target.classList.add('entrypoint-focus');
    }

    // Default link focused -> home
    useEffect(() => {
        addLocale('it', localeDate);
        document.getElementById('linkHome').classList.add('entrypoint-focus')
    }, []);

    return (
        <BlockUI blocked={blockedContent} >
            <div>
                <div className="container-fluid" style={{ width: "85%", paddingTop: "2rem" }}>
                    <div id="stepRow" className="row">
                        <div className="col-12 col-md-4 col-xl-3">
                            <Link to="/home" id="linkHome" onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                                HOME
                            </Link>
                        </div>
                        <div className="col-12 col-md-4 col-xl-3">
                            <Link to="/rpt" id="linkRpt" onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                                RPT SENZA RT
                            </Link>
                        </div>
                        <div className="col-12 col-md-4 col-xl-3">
                            <Link to="/elenco" id="linkElenco" onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                                ELENCO FLUSSI
                            </Link>
                        </div>
                        <div className="col-12 col-md-4 col-xl-3">
                            <Link to="/giornale" id="linkGiornale" onClick={toggleFocusClass} className="btn btn-outline-primary btn-lg entrypoint">
                                GIORNALE EVENTI
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                    <Routes>
                        <Route exact path="/" element={<Home blockContent={blockContent} unblockContent={unblockContent} />} />
                        <Route path="/home" element={<Home blockContent={blockContent} unblockContent={unblockContent} />} />
                        <Route path="/rpt" element={<Rpt blockContent={blockContent} unblockContent={unblockContent} />} />
                        <Route path="/elenco" element={<Elenco blockContent={blockContent} unblockContent={unblockContent} />} />
                        <Route path="/giornale" element={<Giornale blockContent={blockContent} unblockContent={unblockContent} />} />
                    </Routes>
                </div>
            </div>
        </BlockUI>
    );
}