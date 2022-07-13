import { FetchClient } from "./fetchClient";

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
}