import { configProps } from "config/config";
import { Accept, AcceptLanguage } from "util/client-util";
import { FetchClient } from "./fetch-client";

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

export const monitorStatClient = new MonitorStatClient(configProps.monitorStatHost, Accept.json, AcceptLanguage.it);