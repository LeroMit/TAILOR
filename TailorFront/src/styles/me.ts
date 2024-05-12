import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Feather } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { LinearGradient } from 'expo-linear-gradient'
import CustomText from '../components/CustomText'
import { Platform } from 'react-native'

const statusBarHeight = getStatusBarHeight(Platform.OS === 'ios')

export const Container = styled.View`
  flex: 1;
  background: #0d1d25;
  padding-top: ${statusBarHeight + 10}px;
`

export const Header = styled.View`
  pointer-events: auto;
  width: 95%;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  align-self: center;
  justify-content: space-between;
`

export const Title = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 18px;
  color: #fff;
  flex: 1;
`

export const Content = styled.View`
  align-items: left;
`

export const Avatar = styled.Image`
  margin-top: -50px;
  align-self: center;
  width: 100px;
  height: 100px;
  margin-right: 20px;
  border-radius: 50px;
`

export const BackgroundImage = styled.Image`
  align-self: center;
  width: 100%;
  height: 150px;
  z-index: -2;
`

export const Username = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 18px;
  padding: 5px;
  color: #fff;
`

export const Stats = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
  align-items: center;
  z-index: 10;
`

export const StatsColumn = styled.View`
  align-items: center;
`

export const StatsNumber = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 18px;
  padding: 5px;
  color: #fff;
`

export const Separator = styled(CustomText)`
  color: #000;
  font-size: 20px;
  opacity: 0.1;
  padding: 0 10px;
  color: #fff;
`

export const StatsText = styled(CustomText)`
  font-size: 12px;
  color: white;
`

export const WhiteSquare = styled.View`
  background-color: white;
  width: 24px;
  height: 40px;
  border-radius: 5px;
  justify-content: center;
  margin-right: 10px;
  align-items: center;
`

export const ProfileColumn = styled.View`
  align-items: left;
  flex-direction: column;
  padding: 10px;
`

export const ProfileText = styled(CustomText)`
  padding-left: 5px;
  color: #fff;
`

export const ProfileEdit = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  border-width: 1.5px;
  padding: 10px 30px;
  border-color: #e6e6e6;
  border-radius: 2px;
  font-size: 12px;
`

export const EditBt = styled(Feather)`
  padding-left: 15px;
  color: #fff;
`

export const CtrlGridColumn = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

interface ImageThumbnailProps {
  color: string
}

export const ImageThumbnail = styled.View<ImageThumbnailProps>`
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
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  z-index: 1;
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

export const GradientMaskContainer = styled(LinearGradient)`
  position: absolute;
  pointer-events: none;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
