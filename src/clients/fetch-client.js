export class FetchClient {

    gatewayUrl = 'http://localhost:3001/test'

    constructor(accept, acceptLanguage) {
        this.headers = {
            'Accept': accept,
            'Content-Type': accept,
            'Accept-Language': acceptLanguage,
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
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(this.body(url, method, body))
        };
        return (await fetch(this.gatewayUrl, request)).json();
    }

    body(url, method, body) {
        if (body) {
            body['endpoint'] = url;
            body['method'] = method;
            return body;
        } else
            return { endpoint: url, method: method }
    }
}