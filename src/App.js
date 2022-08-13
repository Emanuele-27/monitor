import React, { useState } from "react";

import Footer from "./layout/footer";
import Header from "./layout/header";
import Body from "./layout/body";
import { propsDominio, suffissiDomini } from "config/config";

// Mapping dominio corrente - tema di default
const mapperDominioLogo = new Map([
    [suffissiDomini.suffissoAdm, 'dark'],
    [suffissiDomini.suffissoAe, 'dark'],
    [suffissiDomini.suffissoAer, 'light'],
    [suffissiDomini.suffissoSogei, 'dark']
]);

export default function App(props) {

    const [theme, setTheme] = useState(mapperDominioLogo.get(propsDominio.suffissoDom));

    const switchTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return (
        <>
            <Header theme={theme} switchTheme={switchTheme} />
            <Body />
            <Footer theme={theme} />
        </>
    );
}