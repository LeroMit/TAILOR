import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import CustomText from './CustomText'
import { GradientTextProps } from '@/types'

const GradientText = ({
  colors,
  size,
  children,
  style,
  ...rest
}: GradientTextProps) => {
  return (
    <MaskedView
      maskElement={
        <CustomText {...rest} weight="bold" style={{ fontSize: size }}>
          {children}
        </CustomText>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <CustomText
          {...rest}
          weight="bold"
          style={[
            style,
            {
              opacity: 0,
              fontSize: size,
            },
          ]}
        >
          {children}
        </CustomText>
      </LinearGradient>
    </MaskedView>
  )
}

export default GradientText
