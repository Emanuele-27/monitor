import React from "react";
import { propsDominio } from "config/config";

export default function Footer(props) {

  return <footer>
    <div className={"footer-" + props.theme}>
      <div className="container py-3 py-md-4">
        <div className="row gx-2 gx-md-4">
          <div className="col-auto">
            {props.img}
          </div>
          <div className="col">
            <h1>
              <span className="visually-hidden">Informazioni su </span>Monitoraggio PagoPA
            </h1>
            <hr />
            <ul className="list-inline d-inline-block me-3 mb-0">
              <li className="list-inline-item">
                <a href="#" className={props.linkStyle}>Dichiarazione di accessibilità</a>
              </li>
              <li className="list-inline-item">
                <a href="#" className={props.linkStyle}>Cookie</a>
              </li>
            </ul>
            <strong>{propsDominio.denominazione}</strong>
          </div>
        </div>
      </div>
    </div>
  </footer>
}