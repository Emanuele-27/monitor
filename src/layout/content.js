import React, { Component } from "react";

import {
    Route,
    Routes,
    Link
} from "react-router-dom";
import Elenco from "../components/elenco";
import Giornale from "../components/giornale";
import Home from "../components/home";
import Rpt from "../components/Rpt";
import './content.css';

class Content extends Component {
    render() {
        return (
            <div>
                <div className="container-fluid" style={{ width:"85%", marginTop: "2rem", marginBottom: "2rem" }}>
                    <div className="row">
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

                <div className="container" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/rpt" element={<Rpt />} />
                        <Route path="/elenco" element={<Elenco />} />
                        <Route path="/giornale" element={<Giornale />} />
                    </Routes>
                </div>
            </div>
        );
    }

    toggleFocusClass(ev) {
        let links = document.getElementsByTagName('a');
        [...links].forEach(elem => elem.classList.remove('entrypoint-focus'));
        document.getElementById(ev.target.id).classList.add('entrypoint-focus')
    }

    componentDidMount() {
        let links = document.getElementsByTagName('a');
        [...links].forEach(e => e.addEventListener("click", this.toggleFocusClass))
        document.getElementById('linkHome').classList.add('entrypoint-focus')
    }
}



export default Content;