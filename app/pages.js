import React, { Component } from 'react';

import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TextInput
} from 'react-native';

import Button from 'react-native-button';

import { context } from './context';

import {
    styles
} from './styles';

import {
    RantListView
} from './components';

import { api } from './api';


export class FeedPage extends Component {
    static get defaultProps() {
        return {
            title: 'Feed'
        }
    }
    render() {
        return (
            <RantListView style={styles.container}/>
        );
    }
}

export class RantPage extends Component {
    static get defaultProps() {
        return {
            title: 'View rant'
        }
    }
    constructor(props) {
        super(props);
        this.state= {
            rant: {},
            refreshing: true
        };
        this.loadRant();
    }
    loadRant() {
        api.getRant(this.props.rantId, (data) => {
            this.setState({
                rant: data.rant,
                refreshing: false
            });
        });
    }
    onRefresh() {
        this.setState({refreshing: true, rant: {}});
        this.loadRant();
    }
    render(route, navigator) {
        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />
                }
            >
                <Text>
                    {this.state.rant.text}
                </Text>
            </ScrollView>
        )
    }
}

export class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }
    render() {
        return (
            <View style={styles.container} padding={16}>
                <TextInput padding={16} placeholder="Login" value={this.username} onChangeText={(value) => this.setState({username: value})} />
                <TextInput padding={16} placeholder="Password" value={this.password} onChangeText={(value) => this.setState({password: value})} />
                <Button paddingTop={16} style={styles.button} onPress={this.login.bind(this)}>LOG IN</Button>
            </View>
        )
    }
    login() {
        api.login(this.state.username, this.state.password, (data) => {
            console.log('Login successful!');
            context._navigator.replace({id: 'feed', title: 'Feed'});
        }, (error) => {
            console.log('Failed to log in:', error);
        })
    }
}
