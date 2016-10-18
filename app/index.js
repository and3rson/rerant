import React, { Component } from 'react';

import {
    Navigator,
    Text
} from 'react-native';

import Drawer from 'react-native-drawer';

import { context } from './context';

import {
    Menu,
    ActionBar
} from './components';

import {
    FeedPage,
    RantPage,
    LoginPage
} from './pages';

import {
    CustomSceneConfig
} from './global';

import {
    styles
} from './styles';


class ReRantApp extends Component {
    constructor(props) {
        super(props);
        this.actionBar = null;
    }
    render() {
        return (
            <Drawer
                style={styles.container}
                openDrawerOffset={0.4}
                ref={(ref) => context._drawer = ref}
                onOpen={this.onDrawerOpen}
                onClose={this.onDrawerClose}
                acceptTap={true}
                acceptPan={true}
                tweenDuration={150}
                tweenEasing="easeOutSine"
                content={<Menu onSelectItem={this.toggleDrawer.bind(this)}/>}
            >
                <ActionBar ref={this.onActionBarReady.bind(this)} backgroundColor="#444444" title="reRant" leftText="Menu" onMenu={this.toggleDrawer.bind(this)} />
                <Navigator
                    configureScene={this.configureScene.bind(this)}
                    ref={(ref) => context._navigator = ref}
                    renderScene={this.navigatorRenderScene.bind(this)}
                    onDidFocus={this.onDidFocus.bind(this)}
                    initialRoute={{id: 'feed', title: 'reRant'}}
                />
            </Drawer>
        );
    }
    toggleDrawer() {
        if (context._drawerIsOpen) {
            context._drawer.close();
        } else {
            context._drawer.open();
        }
    }
    onDrawerOpen() {
        context._drawerIsOpen = true;
    }
    onDrawerClose() {
        context._drawerIsOpen = false;
    }
    configureScene(route, routeStack){
        if(route.type === 'Modal') {
            return Navigator.SceneConfigs.FloatFromBottom
        }

        return CustomSceneConfig;
    }
    navigatorRenderScene(route, navigator) {
        switch (route.id) {
            case 'feed':
                return (<FeedPage/>)
            case 'rant':
                return (<RantPage rantId={route.rantId}/>)
            case 'login':
                return (<LoginPage/>)
        }
    }
    onActionBarReady(actionBar) {
        context._actionBar = actionBar;
    }
    onDidFocus(route) {
        if (!context._navigator) {
            return;
        }

        if (context._navigator.getCurrentRoutes().length === 1) {
            context._actionBar && context._actionBar.setViewInfo(false, route.title);
        } else {
            context._actionBar && context._actionBar.setViewInfo(true, route.title);
        }
    }
}

exports.ReRantApp = ReRantApp;
