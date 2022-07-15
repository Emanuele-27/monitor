export class FetchClient {
    constructor(accept, acceptLanguage) {
        this.headers = {
            'Accept': accept,
            'Content-Type': accept,
            'Accept-Language': acceptLanguage
        }
    }

    callGET(url) {
        return this.call(url, 'GET');
    }

    callPOST(url, body) {
        return this.call(url, 'POST', body);
    }

    async call(url, method, body) {
        const request = {
            method: method,
            headers: this.headers
        };
        if (body) request.body = JSON.stringify(body);

        try{
            let response = await fetch(url, request);
            console.log('call: ' + url + ' status: ' + response.status);
            return response.json();
        } catch(error){
            console.log('call: ' + url + ' error: ' + error.message);
        }
    }
}