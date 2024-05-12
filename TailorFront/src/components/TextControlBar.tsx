import React from 'react'
import { TextStyle, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import CustomText from './CustomText'

const ButtonContainer = styled(TouchableOpacity)`
  justify-content: center;
  aspect-ratio: 1;
  margin: 0 15px;
  border-bottom-style: dotted;
`

type TextControlBarProps = TextStyle & {
  onPress: () => void
  isSelected: boolean
  text: string
}

const TextControlBar: React.FC<TextControlBarProps> = ({
  onPress,
  isSelected,
  text,
  ...rest
}) => {
  return (
    <ButtonContainer
      onPress={onPress}
      style={{
        opacity: isSelected ? 1 : 0.6,
        borderBottomWidth: isSelected ? 3 : 0,
        borderBottomColor: 'white',
        maxHeight: '100%',
      }}
    >
      <CustomText
        style={{
          color: 'white',
          alignSelf: 'center',
          fontSize: 20,
        }}
        {...rest}
      >
        {text}
      </CustomText>
    </ButtonContainer>
  )
}

export default TextControlBar
