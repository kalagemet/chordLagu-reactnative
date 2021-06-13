import React, { Component } from 'react';
import ChordLibrary from './ChordLibrary';
import Tuner from './Tuner';

export default function Tools({navigation}) {
  return (
    <Tuner navigation={navigation}/>
  );
}