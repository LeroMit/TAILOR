import React from 'react'
import { Animated } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface MuteAnimationProps {
  isMuted: boolean
  muteIconOpacity: Animated.Value
}

const MuteAnimation: React.FC<MuteAnimationProps> = ({
  isMuted,
  muteIconOpacity,
}) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: '25%',
        left: '50%',
        marginLeft: -25,
        zIndex: 999,
        marginTop: -25,
        width: 60,
        height: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 30,
        opacity: muteIconOpacity,
        transform: [
          {
            scale: muteIconOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        ],
      }}
    >
      <MaterialCommunityIcons
        name={isMuted ? 'volume-off' : 'volume-high'}
        size={35}
        color="#fff"
      />
    </Animated.View>
  )
}

export default MuteAnimation
