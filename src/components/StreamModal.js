import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Text,
  ActivityIndicator
} from 'react-native';
import {Icon} from 'native-base';
import { WebView } from 'react-native-webview';
  
  
export default class StreamModal extends React.Component {
  constructor(props){
    super(props);
    this.state = { webviewLoaded: false };
  }

  _onLoadEnd() {
      this.setState({ webviewLoaded: true });
  }

  render() {
    const uri = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'+this.props.id+'&show_artwork=false&color=000&show_comments=false&hide_related=true';
    return (
      <View style={styles.activityIndicatorWrapper}>
        {(this.state.webviewLoaded) ? null : 
          <View style={{width:'90%', alignItems:'center'}}>
            <ActivityIndicator color='#000' animating={true} size='large' />
          </View>}
        <WebView 
              ref={(ref) => { this.webview = ref; }}
              style={{ width: '100%', height:'100%', backgroundColor: '#f5f5f5'}}
              source={{uri: uri}}
              onNavigationStateChange={(event) => {
                if (event.url !== uri) {
                  this.webview.stopLoading();
                  Linking.openURL(event.url);
                }
              }}
              userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
              startInLoadingState={false}
              onLoadEnd={this._onLoadEnd.bind(this)}
        />
        <TouchableOpacity style={styles.close} onPress={this.props.closeModalStream}>
            <Icon name="close"/>
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
    activityIndicatorWrapper: {
      flexDirection:'row',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    },
    close : {
        height: '100%',
        width: '10%',
        justifyContent:'center',
        alignItems:'center',
    }
});