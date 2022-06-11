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
            <div>
                <h1>Simple SPA</h1>
                <ul className="header">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/content">Elenco Flussi</Link></li>
                </ul>
                <Routes>
                    <Route path="/content" element={<ElencoFlussi />} />
                </Routes>
            </div >
        );
    }
}

export default Content;