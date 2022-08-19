import React, { useState } from "react";

import Footer from "./layout/footer";
import Header from "./layout/header";
import Body from "./layout/body";
import { propsDominio } from "config/config";

export default function App(props) {

    const [theme, setTheme] = useState(propsDominio.theme);

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