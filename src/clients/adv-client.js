import { configProps } from "config/config";
import { Accept, AcceptLanguage } from "util/client-util";
import { FetchClient } from "./fetch-client";

export class AdvClient extends FetchClient{
    baseUrl = '/api/PaySystemDocumentService/';

    constructor(host, accept, acceptLanguage) {
        super(accept, acceptLanguage);
        this.host = host;
    }

    recuperaAvvisoPagamento(avvisoPagamentoDoc) {
        return this.callPOST(this.host + this.baseUrl + 'recuperaAvvisoPagamento', avvisoPagamentoDoc);
    }

}

export const advClient = new AdvClient(configProps.advHost, Accept.json, AcceptLanguage.it)