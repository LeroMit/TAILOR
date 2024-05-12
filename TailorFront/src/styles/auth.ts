import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components/native'
import { LinearGradient } from 'expo-linear-gradient'

export const Container = styled.View.attrs({
  paddingTop: getStatusBarHeight(),
})`
  background: #fff;
  width: 80%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
`

export const Header = styled.View`
  flex-direction: row;
  background-color: white;
`

export const Title = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #ff0000;
  background-color: transparent;
`

export const Content = styled.View`
  flex-direction: column;
  gap: 20px;
  flex: 1;
  padding-horizontal: 10%;
  align-items: center;
  justify-content: center;
`

export const Logo = styled.Image`
  align-self: center;
  width: 100px;
  height: 100px;
  border-radius: 20px;
`

export const GradientBackground = styled(LinearGradient)`
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  width: 80%;
  z-index: 1;
  padding: 10px;
`

export const ButtonContainer = styled(LinearGradient)`
  width: 100%;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;
`
