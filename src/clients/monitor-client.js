import { configProps } from "config/config";
import { acceptJson, acceptLanguage } from "util/util";
import { FetchClient } from "./fetch-client";

export class MonitorClient extends FetchClient{
    baseUrl = '/api/SogeiPaySystemRMonitorService/';

    constructor(host, accept, acceptLanguage) {
        super(accept, acceptLanguage);
        this.host = host;
    }

    welcomeTest() {
        return this.callGET(this.host + this.baseUrl + 'welcomeTest');
    }

    getServizi() {
        return this.callPOST(this.host + this.baseUrl + 'getServizi');
    }

    getFlussi(flussoData) {
        return this.callPOST(this.host + this.baseUrl + 'getFlussi', flussoData);
    }

    getGiornale(flussoGiornaleEventi){
        return this.callPOST(this.host + this.baseUrl + 'getGiornale', flussoGiornaleEventi);
    }

    getGiornalePerPagamento(giornaleEventi){
        return this.callPOST(this.host + this.baseUrl + 'getGiornalePerPagamento', giornaleEventi);
    }

    getRptSenzaRt(flussoData){
        return this.callPOST(this.host + this.baseUrl + 'getRptSenzaRt', flussoData);
    }
}

export const monitorClient = new MonitorClient(configProps.monitorHost, acceptJson, acceptLanguage);