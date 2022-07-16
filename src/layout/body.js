import Content from "components/content/content";
import Legenda from "components/legenda/legenda";
import Informativa from "components/informativa/informativa";
import React from "react";
import './layout.css';

import {
    Route,
    Routes
} from "react-router-dom";

export default function Body() {
    return (
        <div id="bodyDiv">
            <Routes>
                <Route path="/*" element={<Content />} />
                <Route path="/informativa" element={<Informativa />} />
                <Route path="/legenda" element={<Legenda />} />
            </Routes>
        </div>
    );
}