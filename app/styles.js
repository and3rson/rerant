import {
    StyleSheet
} from 'react-native';


exports.styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FF0000'
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
        backgroundColor: '#444444'
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
        paddingRight: 20,
        flex: 1,
        textAlign: 'left',
        color: '#FFF',
        fontWeight: '700',
    },
    rantListView: {
        flex: 1,
        borderWidth: 5,
        borderColor: '#FF0000'
    },
    rantListItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC'
    },
    menu: {
        backgroundColor: '#222222',
        flex: 1,
        // paddingTop: 60
    },
    menuHeader: {
        padding: 16,
        paddingLeft: 16,
        backgroundColor: '#444444',
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '100',
        // borderBottomWidth: 1,
        // borderColor: '#444444'
    },
    menuButton: {
        padding: 16,
        backgroundColor: '#222222',
        textAlign: 'left',
        color: '#FFFFFF'
    },
    button: {
        padding: 16,
        backgroundColor: '#44AA44',
        color: '#FFFFFF',
        fontWeight: '700'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '700',
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    rowVertical: {
        flex: 1,
        flexDirection: 'column'
    },
    col: {
        flex: 10
    },
    colCollapsed: {
        flex: 0
    },

    voteButton: {
        backgroundColor: '#DDDDDD',
        color: '#FFFFFF',
        fontSize: 16,
        padding: 10
    },
    voteButtonHitGood: {
        backgroundColor: '#00AA00',
        color: '#FFFFFF',
        fontSize: 16,
        padding: 10
    },
    voteButtonHitBad: {
        backgroundColor: '#AA0000',
        color: '#FFFFFF',
        fontSize: 16,
        padding: 10
    },
    voteScore: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    },

    text: {
        color: '#222',
        fontSize: 16
    },
    image: {
        width: null,
        height: 200,
        resizeMode: 'cover',
        flex: 1
    },

    commentListView: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#FF0000',
        paddingLeft: 32,
    },
    commentListItem: {
        borderBottomWidth: 1,
        borderColor: '#CCCCCC'
    }
});
