import styled from 'styled-components/native'
import { LinearGradient } from 'expo-linear-gradient'
import CustomText from '../components/CustomText'

interface Props {
  active: boolean
}

/* container des videos to be displayed */
export const Container = styled.View`
  flex: 1;
  background: #000;
`

export const Separator = styled(CustomText)`
  color: #fff;
  font-size: 15px;
  opacity: 0.2;
`

/* header pour le titre */
export const Header = styled.View`
  height: 15%;
  flex-direction: row;
  position: absolute;
  align-self: center;
  z-index: 10;
  align-items: center;
  margin-top: 8%;
`
export const Text = styled(CustomText)<Props>`
  color: #fff;
  font-size: ${(props: Props) => (props.active ? '20px' : '18px')};
  padding: 5px;
  font-weight: bold;
  opacity: ${(props: Props) => (props.active ? '1' : '0.5')};
`

export const Tab = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})``

export const Feed = styled.View`
  flex: 1;
  z-index: -1;
  position: absolute;
`

export const GradientBackground = styled(LinearGradient)`
  border-radius: 10px;
  padding: 5px 60px;
`

export const GradientText = styled(CustomText)`
  color: #fff;
  font-size: 20px;
`
