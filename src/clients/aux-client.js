import { configProps } from "config/config";
import { acceptJson, acceptLanguage } from "util/util";
import { FetchClient } from "./fetch-client";

export class AuxClient extends FetchClient{
    baseUrl = '/api/SogeiPaySystemRAuxService';

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
}

export const auxClient = new AuxClient(configProps.auxHost, acceptJson, acceptLanguage)