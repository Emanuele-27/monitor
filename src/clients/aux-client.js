import { configProps } from "config/config";
import { Accept, AcceptLanguage } from "util/client-util";
import { FetchClient } from "./fetch-client";

export class AuxClient extends FetchClient{
    baseUrl = '/api/SogeiPaySystemRAuxService/';

    constructor(host, accept, acceptLanguage) {
        super(accept, acceptLanguage);
        this.host = host;
    }

    nodoChiediStatoRPT(nodoChiediStatoRPT) {
        return this.callPOST(this.host + this.baseUrl + 'nodoChiediStatoRPT', nodoChiediStatoRPT);
    }

    nodoChiediCopiaRT(nodoChiediCopiaRT) {
        return this.callPOST(this.host + this.baseUrl + 'nodoChiediCopiaRT', nodoChiediCopiaRT);
    }

    nodoChiediStatoRPTCarrello(statoRPTCopiaRTCarrello) {
        return this.callPOST(this.host + this.baseUrl + 'nodoChiediStatoRPTCarrello', statoRPTCopiaRTCarrello);
    }

    nodoChiediCopiaRTCarrello(nodoChiediCopiaRTCarrello) {
        return this.callPOST(this.host + this.baseUrl + 'nodoChiediCopiaRTCarrello', nodoChiediCopiaRTCarrello);
    }
}

export const auxClient = new AuxClient(configProps.auxHost, Accept.json, AcceptLanguage.it)