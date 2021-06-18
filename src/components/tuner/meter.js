import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from '@react-navigation/native';

export default function Meter({cents}){
  const { colors } = useTheme();
  const cent = useRef(new Animated.Value(0)).current;
  const [pointerStyle, setPointerStyle] = useState([])

  React.useEffect(()=>{
    Animated.timing(cent, {
      toValue: cents,
      duration: 500,
      useNativeDriver: true,
    }).start();
  },[cents])

  React.useEffect(()=>{
    //console.log(this.props.cents)
    const c = cent.interpolate({
      inputRange: [-50, 50],
      outputRange: ["-45deg", "45deg"]
    });

    const pointerStyle = {
      transform: [{ rotate: c }]
    };

    setPointerStyle(pointerStyle)
  },[cents])

  return (
    <View style={style.meter}>
      <View style={[style.origin, {backgroundColor:colors.text}]} />
      <Animated.View
        style={[style.scale, style.strong, style.pointer, pointerStyle, {borderTopColor: colors.text}]}
      />
      <View style={[style.scale, style.scale_5, style.strong, {borderTopColor: colors.text}]} />
      <View style={[style.scale, style.scale_4, {borderTopColor: colors.text}]} />
      <View style={[style.scale, style.scale_3, {borderTopColor: colors.text}]} />
      <View style={[style.scale, style.scale_2, {borderTopColor: colors.text}]} />
      <View style={[style.scale, style.scale_1, {borderTopColor: "#70C972"}]} />
      <View style={[style.scale, style.strong, {borderTopColor: "#70C972"}]} />
      <View style={[style.scale, style.scale1, {borderTopColor: "#70C972"}]} />
      <View style={[style.scale, style.scale2, {borderTopColor: colors.text}]} />
      <View style={[style.scale, style.scale3, {borderTopColor: colors.text}]} />
      <View style={[style.scale, style.scale4, {borderTopColor: colors.text}]} />
      <View style={[style.scale, style.scale5, style.strong, {borderTopColor: colors.text}]} />
    </View>
  );
}

const style = StyleSheet.create({
  meter: {
    height: 200,
    marginBottom: 40
  },
  origin: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 10
  },
  pointer: {
    borderTopWidth: 195
  },
  scale: {
    position: "absolute",
    left: 0,
    right: 0,
    width: 1,
    height: 400,
    borderTopWidth: 10,
    marginLeft: 4.5,
  },
  strong: {
    width: 2,
    borderTopWidth: 20,
  },
  scale_1: {
    transform: [{ rotate: "-9deg" }]
  },
  scale_2: {
    transform: [{ rotate: "-18deg" }]
  },
  scale_3: {
    transform: [{ rotate: "-27deg" }]
  },
  scale_4: {
    transform: [{ rotate: "-36deg" }]
  },
  scale_5: {
    transform: [{ rotate: "-45deg" }]
  },
  scale1: {
    transform: [{ rotate: "9deg" }]
  },
  scale2: {
    transform: [{ rotate: "18deg" }]
  },
  scale3: {
    transform: [{ rotate: "27deg" }]
  },
  scale4: {
    transform: [{ rotate: "36deg" }]
  },
  scale5: {
    transform: [{ rotate: "45deg" }]
  }
});
