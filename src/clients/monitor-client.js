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
}