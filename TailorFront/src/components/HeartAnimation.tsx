import React from 'react'
import { Animated } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

interface HeartAnimationProps {
  tapX: number
  tapY: number
  heartIconOpacity: Animated.Value
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({
  tapX,
  tapY,
  heartIconOpacity,
}) => {
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        top: tapY - 35,
        left: tapX - 35,
        opacity: heartIconOpacity,
        transform: [
          {
            scale: heartIconOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        ],
      }}
    >
      <AntDesign name="heart" size={70} color="#FF0000" />
    </Animated.View>
  )
}

export default HeartAnimation
