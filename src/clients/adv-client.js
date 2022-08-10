import { configProps } from "config/config";
import { acceptJson, acceptLanguage } from "util/util";
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

export const advClient = new AdvClient(configProps.advHost, acceptJson, acceptLanguage)