import styled from 'styled-components/native'
import { CustomText } from '@/components'
import { LinearGradient } from 'expo-linear-gradient'
import { Platform, TextInput } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export const Container = styled.SafeAreaView`
  flex: 1;
  padding-top: ${getStatusBarHeight(Platform.OS === 'ios')}px;
  background: #0d1d25;
`

export const Title = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 18px;
  color: #fff;
  flex: 1;
`
export const CtrlGridColumn = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

export const ImageThumbnail = styled.View<{ color: string }>`
  flex-direction: column;
  margin: 1px;
  width: 33%;
  background: ${(props) => props.color};
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
`

export const ControlBar = styled.View`
  flex-direction: row;
  width: 100%;
  height: 50px;
  justify-content: space-evenly;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.5);
  z-index: 1;
`

export const GradientMaskContainer = styled(LinearGradient)`
  position: absolute;
  pointer-events: none;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const Header = styled.View`
  margin: 10px;
  margin-right: 15px;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
`

export const Search = styled.View`
  flex: 1;
  border-radius: 5px;
  align-items: center;
  padding: 10px 15px;
  margin-right: 15px;
  background: #38454b;
  flex-direction: row;
`

export const Input = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  color: #cccdd3;
`
