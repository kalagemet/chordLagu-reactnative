import React from 'react';

export default class AutoScroll extends React.Component{
    state={
        isActive : false,
        sliderValue : 0,
        initialValue : 0
    }

    onSliderValueChange(value) {
        this.setState({sliderValue: value })
        setSliderValue(value)
        if (isActive) {
          onValueChange(sliderValue)
        }
    }

    play() {
        this.setState({isActive:true})
        setIsActive(true)
        onValueChange(sliderValue)
    }
}