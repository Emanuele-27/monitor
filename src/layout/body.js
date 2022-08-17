import Content from "components/content/content";
import Legenda from "components/legenda/legenda";
import Informativa from "components/informativa/informativa";
import React from "react";
import './layout.css';

import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";
import NotFound from "components/not-found/not-found";

export default function Body() {
    return (
        <div id="body">
            <Routes>
                <Route path="/" element={<Navigate to="/content" />} />
                <Route path="/content/*" element={<Content />} />
                <Route path="/informativa" element={<Informativa />} />
                <Route path="/legenda" element={<Legenda />} />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
        </div>
    );
}