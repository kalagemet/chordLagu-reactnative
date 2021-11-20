import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '@react-navigation/native';

function Loader({loading}){
  const { colors } = useTheme();
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}>
        <View style={styles.modalBackground}>
          <View style={{...styles.activityIndicatorWrapper, backgroundColor: colors.card}}>
            <ActivityIndicator
              color={colors.text}
              size='large'
              animating={true} />
          </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#00000040',
    },
    activityIndicatorWrapper: {
      height: '18%',
      width: '30%',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
  }
});

export default Loader;