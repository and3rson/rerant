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
        }
    }
    render() {
        return (
            <View style={{marginRight: 10}}>
                <Button style={styles.voteButton}>++</Button>
                <Text style={styles.voteScore}>{this.props.object.score}</Text>
                <Button style={styles.voteButton}>--</Button>
            </View>
        )
    }
}
