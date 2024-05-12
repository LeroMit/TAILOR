import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const ButtonContainer = styled(TouchableOpacity)`
  width: 30px;
  aspect-ratio: 1;
  margin: 0 15px;
`

const ElementControlBar = ({ onPress, isSelected, ...rest }) => {
  return (
    <ButtonContainer
      onPress={onPress}
      style={{ opacity: isSelected ? 1 : 0.6 }}
    >
      <MaterialCommunityIcons {...rest} />
    </ButtonContainer>
  )
}

export default ElementControlBar
