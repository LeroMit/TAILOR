import React, { forwardRef, ForwardRefRenderFunction } from 'react'
import { Text, TextProps } from 'react-native'
import styled from 'styled-components/native'

type CustomTextProps = TextProps & {
  weight?: 'regular' | 'bold'
}

const CustomText: ForwardRefRenderFunction<Text, CustomTextProps> = (
  { weight = 'regular', style, children, ...otherProps },
  ref
) => {
  const fontFamily = weight === 'bold' ? 'Nunito_700Bold' : 'Nunito_400Regular'

  const mergedStyle = [{ fontFamily }, style]

  return (
    <Text ref={ref} style={mergedStyle} {...otherProps}>
      {children}
    </Text>
  )
}

const ForwardedCustomText = forwardRef(CustomText)

const StyledCustomText = styled(ForwardedCustomText)``

export default StyledCustomText
