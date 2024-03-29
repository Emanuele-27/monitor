import React, { useState } from "react";
import { Link } from "react-router-dom";

import { propsDominio } from "config/config";

import './layout.css';

export default function Header(props) {

    const [checked, setChecked] = useState(props.theme === 'dark');

    return <> <header aria-label="Informazioni e strumenti utente">
        <div className={"header-top-" + props.theme + " d-none d-md-block"}>
            <div className="container py-2">
                <a href={propsDominio.provenienzaUrl} target="_self" className={props.linkStyle}>
                    <i className="bi bi-arrow-left me-2"></i>Area di provenienza
                </a>
                <div className="form-check form-switch form-switch-lg" style={{ float: "right" }}>
                    <input type="checkbox" aria-label="Switch per alternare light mode e dark mode" id="switch" name="switch" className="form-check-input" checked={!checked} onChange={() => {
                        setChecked(!checked);
                        props.switchTheme();
                    }} />
                    {checked ? <label htmlFor="switch" className="form-check-label"><i className="pi pi-moon" style={{ color: "white" }} /></label>
                        : <label htmlFor="switch" className="form-check-label"><i className="pi pi-sun" /></label>}
                </div>
            </div>
        </div>
        <div className={"header-" + props.theme}>
            <div className="container py-3 py-md-4">
                <div className="row align-items-center gx-2 gx-md-4">
                    <div className="col-auto d-block d-md-none">
                        <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false">
                            <span className="visually-hidden">Apri menu principale</span>
                            <i className="bi bi-list bi-lg"></i>
                        </button>
                    </div>
                    <div className="col-auto">
                        {props.img}
                    </div>
                    <div className="col">
                        <h1>Monitoraggio PagoPA</h1>
                    </div>
                    <div className="col-auto">
                        <div className="dropdown">
                            <button type="button" id="notification-list" className={"btn " + props.linkStyle + " p-0"} data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-bell bi-lg"></i>
                                <span className="badge badge-secondary rounded-circle position-absolute top-0 start-100 translate-middle">2<span className="visually-hidden">nuove notifiche</span>
                                </span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="notification-list">
                                <li>
                                    <a className="dropdown-item" href="">Notifica 1</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="">Notifica 2</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-auto d-none d-md-block">
                        <div className="vr"></div>
                    </div>
                    <div className="col-auto">
                        <span className="d-none d-md-inline">Ciao,<strong className="ms-2">Nome Cognome</strong>
                        </span>
                        <a href="#" className={"btn " + props.linkStyle + " p-0 ms-3"}>
                            <i className="bi bi-person-circle bi-lg bi-md-2x"></i>
                            <span className="visually-hidden">Informazioni utente</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>

        <nav aria-label="Menu principale">
            <h1 className="visually-hidden">Menu principale</h1>
            <div className={"navbar navbar-expand-md navbar-" + props.theme}>
                <div className="container">
                    <div className="navbar-collapse collapse" id="navbar-menu">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to="/content" className="nav-link"><i className="bi bi-house" style={{ paddingRight: "0.2rem" }}></i> Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/informativa" className="nav-link"> <i className="bi bi-info-square" style={{ paddingRight: "0.2rem" }}></i> Informativa</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/legenda" className="nav-link"> <i className="bi bi-list-ul" style={{ paddingRight: "0.2rem" }}></i> Legenda</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </>;
}
