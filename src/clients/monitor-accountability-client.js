import { configProps } from "config/config";
import { acceptJson, acceptLanguage } from "util/util";
import { FetchClient } from "./fetch-client";

export class MonitorAccountabilityClient extends FetchClient {
    baseUrl = '/api/SogeiPaySystemRAccountabilityService/';

    constructor(host, accept, acceptLanguage) {
        super(accept, acceptLanguage);
        this.host = host;
    }

    welcomeTest() {
        let endpoint = this.host + this.baseUrl + 'welcomeTest';
        return this.callGET(endpoint);
    }
}

export const monitorAccountabilityClient = new MonitorAccountabilityClient(configProps.monitorAccHost, acceptJson, acceptLanguage);