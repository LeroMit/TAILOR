import { LinearGradient } from 'expo-linear-gradient'
import styled from 'styled-components/native'

export const HeaderBottomSheet = styled.View`
  align-self: center;
  align-items: center;
  margin-vertical: 10px;
  border-radius: 2px;
`
export const Line = styled.View`
  width: 175px;
  height: 2px;
  background-color: grey;
  align-self: center;
  margin-top: 10px;
  border-radius: 2px;
`

export const ModalView = styled.SafeAreaView`
  background-color: #0d1d25;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  align-items: center;
  align-content: center;
  shadow-color: #000;
  flex: 1;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`

export const GradientBackground = styled(LinearGradient)`
  width: 180px;
  top: 25px;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  z-index: 1;
`