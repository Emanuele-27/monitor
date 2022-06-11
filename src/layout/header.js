import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <header aria-label="Informazioni e strumenti utente">
        <div id="agenzia-header" class="d-none d-md-block">
          <div class="container-fluid py-md-1">
            <p class="my-1"><a href="www.adm.gov.it">Agenzia delle dogane e dei Monopoli</a></p>
          </div>
        </div>
        <div id="page-header">
          <div class="container-fluid py-3">
            <div class="row align-items-center">
              <div class="col-auto">
                <img src="../assets/img/ADM_logo_152.png" alt="" class="logo" />
              </div>
              <div class="col">
                <h1>Monitoraggio PagoPA<small class="mt-md-1">Interrogazioni ed Analisi dei Pagamenti</small></h1>
              </div>
              <div class="col-auto">
                <div class="d-lg-flex flex-lg-column header-links btn-rounded">
                  <a href="" class="btn btn-primary btn-alt" title="Area di provenienza">
                    <i class="fas fa-sign-out-alt fa-rotate-270"></i><span class="sr-only">Area di provenienza</span>
                  </a>
                  <a href="" target="_blank" class="btn btn-primary btn-alt" title="Info e Assistenza">
                    <i class="fas fa-info"></i><span class="sr-only">Info e Assistenza: apre una nuova finestra</span>
                  </a>
                </div>
              </div>
              <div class="col-12 col-lg-auto">
                <div id="user-info" class="mt-3 mt-lg-0 shadow">
                  <div class="row">
                    <div class="col col-md-auto">
                      <span class="d-none d-md-inline">Utente: </span><strong>utente</strong>
                    </div>
                    <div class="col-auto d-block d-md-none">
                      <button type="button" id="open-user-info" class="collapsed" data-target="#user-collapse" data-toggle="collapse" aria-expanded="false">
                        <span class="sr-only">Apri menu utente</span>
                      </button>
                    </div>
                  </div>
                  <div id="user-collapse" class="collapse d-md-block">
                    <div class="row align-items-end">
                      <div class="col col-lg-auto">
                        <p>Seconda voce utente: <strong>valore</strong></p>
                        <span class="user-links">
                          <a class="d-block d-sm-inline-block mr-2" href=""><i class="fab fa-font-awesome-flag mr-2"></i>Link utente</a>
                          <a class="d-block d-sm-inline-block mr-2" href=""><i class="fab fa-font-awesome-flag mr-2"></i>Link utente</a>
                        </span>
                      </div>
                      <div class="col-auto">
                        <button type="button" class="btn btn-primary"><i class="fas fa-sign-out-alt mr-2"></i>Esci</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;