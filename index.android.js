/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    TouchableHighlight,
    TouchableNativeFeedback,
    ListView,
    Navigator,
    BackAndroid,
    Image
} from 'react-native';

import { api } from './api';
import Drawer from 'react-native-drawer';
// import ActionBar from 'react-native-action-bar';

var _navigator;
var _drawerIsOpen = false;
var _drawer;

BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_drawerIsOpen) {
        _drawer.close();
        return true;
    } else {
        if (_navigator.getCurrentRoutes().length === 1) {
            return false;
        }
        _navigator.pop();
        return true;
    }
});


export default class rerant extends Component {
    render() {
        return (
            <Drawer
                style={styles.container}
                openDrawerOffset={0.4}
                ref={(ref) => _drawer = ref}
                onOpen={this.onDrawerOpen}
                onClose={this.onDrawerClose}
                acceptTap={true}
                acceptPan={true}
                tweenDuration={150}
                tweenEasing="easeOutSine"
            >
                <ActionBar backgroundColor="#444444" title="reRant" leftText="Menu" onMenu={this.toggleDrawer.bind(this)} />
                <Navigator
                    initialRoute={{id: 'feed'}}
                    renderScene={this.navigatorRenderScene}
                />
            </Drawer>
        );
    }
    toggleDrawer() {
        if (_drawerIsOpen) {
            _drawer.close();
        } else {
            _drawer.open();
        }
    }
    onDrawerOpen() {
        _drawerIsOpen = true;
    }
    onDrawerClose() {
        _drawerIsOpen = false;
    }
    navigatorRenderScene(route, navigator) {
        _navigator = navigator;
        switch (route.id) {
            case 'feed':
                return (<FeedPage/>)
            case 'rant':
                return (<RantPage/>)
        }
    }
}

class FeedPage extends Component {
    static get defaultProps() {
        return {
            title: 'Feed'
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <RantListView/>
            </View>
        );
    }
}

class RantPage extends Component {
    static get defaultProps() {
        return {
            title: 'View rant'
        }
    }
    render(route, navigator) {
        return (
            <Text style={styles.container}>
                View rant
            </Text>
        )
    }
}


/*
                <View style={styles.container}>
                    <Text style={styles.welcome}>
                        Welcome to React Native!
                    </Text>
                    <Text style={styles.instructions}>
                        To get started, edit index.android.js
                    </Text>
                    <Text style={styles.instructions}>
                        Double tap R on your keyboard to reload,{'\n'}
                        Shake or press menu button for dev menu
                    </Text>
                    <Stuff/>
                </View>
*/

class Stuff extends Component {
    render() {
        return (
            <Text>Foo Bar</Text>
        )
    }
}

class ActionBar extends Component {
    render() {
        return (
            <View style={styles.toolbar}>
                <Text style={styles.toolbarButton} onPress={this.props.onMenu}>
                    <Image source={require('./img/menu.png')} style={styles.toolbarIcon} />
                </Text>
                <Text style={styles.toolbarTitle}>reRant</Text>
                <Text style={styles.toolbarButton}></Text>
            </View>
        )
    }
}

class RantListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rant: props.rant
        }
    }
    render() {
        return (
            <TouchableNativeFeedback onPress={() => { _navigator.push({id: 'rant'}) }}>
                <View style={styles.rantListItem}>
                    <Text>{this.state.rant.text}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

class RantListView extends Component {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },

    toolbar: {
        flexDirection: 'row',
        backgroundColor: '#444'
    },
    // toolbarNavButton: {
    //     padding: 20,
    //     paddingLeft: 0,
    //     paddingRight: 0,
    //     width: 80,
    //     color: '#FFF',
    //     textAlign: 'center',
    //     // backgroundImage: require('./img/menu.png')
    // },
    toolbarButton: {
        padding: 20,
        paddingLeft: 0,
        paddingRight: 0,
        width: 80,
        color: '#FFF',
        textAlign: 'center'
    },
    toolbarIcon: {
        width: 20,
        height: 20,
        margin: 15,
        marginLeft: 0
    },
    toolbarTitle: {
        padding: 20,
        paddingLeft: 0,
        paddingRight: 0,
        flex: 1,
        textAlign: 'center',
        color: '#FFF',
        fontWeight: '700'
    },
    rantListView: {
        flex: 1,
        borderWidth: 5,
        borderColor: '#FF0000'
    },
    rantListItem: {
        padding: 20,
    }
});

AppRegistry.registerComponent('rerant', () => rerant);
