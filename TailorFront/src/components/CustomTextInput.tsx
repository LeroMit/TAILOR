import React, { forwardRef, ForwardRefRenderFunction } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import styled from 'styled-components/native'

type CustomTextInputProps = TextInputProps & {
  weight?: 'regular' | 'bold'
}

const CustomTextInput: ForwardRefRenderFunction<
  TextInput,
  CustomTextInputProps
> = ({ weight = 'regular', style, children, ...otherProps }, ref) => {
  const fontFamily = weight === 'bold' ? 'Nunito_700Bold' : 'Nunito_400Regular'

  const mergedStyle = [{ fontFamily }, style]

  return (
    <TextInput
      ref={ref as React.RefObject<TextInput>}
      style={mergedStyle}
      {...otherProps}
    >
      {children}
    </TextInput>
  )
}

const ForwardedCustomTextInput = forwardRef(CustomTextInput)

const StyledCustomTextInput = styled(ForwardedCustomTextInput)``

export default StyledCustomTextInput
