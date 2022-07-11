import { FetchClient } from "./FetchClient";

export class MonitorClient extends FetchClient{
    baseUrl = '/api/SogeiPaySystemRMonitorService/';

    constructor(host, accept, acceptLanguage) {
        super(accept, acceptLanguage);
        this.host = host;
    }

    welcomeTest() {
        let endpoint = this.host + this.baseUrl + 'welcomeTest';
        return this.callGET(endpoint);
    }
}