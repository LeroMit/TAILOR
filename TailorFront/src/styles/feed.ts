import styled from 'styled-components/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import CustomText from '../components/CustomText'
import { Dimensions, TouchableOpacity } from 'react-native'

interface ActionsProps {
  isOpen: boolean
}

export const Actions = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})<ActionsProps>`
  flex-direction: column;
  border-radius: ${({ isOpen }) => (isOpen ? '15px' : '25px')};
  height: ${({ isOpen }) => (isOpen ? 'auto' : '45px')};
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: absolute;
  bottom: ${({ isOpen }) =>
    isOpen
      ? Dimensions.get('window').height * 0.095 + 20 + 'px'
      : Dimensions.get('window').height * 0.095 + 30 + 'px'};
  right: 10px;
  z-index: 999;
`

export const Details = styled.View`
  position: absolute;
  padding: 10px 10px;
  width: 65%;
  flex-direction: column;
  bottom: ${Dimensions.get('window').height * 0.095}px;
  z-index: 999;
`

export const UserBox = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 5px 0;
`

export const UserIcon = styled(MaterialCommunityIcons)`
  margin-right: 10px;
`

export const UserName = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 15px;
  color: #fff;
`

export const Tags = styled.View`
  line-height: 12px;
  padding: 2px 0;
`

export const MusicBox = styled.View`
  flex-direction: row;
  align-items: center;
`

export const MusicText = styled(CustomText)`
  font-size: 12px;
  padding: 5px 5px;
  color: #fff;
`

export const BoxAction = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-direction: column;
  padding: 5px 0;
  align-items: center;
`

export const TextAction = styled(CustomText)`
  color: #fff;
  padding: 5px 0;
`
export const TextInputContainerWrapper = styled.View`
  border-top-width: 1px;
  padding-vertical: 10px;
  border-color: rgba(255, 255, 255, 0.2);
`

export const TextInputContainer = styled.View`
  width: 95%;
  flex-direction: row;
  height: 35px;
  border-radius: 12px;
  background-color: #060e12;
  align-items: center;
  align-content: center;
  align-self: center;
`

export const IconContainer = styled.View`
  flex-direction: row;
  align-content: center;
  margin-right: 10px;
`

export const SendButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  background-color: #007bff;
  padding: 4px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`

export const SendButtonBackground = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  padding: 3px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`
