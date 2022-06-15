import React, { Component } from "react";
import { ReactComponent as ADMLogo } from './ADM_ita-bianco.svg';

class Footer extends Component {
  render() {
    return (
      <footer>
        <div class="footer-dark">
          <div class="container py-3 py-md-4">
            <div class="row gx-2 gx-md-4">
              <div class="col-auto">
                  <ADMLogo className="logo" />
              </div>
              <div class="col">
                <h1>
                  <span class="visually-hidden">Informazioni su </span>Monitoraggio PagoPA
                </h1>
                <hr />
                <ul class="list-inline d-inline-block me-3 mb-0">
                  <li class="list-inline-item">
                    <a href="#" class="link-white">Dichiarazione di accessibilità</a>
                  </li>
                  <li class="list-inline-item">
                    <a href="#" class="link-white">Cookie</a>
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