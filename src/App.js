import React, { useEffect, useState } from "react";

import Footer from "./layout/footer";
import Header from "./layout/header";
import Body from "./layout/body";
import { propsDominio, suffissiDomini } from "config/config";

const loghiDark = new Map([
    [suffissiDomini.suffissoAdm, 'adm/ADM_ita-bianco.svg'],
    [suffissiDomini.suffissoAe, 'ae/ae_bianco.svg'],
    [suffissiDomini.suffissoAer, 'ader/ADER_logo.svg'],
    [suffissiDomini.suffissoSogei, 'sogei/Sogei_arancio_bianco.svg'],
])

const loghiLight = new Map([
    [suffissiDomini.suffissoAdm, 'adm/ADM_ita.svg'],
    [suffissiDomini.suffissoAe, 'ae/ae_colori.svg'],
    [suffissiDomini.suffissoAer, 'ader/ADER_logo.svg'],
    [suffissiDomini.suffissoSogei, 'sogei/Sogei_arancio.svg'],
])

const loghi = new Map([
    ['dark', loghiDark],
    ['light', loghiLight],
])

export default function App() {

    const [theme, setTheme] = useState(propsDominio.theme);
    const [img, setImg] = useState(<></>);
    const [linkStyle, setLinkStyle] = useState('');

    const switchTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    useEffect(() => {
        const importImg = async () => {
            const img = await import(`assets/${loghi.get(theme).get(propsDominio.suffissoDom)}`);
            setImg(<img src={img.default} className="logo" alt="logo" />);
        }
        importImg();
        setLinkStyle(theme === 'dark' ? 'link-white' : 'link-primary');
    }, [theme])

    return (
        <>
            <Header theme={theme} switchTheme={switchTheme} img={img} linkStyle={linkStyle} />
            <Body />
            <Footer theme={theme} img={img} linkStyle={linkStyle} />
        </>
    );
}