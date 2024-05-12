import React from 'react'
import { Platform, View } from 'react-native'
import Svg, { LinearGradient, Stop, Rect } from 'react-native-svg'
import MaskedView from '@react-native-masked-view/masked-view'
import CustomText from './CustomText'
import { CustomTabBarIconProps } from '@/types'

const CustomTabBarIcon: React.FC<CustomTabBarIconProps> = ({
  Icon,
  color,
  isFocused,
  routeName,
}) => {
  return (
    <View
      style={{
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
      }}
    >
      <MaskedView
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        maskElement={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon />
            <CustomText
              weight="bold"
              style={{
                fontSize: 9,
                color: 'black',
              }}
            >
              {routeName}
            </CustomText>
          </View>
        }
      >
        <Svg width="50" height="50" viewBox="0 0 200 200" fill="none">
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="red" />
            <Stop offset="1" stopColor="yellow" />
          </LinearGradient>
          <Rect
            x="0"
            y="0"
            width="200"
            height="200"
            fill={isFocused ? 'url(#grad)' : color}
            stroke="black"
            strokeWidth="2"
          />
        </Svg>
      </MaskedView>
    </View>
  )
}

export default CustomTabBarIcon
