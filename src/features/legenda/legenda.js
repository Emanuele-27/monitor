import React from "react";
import { Panel } from 'primereact/panel';
import '../informativa/informativa.css';
import './legenda.css';

export default function Legenda() {
  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <Panel id="legenda" header="Legenda">
        <div class="table-responsive">
          <table class="table">
            <tbody>
              <tr>
                <td>DOMINIO</td>
                <td>Codice Fiscale dell’Ente Creditore</td>
              </tr>
              <tr>
                <td>IUV</td>
                <td>Identificativo Univoco Versamento</td>
              </tr>
              <tr>
                <td>CODICE CONTESTO</td>
                <td>Serve a contestualizzare e rendere univoco lo specifico pagamento insieme ai dati Codice Fiscale (DOMINIO) dell’Ente Creditore e codice IUV</td>
              </tr>
              <tr>
                <td>NodoDeiPagamentiSPC</td>
                <td>Piattaforma tecnologica per l’interconnessione e l’interoperabilità tra le Pubbliche Amministrazioni e i Prestatori di Servizi di Pagamento</td>
              </tr>
              <tr>
                <td>PA</td>
                <td>Pubblica Amministrazione</td>
              </tr>
              <tr>
                <td>PSP</td>
                <td>Prestatore di Servizi di Pagamento. Banche, Istituti di pagamento o moneta elettronica, abilitati da Banca d’Italia ad effettuare servizi di pagamento</td>
              </tr>
              <tr>
                <td>RPT</td>
                <td>Richiesta di Pagamento Telematico. Oggetto informatico inviato dall’ente creditore al PSP attraverso il Nodo dei Pagamenti-SPC al fine di richiedere l’esecuzione di un pagamento</td>
              </tr>
              <tr>
                <td>RT</td>
                <td>Ricevuta Telematica. Oggetto informatico inviato dal PSP all’ente creditore attraverso il Nodo dei Pagamenti-SPC in risposta ad una Richiesta di Pagamento Telematico effettuata da un’ente creditore</td>
              </tr>
              <tr>
                <td>KOA0000</td>
                <td>ERRORE GENERICO</td>
              </tr>
              <tr>
                <td>KOA0001</td>
                <td>SOGGETTI VERSANTI DIVERSI IN CARRELLO. In fase di invio carrello rpt il soggetto versante deve essere unico per tutte le rpt</td>
              </tr>
              <tr>
                <td>KOA0002</td>
                <td>BENEFICIARI CON DIVERSO INTERMEDIARIO. In fase di invio carrello in ogni rpt i beneficiari possono essere diversi per rpt ma tutti i beneficiari devono avere lo stesso intermediario</td>
              </tr>
              <tr>
                <td>KOA0003</td>
                <td>BENEFICIARI DIVERSI X RPT. In fase di invio carrello il beneficiario deve essere lo stesso per tutta la rpt</td>
              </tr>
              <tr>
                <td>KOA0004	</td>
                <td>ENTE CREDITORE NON TROVATO.</td>
              </tr>
              <tr>
                <td>KOA0005</td>
                <td>BENEFICIARIO NON TROVATO. Il codice fiscale del beneficiario non e' censito nell'anagrafica (in descrizione il codice fiscale non trovato)</td>
              </tr>
              <tr>
                <td>KOA0006</td>
                <td>ERRORI SOSTANZIALI. controlli sostanziali non superati</td>
              </tr>
              <tr>
                <td>KOS0001</td>
                <td>ERRORE_INTERNO. Errore DB o eccezione non prevista (exception valorizzata)</td>
              </tr>
              <tr>
                <td>KOS0002</td>
                <td>ERRORE_NDP. L'invocazione del Nodo dei Pagamenti ha ritornato un errore applicativo</td>
              </tr>
              <tr>
                <td>KOS0003</td>
                <td>ERRORE NDP WEB. L'invocazione del Nodo dei Pagamenti ha avuto un errore di connessione (exception valorizzata)</td>
              </tr>
              <tr>
                <td>KOS0004</td>
                <td>ERRORE NDP WEB. L'invocazione dei servizi dell'Ente (notifica o verifica) ha ritornato un errore</td>
              </tr>
              <tr>
                <td>KOS0005</td>
                <td>ERRORE INTERNO DATA. Errore valorizzazione dati o eccezione non prevista</td>
              </tr>
              <tr>
                <td>KOS0006</td>
                <td>ERRORE TIPOFIRMA SCONOSCIUTO.</td>
              </tr>
              <tr>
                <td>KOS0007</td>
                <td>ERRORE ESITOPAGAMENTO SCONOSCIUTO</td>
              </tr>
              <tr>
                <td>KOS0008</td>
                <td>ERRORE RPT RIFIUTATA NODO, RPT rifiutata dal Nodo per sintassi o semantica errata</td>
              </tr>
              <tr>
                <td>KOS0009</td>
                <td>ERRORE RPT ERRORE INVIO A PSP, RPT errore di invio a PSP</td>
              </tr>
              <tr>
                <td>KOS0010</td>
                <td>ERRORE RPT RIFIUTATA PSP, RPT rifiutata dall'Intermediario PSP per sintassi o semantica errata</td>
              </tr>
              <tr>
                <td>KOS0011</td>
                <td>ERRORE VALIDAZIONE NDP, Il pagamento non rispetta i vincoli del Nodo dei Pagamenti (descrizione con dettaglio sulla violazione)</td>
              </tr>
              <tr>
                <td>faultCode</td>
                <td>faultString</td>
              </tr>
              <tr>
                <td>PPT_CANALE_DISABILITATO	</td>
                <td>Canale conosciuto ma disabilitato da configurazione.</td>
              </tr>
              <tr>
                <td>PPT_CANALE_ERR_PARAM_PAG_IMM</td>
                <td>Parametri restituiti dal Canale per identificare il pagamento non corretti</td>
              </tr>
              <tr>
                <td>PPT_CANALE_ERRORE</td>
                <td>Errore restituito dal Canale.</td>
              </tr>
              <tr>
                <td>PPT_CANALE_ERRORE_RESPONSE</td>
                <td>La response ricevuta dal Canale è vuota o non corretta sintatticamente o semanticamente</td>
              </tr>
              <tr>
                <td>PPT_CANALE_INDISPONIBILE</td>
                <td>Nessun canale utilizzabile e abilitato.</td>
              </tr>
              <tr>
                <td>PPT_CANALE_IRRAGGIUNGIBILE</td>
                <td>Errore di connessione verso il Canale.</td>
              </tr>
              <tr>
                <td>PPT_CANALE_NONRISOLVIBILE</td>
                <td>Il canale non è specificato, e nessun canale risulta utilizzabile secondo configurazione.</td>
              </tr>
              <tr>
                <td>PPT_CANALE_SCONOSCIUTO</td>
                <td>Canale sconosciuto.</td>
              </tr>
              <tr>
                <td>PPT_CANALE_SERVIZIO_NONATTIVO</td>
                <td>Il Servizio Applicativo del Canale non è attivo.</td>
              </tr>
              <tr>
                <td>PPT_CANALE_TIMEOUT</td>
                <td>Timeout risposta dal Canale.</td>
              </tr>
              <tr>
                <td>PPT_CODIFICA_PSP_SCONOSCIUTA</td>
                <td>Valore di codificaInfrastruttura PSP non censito.</td>
              </tr>
              <tr>
                <td>PPT_DOMINIO_DISABILITATO</td>
                <td>Dominio disabilitato</td>
              </tr>
              <tr>
                <td>PPT_DOMINIO_SCONOSCIUTO</td>
                <td>Identificativo Dominio sconosciuto.</td>
              </tr>
              <tr>
                <td>PPT_ERRORE_EMESSO_DA_PAA</td>
                <td>Errore restituito dall’Ente Creditore.</td>
              </tr>
              <tr>
                <td>PPT_ERRORE_FORMATO_BUSTA_FIRMATA</td>
                <td>Formato busta di firma errato o non corrispondente al tipoFirma.</td>
              </tr>
              <tr>
                <td>PPT_FIRMA_INDISPONIBILE</td>
                <td>Impossibile firmare.</td>
              </tr>
              <tr>
                <td>PPT_ID_CARRELLO_DUPLICATO</td>
                <td>Identificativo Carrello RPT duplicato.</td>
              </tr>
              <tr>
                <td>PPT_ID_FLUSSO_SCONOSCIUTO</td>
                <td>Identificativo flusso sconosciuto.</td>
              </tr>
              <tr>
                <td>PPT_OPER_NON_STORNABILE</td>
                <td>Operazione non stornabile.</td>
              </tr>
              <tr>
                <td>PPT_PSP_DISABILITATO</td>
                <td>PSP conosciuto ma disabilitato da configurazione</td>
              </tr>
              <tr>
                <td>PPT_PSP_SCONOSCIUTO</td>
                <td>PSP sconosciuto</td>
              </tr>
              <tr>
                <td>PPT_RPT_DUPLICATA</td>
                <td>RPT duplicata.</td>
              </tr>
              <tr>
                <td>PPT_RPT_SCONOSCIUTA</td>
                <td>RPT sconosciuta.</td>
              </tr>
              <tr>
                <td>PPT_RT_NONDISPONIBILE</td>
                <td>RT non ancora pronta.</td>
              </tr>
              <tr>
                <td>PPT_RT_SCONOSCIUTA</td>
                <td>RT sconosciuta.</td>
              </tr>
              <tr>
                <td>PPT_SEMANTICA</td>
                <td>Errore semantico.</td>
              </tr>
              <tr>
                <td>PPT_SINTASSI_EXTRAXSD</td>
                <td>Errore di sintassi extra XSD.</td>
              </tr>
              <tr>
                <td>PPT_SINTASSI_XSD</td>
                <td>Errore di sintassi XSD.</td>
              </tr>
              <tr>
                <td>PPT_STAZIONE_INT_PA_DISABILITATA	</td>
                <td>Stazione disabilitata.</td>
              </tr>
              <tr>
                <td>PPT_STAZIONE_INT_PA_IRRAGGIUNGIBILE</td>
                <td>Errore di connessione verso la Stazione</td>
              </tr>
              <tr>
                <td>PPT_STAZIONE_INT_PA_SCONOSCIUTA</td>
                <td>IdentificativoStazioneRichiedente sconosciuto.</td>
              </tr>
              <tr>
                <td>PPT_STAZIONE_INT_PA_SERVIZIO_NONATTIVO</td>
                <td>Il Servizio Applicativo della Stazione non e’attivo</td>
              </tr>
              <tr>
                <td>PPT_SUPERAMENTOSOGLIA</td>
                <td>Una qualche soglia fissata per PPT è temporaneamente superata e la richiesta è quindi rifiutata.</td>
              </tr>
              <tr>
                <td>PPT_SYSTEM_ERROR</td>
                <td>Errore generico.</td>
              </tr>
              <tr>
                <td>PPT_TIPOFIRMA_SCONOSCIUTO</td>
                <td>Il campo tipoFirma non corrisponde ad alcun valore previsto.</td>
              </tr>
              <tr>
                <td>PPT_WISP_SESSIONE_SCONOSCIUTA</td>
                <td>La tripletta idDominio+keyPA+keyWISP non corrisponde ad alcuna sessione memorizzata nella componente WISP.</td>
              </tr>
              <tr>
                <td>PPT_WISP_TIMEOUT_RECUPERO_SCELTA</td>
                <td>La tripletta idDominio+keyPA+keyWISP è relativa ad una scelta effettuata scaduta.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </Panel>
    </div>
  );
}