import React, { Component } from "react";
import { ReactComponent as ADMLogo } from './ADM_ita-bianco.svg';

class Header extends Component {
  render() {
    return (<div>
      <header aria-label="Informazioni e strumenti utente">
        <div class="header-top-dark d-none d-md-block">
          <div class="container py-2">
            <a href="" class="link-white">
              <i class="bi bi-arrow-left me-2"></i>Area di provenienza
            </a>
          </div>
        </div>
        <div class="header-dark">
          <div class="container py-3 py-md-4">
            <div class="row align-items-center gx-2 gx-md-4">
              <div class="col-auto d-block d-md-none">
                <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false">
                  <span class="visually-hidden">Apri menu principale</span>
                  <i class="bi bi-list bi-lg"></i>
                </button>
              </div>
              <div class="col-auto">
                <ADMLogo className="logo" />
              </div>
              <div class="col">
                <h1>Monitoraggio PagoPA</h1>
              </div>
              <div class="col-auto">
                <div class="dropdown">
                  <button type="button" id="notification-list" class="btn link-white p-0" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-bell bi-lg"></i>
                    <span class="badge badge-secondary rounded-circle position-absolute top-0 start-100 translate-middle">2<span class="visually-hidden">nuove notifiche</span>
                    </span>
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="notification-list">
                    <li>
                      <a class="dropdown-item" href="">Notifica 1</a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="">Notifica 2</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-auto d-none d-md-block">
                <div class="vr"></div>
              </div>
              <div class="col-auto">
                <span class="d-none d-md-inline">Ciao,<strong class="ms-2">Nome Cognome</strong>
                </span>
                <a href="#" class="btn link-white p-0 ms-3">
                  <i class="bi bi-person-circle bi-lg bi-md-2x"></i>
                  <span class="visually-hidden">Informazioni utente</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Menu principale">
        <h1 class="visually-hidden">Menu principale</h1>
        <div class="navbar navbar-expand-md navbar-dark">
          <div class="container">
            <div class="navbar-collapse collapse" id="navbar-menu">
              <ul class="navbar-nav me-auto">
                <li class="nav-item">
                  <a class="nav-link" href="#">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Informativa</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Legenda</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav></div>
    );
  }
}

export default Header;