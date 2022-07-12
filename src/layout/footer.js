import React, { Component } from "react";
import { ReactComponent as ADMLogo } from "assets/ADM_ita-bianco.svg";

class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="footer-dark">
          <div className="container py-3 py-md-4">
            <div className="row gx-2 gx-md-4">
              <div className="col-auto">
                  <ADMLogo className="logo" />
              </div>
              <div className="col">
                <h1>
                  <span className="visually-hidden">Informazioni su </span>Monitoraggio PagoPA
                </h1>
                <hr />
                <ul className="list-inline d-inline-block me-3 mb-0">
                  <li className="list-inline-item">
                    <a href="#" className="link-white">Dichiarazione di accessibilità</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#" className="link-white">Cookie</a>
                  </li>
                </ul>
                <strong>Agenzia delle dogane e dei monopoli</strong>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;