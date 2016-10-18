class DevRantApi {
    constructor() {
        this.baseUrl = 'https://www.devrant.io/api';
        this.authToken = null;
    }
    setAuthToken(newAuthToken) {
        this.authToken = newAuthToken;
    }
    request(method, url, data, callback, errorCallback) {
        data = data || {};
        data.app = 3;
        if (this.authToken) {
            data.token_key = this.authToken.key;
            data.token_id = this.authToken.id;
            data.user_id = this.authToken.user_id;
        }
        var finalUrl = '';
        var body = '';
        if (method == 'GET' || method == 'DELETE') {
            pairs = [];
            Object.keys(data).forEach((key) => {
                pairs.push(key + '=' + encodeURIComponent(data[key]));
            });
            finalUrl = this.baseUrl + url + '?' + pairs.join('&');
            params = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } else {
            finalUrl = this.baseUrl + url;
            params = {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
        console.log(params.method, finalUrl, params.body || '<no body>');
        fetch(finalUrl, params).then((response) => {
            // if (response.status >= 400 ) {
            //     console.log('CODE BAD:', response);
            //     response = JSON.parse(response);
            //     console.log('CODE BAD:', response);
            //     throw new Error(response.error || response.message);
            // }
            return response.json();
        }).then(
            (responseJson) => {
                if (!responseJson.success) {
                    if (errorCallback) {
                        // console.log('RESPONSE:', responseJson.error || responseJson.message);
                        errorCallback(responseJson.error || responseJson.message);
                    } else {
                        console.error('API error:', responseJson);
                    }
                } else {
                    callback(responseJson);
                }
            }
        ).catch(
            (error) => {
                console.error('HTTP error:', error);
            }
        );
    }
    getRants(callback, skip) {
        skip = skip || 0;
        this.request('GET', '/devrant/rants', {skip: skip}, (data) => {
            callback(data.rants);
        });
    }
    getRant(id, callback) {
        this.request('GET', '/devrant/rants/' + id, {}, (data) => {
            callback(data);
        });
    }
    voteRant(id, vote, callback) {
        this.request('POST', '/devrant/rants/' + id + '/vote', {
            vote: vote
        }, (data) => {
            callback(data);
        });
    }
    voteComment(id, vote, callback) {
        this.request('POST', '/comments/' + id + '/vote', {
            vote: vote
        }, (data) => {
            callback(data);
        });
    }
    getUser(id, callback) {
        this.request('GET', '/users/' + id, {}, (data) => {
            callback(data);
        })
    }
    login(username, password, callback, errorCallback) {
        this.request('POST', '/users/auth-token', {
            username: username,
            password: password
        }, ((data) => {
            this.authToken = data.auth_token;
            this.setAuthToken(data.auth_token);
            callback();
        }).bind(this), ((errorMessage) => {
            errorCallback(errorMessage);
        }).bind(this))
    }
    logout() {
        this.authToken = null;
        this.setAuthToken(null);
    }
    isAuthorized() {
        return !!this.authToken;
    }
    getAuthToken() {
        return this.authToken;
    }
    getUserId() {
        return this.authToken ? this.authToken.user_id : null;
    }
    assert(callback) {
        if (this.authToken) {
            callback();
        } else {
            // TODO: Implement this!

            // $ionicPopup.confirm({
            //     title: 'Authorization required',
            //     template: 'You need to be authorized to perform this action.'
            // }).then((res) => {
            //     if (res) {
            //         $state.go('login');
            //     }
            // });
        }
    }
}
exports.api = new DevRantApi();
