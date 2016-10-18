import React, { Component } from 'react';

import {
    View,
    Text,
    Image,
    ListView,
    RefreshControl,
    TouchableNativeFeedback
} from 'react-native';

import Button from 'react-native-button';

import { context } from './context';

import {
    styles
} from './styles';

import { api } from './api';


export class ActionBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showBack: false,
            title: 'reRant'
        };
        this.backImage = require('../img/back.png');
        this.menuImage = require('../img/menu.png');
    }
    render() {
        var img = this.state.showBack ? this.backImage : this.menuImage;
        return (
            <View style={styles.toolbar}>
                <Text style={styles.toolbarButton} onPress={() => (this.state.showBack ? context._navigator.pop() : this.props.onMenu())}>
                    <Image source={img} style={styles.toolbarIcon} />
                </Text>
                <Text style={styles.toolbarTitle} numberOfLines={1}>{this.state.title}</Text>
            </View>
        )
    }
    setViewInfo(showBack, title) {
        this.setState({
            showBack: showBack,
            title: title
        });
    }
}

export class Menu extends Component {
    render() {
        return (
            <View style={styles.menu}>
                <Text style={styles.menuHeader}>
                    Menu
                </Text>
                <Button
                    style={styles.menuButton}
                    onPress={() => this.goTo({id: 'feed', title: 'Feed'}, true)}
                >
                    FEED
                </Button>
                <Button
                    style={styles.menuButton}
                    onPress={() => this.goTo({id: 'login', title: 'Login'})}
                >
                    LOG IN
                </Button>
                <Button
                    style={styles.menuButton}
                    onPress={() => this.goTo({id: 'logout', title: 'Log out'})}
                >
                    LOG OUT
                </Button>
                <Button
                    style={styles.menuButton}
                    onPress={() => this.goTo({id: 'my_profile', title: 'My profile'})}
                >
                    PROFILE
                </Button>
                <Button
                    style={styles.menuButton}
                    onPress={() => this.goTo({id: 'about', title: 'About this app'})}
                >
                    ABOUT
                </Button>
            </View>
        )
    }
    goTo(data, replace) {
        if (replace) {
            context._navigator.replace(data);
        } else {
            context._navigator.push(data);
        }
        this.props.onSelectItem();
    }
}

export class RantListView extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state =  {
            dataSource: this.ds,
            refreshing: true
        };
        this.loadRants();
        // console.log(api);
        // setTimeout((() => {
        //     // this.state.dataSource.push('xxx');
        //     var items = this.state.dataSource.slice();
        //     this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});
        //     // this.state.dataSource[0] = 'asd';
        //     console.log('Update');
        // }).bind(this), 2000);
    }
    loadRants() {
        api.getRants((rants) => {
            // console.log('RANTS:', rants.length);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(rants),
                refreshing: false
            });
        });
    }
    onRefresh() {
        this.setState({refreshing: true, dataSource: this.ds});
        this.loadRants();
    }
    render() {
        return (
            <ListView
                style={styles.rantListView}
                scrollEnabled={true}
                dataSource={this.state.dataSource}
                renderRow={(rant) => <RantListItem rant={rant}/>}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />
                }
            />
        )
    }
}

export class RantListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rant: props.rant
        }
    }
    render() {
        if (this.state.rant.attached_image) {
            img = (<Image style={styles.image} source={{uri: this.state.rant.attached_image.url}}/>)
            console.log('IMG', this.state.rant.attached_image.url);
        } else {
            img = null;
        }
        return (
            <TouchableNativeFeedback onPress={() => { context._navigator.push({id: 'rant', title: this.state.rant.text, rantId: this.state.rant.id}) }}>
                <View style={styles.rantListItem}>
                    <View style={styles.row}>
                        <View style={styles.colCollapsed}>
                            <Voting object={this.props.rant} objectType="rant"/>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.text} numberOfLines={5}>
                                {this.state.rant.text}
                            </Text>
                            {img}
                            <Text>Comments: {this.state.rant.num_comments}</Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

export class Voting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: props.object
        }
    }
    render() {
        return (
            <View style={{marginRight: 10}}>
                <Button style={(this.state.object.vote_state == 1) ? styles.voteButtonHitGood : styles.voteButton} onPress={this.vote.bind(this, this.state.object.vote_state ? 0 : 1)}>++</Button>
                <Text style={styles.voteScore}>{this.state.object.score}</Text>
                <Button style={(this.state.object.vote_state == -1) ? styles.voteButtonHitBad : styles.voteButton} onPress={this.vote.bind(this, this.state.object.vote_state ? 0 : -1)}>--</Button>
            </View>
        )
    }
    vote(value) {
        api.assert(() => {
            if (this.props.objectType == 'rant') {
                api.voteRant(this.props.object.id, value, (data) => {
                    this.setState({object: data.rant});
                    console.log('Vote accepted!');
                });
            }
        });
    }
}

export class UserBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user
        }
    }
    render() {
        if (!this.state.user) {
            return null;
        }
        var avatar = this.state.user.avatar.i ? {uri: 'https://avatars.devrant.io/' + this.state.user.avatar.i} : require('../img/icon.png');
        return (
            <View style={styles.colCollapsed}>
                <View style={styles.row}>
                    <View style={styles.colCollapsed}>
                        <Image style={{width: 48, height: 48, margin: 10}} source={avatar}/>
                    </View>
                    <View style={styles.col}>
                        <Text style={{paddingTop: 10}}>
                            {this.state.user.username}
                        </Text>
                        <Text style={{paddingTop: 10}}>
                            {this.state.user.score}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

export class CommentListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: props.comment
        }
    }
    render() {
        return (
            <View style={styles.commentListItem}>
                <UserBox user={{
                    id: this.state.comment.user_id,
                    username: this.state.comment.user_username,
                    avatar: this.state.comment.user_avatar,
                    score: this.state.comment.user_score,
                }} />
                <Text style={{padding: 10, paddingLeft: 68}}>
                    {this.state.comment.body}
                </Text>
            </View>
        )
    }
}
