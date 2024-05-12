import styled from 'styled-components/native'
import { LinearGradient } from 'expo-linear-gradient'

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  flex: 1;
  flex-direction: 'row';
  width: 20px;
  height: 20px;
`

export const Avatar = styled.Image`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  left: 30%;
  top: 40%;
  /* align-items: center;
  justify-content: center; */
  /* margin-top: 5px; */
`

export const GradientBorder = styled(LinearGradient)`
  width: 22px;
  margin-bottom: 100px;
  height: 22px;
  border-radius: 22px;
  align-items: center;
  justify-items: center;
  z-index: -1;
`

export const CircleBehind = styled.View`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 20px;
  border-width: 12px;
`
