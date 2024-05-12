import { Animated } from 'react-native'

/**
 * Fade in and out the icon
 * @param iconOpacity Animated.Value
 */
export const fadeInIcon = (iconOpacity: Animated.Value) => {
  Animated.timing(iconOpacity, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start()

  setTimeout(() => {
    Animated.timing(iconOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, 1000) // hide icon after one second
}
