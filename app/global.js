import React, { Component } from 'react';

import {
    Navigator,
    BackAndroid
} from 'react-native';

import { context } from './context';


var BaseConfig = Navigator.SceneConfigs.FloatFromRight;

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var BaseConfig = Navigator.SceneConfigs.FloatFromRight;

var CustomLeftToRightGesture = Object.assign({}, BaseConfig.gestures.pop, {
    // Make it snap back really quickly after canceling pop
    snapVelocity: 8,
    // Make it so we can drag anywhere on the screen
    edgeHitWidth: SCREEN_WIDTH,
});

exports.CustomSceneConfig = Object.assign({}, BaseConfig, {
    // A very tighly wound spring will make this transition fast
    springTension: 250,
    springFriction: 1,
    // Use our custom gesture defined above
    gestures: {
        pop: CustomLeftToRightGesture,
    }
});

BackAndroid.addEventListener('hardwareBackPress', () => {
    if (context._drawerIsOpen) {
        context._drawer.close();
        return true;
    } else {
        if (context._navigator.getCurrentRoutes().length === 1) {
            return false;
        }
        context._navigator.pop();
        return true;
    }
});
