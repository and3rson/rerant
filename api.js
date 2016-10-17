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
            data.token_key = authToken.key;
            data.token_id = authToken.id;
            data.user_id = authToken.user_id;
        }
        var query = '';
        if (method == 'GET' || method == 'DELETE') {
            pairs = [];
            Object.keys(data).forEach((key) => {
                pairs.push(key + '=' + encodeURIComponent(data[key]));
            });
            query = pairs.join('&');
        }
        console.log(method, this.baseUrl + url + '?' + query, JSON.stringify(data));
        fetch(this.baseUrl + url + '?' + query, {
            method: method,
            data: JSON.stringify(data),
        }).then((response) => {
            return response.json();
        }).then(
            (responseJson) => {
                callback(responseJson);
            }
        ).catch(
            (error) => {
                console.log('HTTP error:', error);
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        )
    }
    getRants(callback, skip) {
        skip = skip || 0;
        this.request('GET', '/devrant/rants', {skip: skip}, (data) => {
            callback(data.rants);
        });
    }
    getOne(id, callback) {
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
        }, (data) => {
            $localStorage.authToken = data.auth_token;
            $rootScope.$broadcast('auth.stateChanged');
            DevRantApi.setAuthToken(data.auth_token);
            callback();
        }, (errorData) => {
            errorCallback(errorData.data.error || errorData.data.message);
        })
    }
    logout() {
        $localStorage.authToken = null;
        $rootScope.$emit('auth.stateChanged');
        this.setAuthToken(null);
    }
    isAuthorized() {
        return !!$localStorage.authToken;
    }
    getAuthToken() {
        return $localStorage.authToken;
    }
    getUserId() {
        return $localStorage.authToken ? $localStorage.authToken.user_id : null;
    }
    assert(callback) {
        if ($localStorage.authToken) {
            callback();
        } else {
            $ionicPopup.confirm({
                title: 'Authorization required',
                template: 'You need to be authorized to perform this action.'
            }).then((res) => {
                if (res) {
                    $state.go('login');
                }
            });
        }
    }
}
exports.api = new DevRantApi();
