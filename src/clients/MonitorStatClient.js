import { FetchClient } from "./FetchClient";

export class MonitorStatClient extends FetchClient{
    baseUrl = '/api/SogeiPaySystemRMonitorStatService/';

    constructor(host, accept, acceptLanguage) {
        super(accept, acceptLanguage);
        this.host = host;
    }

    welcomeTest() {
        let endpoint = this.host + this.baseUrl + 'welcomeTest';
        return this.callGET(endpoint);
    }
}