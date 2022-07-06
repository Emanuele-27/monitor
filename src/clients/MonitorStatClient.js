import { FetchClient } from "./FetchClient";

export class MonitorStatClient extends FetchClient{
    baseUrl;
    contentType;
    acceptLanguage;

    constructor(baseUrl, contentType, acceptLanguage){
        super();
        this.baseUrl = baseUrl;
        this.contentType = contentType;
        this.acceptLanguage = acceptLanguage;
    }

    async welcomeTest(){
        let uri = '/api/SogeiPaySystemRMonitorStatService/welcomeTest';
        let call = {isOnline: false};
        try{
            call = await this.getRequest(this.baseUrl + uri) 
        }catch(e){
            console.error("Errore nel welcomeTest: " + e.message);
        }
        return call;
    }
}