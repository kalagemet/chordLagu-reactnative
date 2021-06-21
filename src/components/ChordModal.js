import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import {Text} from 'react-native';
import ViewChord from './ViewChord';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';

export default function ChordModal({show, name, selectedChord, closeModal}) {
  const { colors } = useTheme();
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={show}>
        <View style={styles.modalBackground}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
          <View style={{...styles.activityIndicatorWrapper, backgroundColor: colors.background}}>
            <View style={{flex:1, alignItems:'center'}} >
              <Text style={{marginTop:7, color:colors.primary}}>{name}</Text>
              <View style={{marginRight:10}}>
                <ViewChord
                    chord={selectedChord}
                    width={100}
                    height={120}
                    color={colors.primary}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity style={{...styles.close, backgroundColor:colors.background}} onPress={closeModal}>
                <Ionicons name="close-outline" size={30} color={colors.primary} />
            </TouchableOpacity>
        </View>
    </Modal>
  )
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
      height: 200,
      width: 180,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    close : {
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