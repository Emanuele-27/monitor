import React, { Component } from "react";

import {
    Route,
    Routes,
    Link
} from "react-router-dom";
import ElencoFlussi from "../components/elencoFlussi";

class Content extends Component {
    render() {
        return (
            <div className="container">
                <button className="menuItem">Elenco Flussi</button>
                <button className="menuItem">Elenco Flussi</button>
                <button className="menuItem">Elenco Flussi</button>
                <button className="menuItem">Elenco Flussi</button>
                <button className="menuItem">Elenco Flussi</button>
                <Routes>
                    <Route path="/content" element={<ElencoFlussi />} />
                </Routes>
            </div >
        );
    }
}

export default Content;