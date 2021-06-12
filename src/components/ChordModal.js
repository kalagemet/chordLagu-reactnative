import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import {Icon, Text} from 'native-base';
import ViewChord from './ViewChord';

export default class ChordModal extends React.Component {
  
  componentDidMount(){

  }

  listChord() {
    
  }

  render() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.show}>
          <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={this.props.closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
            <View style={styles.activityIndicatorWrapper}>
              {/* <Swiper style={styles.wrapper}>
                {
                  this.props.selectedChord &&
                  this.props.selectedChord.map((data, index) => {
                    return (
                      <View style={{flex:1, alignItems:'center'}} key={index} >
                        <Text style={{marginTop:7}}>{this.props.name}</Text>
                        <View style={{marginRight:10}}>
                          <ViewChord 
                              chord={data.positions}
                              width={100}
                              height={120}
                          />
                        </View>
                      </View>
                    )
                  })
                }
              </Swiper> */}
              <View style={{flex:1, alignItems:'center'}} >
                <Text style={{marginTop:7}}>{this.props.name}</Text>
                <View style={{marginRight:10}}>
                  <ViewChord 
                      chord={this.props.selectedChord}
                      width={100}
                      height={120}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.close} onPress={this.props.closeModal}>
                  <Icon name="close"/>
              </TouchableOpacity>
          </View>
      </Modal>
    )
  }

}

const styles = StyleSheet.create({
  modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
      backgroundColor: '#FFFFFF',
      height: 200,
      width: 180,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    close : {
        backgroundColor: '#FFFFFF',
        height: 40,
        width: 180,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop : 10
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.4)'
    },
});