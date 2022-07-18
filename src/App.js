import React, { useState } from "react";

import Footer from "./layout/footer";
import Header from "./layout/header";
import Body from "./layout/body";
import { propsDominio, suffissiDomini } from "util/config";

// Mapping dominio corrente - tema
const mapperDominioLogo = new Map([
    [suffissiDomini.suffissoAdm, 'dark'],
    [suffissiDomini.suffissoAe, 'dark'],
    [suffissiDomini.suffissoAer, 'light'],
    [suffissiDomini.suffissoSogei, 'dark']
]);

export default function App(props) {

    const [theme, setTheme] = useState(mapperDominioLogo.get(propsDominio.suffissoDom));

    const switchTheme = () => {
        if (theme === 'dark')
            setTheme('light');
        else if (theme === 'light')
            setTheme('dark');
    }

    return (
        <>
            <Header theme={theme} switchTheme={switchTheme} />
            <Body />
            <Footer theme={theme} />
        </>
    );
}