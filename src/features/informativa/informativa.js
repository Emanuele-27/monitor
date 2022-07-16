import React from "react";
import { Panel } from 'primereact/panel';
import './informativa.css';
import PagoPALogo from 'assets/logoPagoPA.png';

export default function Informativa() {
    return (
        <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem", textAlign: "center" }}>
            <Panel id="informativa" header="Informativa">
                <div className="row">
                    <div className="col-12 col-xs-12 col-md-4">
                        <img src={PagoPALogo} alt="" />
                    </div>
                    <div className="col-12 col-xs-12 col-md-8">
                        <p> <b>pagoPA</b> è un ecosistema di regole, standard e strumenti definiti dall'Agenzia per l'Italia Digitale e accettati dalla Pubblica Amministrazione,
                            dalle Banche, Poste ed altri. pagoPA è un sistema di pagamenti elettronici realizzato per rendere più <b>semplice</b>, <b>sicuro</b> e <b>trasparente</b>
                            qualsiasi pagamento verso la Pubblica Amministrazione. È un modo diverso, più naturale e immediato per i cittadini di pagare la Pubblica
                            Amministrazione, il cui utilizzo comporta un risparmio economico per il Paese. pagoPA <b>non è un sito dove pagare</b>, ma una nuova modalità
                            per eseguire tramite i <b>Prestatori di Servizi di Pagamento (PSP)</b> aderenti, i <b>pagamenti verso la Pubblica Amministrazione</b> in modalità
                            standardizzata. Si possono effettuare i pagamenti direttamente sul <b>sito dell'Ente</b> o attraverso i canali sia fisici che online di banche
                            e altri Prestatori di Servizi di Pagamento (PSP).</p>
                        <p>pagoPA garantisce a privati e aziende:</p>
                        <ul>
                            <li><b>sicurezza e affidabilità</b> nei pagamenti;</li>
                            <li><b>semplicità e flessibilità</b> nella scelta delle modalità di pagamento;</li>
                            <li><b>trasparenza</b> nei costi di commissione.</li>
                        </ul>

                        <p>pagoPA garantisce alle pubbliche amministrazioni:</p>
                        <ul>
                            <li><b>certezza e automazione</b> nella riscossione degli incassi;</li>
                            <li><b>riduzione dei costi e standardizzazione</b> dei processi interni;</li>
                            <li><b>semplificazione e digitalizzazione</b> dei servizi.</li>
                        </ul>

                        <p>Gli istituti di pagamento <a target={"_blank"} rel="noreferrer" href="https://www.pagopa.gov.it/it/prestatori-servizi-di-pagamento/elenco-PSP-attivi/"> ( Prestatori di servizi di pagamento - PSP) aderenti all'iniziativa </a> </p>
                    </div>
                </div>

            </Panel>
        </div>
    );
}