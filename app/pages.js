import React, { Component } from 'react';

import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TextInput,
    ListView
} from 'react-native';

import Button from 'react-native-button';

import { context } from './context';

import {
    styles
} from './styles';

import {
    RantListView,
    UserBox,
    CommentListItem
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
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            rant: {},
            refreshing: true,
            dataSource: this.ds
        };
        this.userBox = null;
        this.loadRant();
    }
    loadRant() {
        api.getRant(this.props.rantId, (data) => {
            this.setState({
                rant: data.rant,
                refreshing: false
            });
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(data.comments)
            });
            this.userBox.setState({
                user: {
                    id: data.rant.user_id,
                    username: data.rant.user_username,
                    avatar: data.rant.user_avatar,
                    score: data.rant.user_score
                }
            });
        });
    }
    onRefresh() {
        this.setState({refreshing: true, rant: {}});
        this.loadRant();
    }
    render() {
        return (
            <ScrollView
                style={styles.rowVertical}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />
                }
            >
                <UserBox ref={(ref) => this.userBox = ref} />
                <View style={styles.colCollapsed} style={{
                    borderBottomWidth: 2,
                    borderColor: '#CCCCCC'
                }}>
                    <Text style={{padding: 10, paddingLeft: 68}}>
                        {this.state.rant.text}
                    </Text>
                </View>
                <ListView
                    style={styles.commentListView}
                    scrollEnabled={false}
                    dataSource={this.state.dataSource}
                    renderRow={(comment) => <CommentListItem comment={comment}/>}
                />
            </ScrollView>
        )
    }
}

export class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'andunai',
            password: '11235813'
        };
    }
    render() {
        return (
            <View style={styles.container} padding={16}>
                <TextInput padding={16} placeholder="Login" value={this.state.username} onChangeText={(value) => this.setState({username: value})} />
                <TextInput padding={16} placeholder="Password" value={this.state.password} onChangeText={(value) => this.setState({password: value})} />
                <Button paddingTop={16} style={styles.button} onPress={this.login.bind(this)}>LOG IN</Button>
            </View>
        )
    }
    login() {
        api.login(this.state.username, this.state.password, (data) => {
            console.log('Login successful!');
            context._navigator.replace({id: 'feed', title: 'reRant'});
        }, (error) => {
            console.log('Failed to log in:', error);
        })
    }
}
