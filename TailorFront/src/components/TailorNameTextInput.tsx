import React, { forwardRef, ForwardRefRenderFunction } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import styled from 'styled-components/native'

type TailorNameTextInputProps = TextInputProps & {
  weight?: 'regular' | 'bold'
}

const TailorNameTextInput: ForwardRefRenderFunction<
  TextInput,
  TailorNameTextInputProps
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

const ForwardedTailorNameTextInput = forwardRef(TailorNameTextInput)

const StyledTailorNameTextInput = styled(ForwardedTailorNameTextInput)``

export default StyledTailorNameTextInput
