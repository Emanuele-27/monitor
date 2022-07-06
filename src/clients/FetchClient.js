export class FetchClient{
    constructor(){}
    
    async postRequest(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Accept': this.contentType,
            'Accept-Language': this.acceptLanguage
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async getRequest(url = '') {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'Accept': this.contentType,
            'Accept-Language': this.acceptLanguage
            }
        });
        return response.json();
    }
}