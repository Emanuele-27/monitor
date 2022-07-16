import React from "react";

import Footer from "./layout/footer";
import Header from "./layout/header";
import Body from "./layout/body";
import { propsDominio, suffissiDomini } from "util/config";

import { ReactComponent as ADMLogo } from 'assets/adm/ADM_ita-bianco.svg';
import { ReactComponent as AELogo } from 'assets/ae/ae_bianco.svg';

// Mapping dominio corrente - file css
const mapperDominioCSS = new Map([
    [suffissiDomini.suffissoAdm, 'adm'],
    [suffissiDomini.suffissoAe, 'agenzia-entrate']
]);

const mapperDominioLogo = new Map([
    [suffissiDomini.suffissoAdm,  <ADMLogo className="logo" />],
    [suffissiDomini.suffissoAe, <AELogo className="logo" />]
]);

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.addStylesheeBasedOnHostname();
    }

    addStylesheeBasedOnHostname() {
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', '/css/' + mapperDominioCSS.get(propsDominio.suffissoDom) + '.css');
        document.head.appendChild(link);
    }

    render() {
        return (
            <>
                <Header logo={mapperDominioLogo.get(propsDominio.suffissoDom)} />
                <Body />
                <Footer logo={mapperDominioLogo.get(propsDominio.suffissoDom)} />
            </>
        );
    }
}