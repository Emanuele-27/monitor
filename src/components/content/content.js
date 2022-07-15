import React, { Component } from "react";

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

import './content.css';

export const blockContent = () => this.setState({ blockedContent: true });

export const idDominio = process.env.REACT_APP_ID_DOMINIO;

class Content extends Component {

    constructor() {
        super();
        this.state = {
            blockedContent: false
        };
        this.blockContent = this.blockContent.bind(this);
        this.unblockContent = this.unblockContent.bind(this);
    }


    blockContent() {
        this.setState({
            blockedContent: true
        });
    }

    unblockContent() {
        this.setState({
            blockedContent: false
        });
    }

    render() {
        return (
            <BlockUI blocked={this.state.blockedContent} >
                <div>
                    <div className="container-fluid" style={{ width: "85%", paddingTop: "2rem"}}>
                        <div id="stepRow" className="row">
                            <div className="col-12 col-md-4 col-xl-3">
                                <Link to="/home" id="linkHome" className="btn btn-outline-primary btn-lg entrypoint">
                                    HOME
                                </Link>
                            </div>
                            <div className="col-12 col-md-4 col-xl-3">
                                <Link to="/rpt" id="linkRpt" className="btn btn-outline-primary btn-lg entrypoint">
                                    RPT SENZA RT
                                </Link>
                            </div>
                            <div className="col-12 col-md-4 col-xl-3">
                                <Link to="/elenco" id="linkElenco" className="btn btn-outline-primary btn-lg entrypoint">
                                    ELENCO FLUSSI
                                </Link>
                            </div>
                            <div className="col-12 col-md-4 col-xl-3">
                                <Link to="/giornale" id="linkGiornale" className="btn btn-outline-primary btn-lg entrypoint">
                                    GIORNALE EVENTI
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem"}}>
                        <Routes>
                            <Route exact path="/" element={<Home blockContent={this.blockContent} unblockContent={this.unblockContent} />} />
                            <Route path="/home" element={<Home blockContent={this.blockContent} unblockContent={this.unblockContent} />} />
                            <Route path="/rpt" element={<Rpt blockContent={this.blockContent} unblockContent={this.unblockContent} />} />
                            <Route path="/elenco" element={<Elenco blockContent={this.blockContent} unblockContent={this.unblockContent} />} />
                            <Route path="/giornale" element={<Giornale blockContent={this.blockContent} unblockContent={this.unblockContent} />} />
                        </Routes>
                    </div>
                </div>
            </BlockUI>
        );
    }

    toggleFocusClass(ev) {
        document.getElementById('stepRow').getElementsByClassName('entrypoint-focus')[0].classList.remove('entrypoint-focus');
        ev.target.classList.add('entrypoint-focus');
    }

    componentDidMount() {
        let links = document.getElementById('stepRow').getElementsByTagName('a');
        [...links].forEach(e => e.addEventListener("click", this.toggleFocusClass))
        document.getElementById('linkHome').classList.add('entrypoint-focus')
    }
}



export default Content;