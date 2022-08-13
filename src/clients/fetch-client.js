export class FetchClient {
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
            method: method,
            headers: this.headers,
            ...(body && { body: JSON.stringify(body) })
        };
        return (await fetch(url, request)).json();
    }
}