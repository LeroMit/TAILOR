import styled from 'styled-components/native'
import { LinearGradient } from 'expo-linear-gradient'

import CustomText from '../components/CustomText'
import { ScrollView, TextInput } from 'react-native'

export const Header = styled.View`
  pointer-events: auto;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const Title = styled(CustomText).attrs({
  weight: 'bold',
})`
  text-align: center;
  font-size: 18px;
  color: #000;
  flex: 1;
`

export const Content = styled.View`
  align-items: center;
  justify-content: center;
  background: #0d1d25;
  width: 100%;
  flex: 1;
`

export const TitleTailor = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 20px;
  color: #fff;
  flex: 1;
  text-align: center;
`

export const SubTitleTailor = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 20px;
  color: #fff;
  text-align: left;
  margin-bottom: 5px;
`

export const Tag = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 12px;
  color: #fff;
  text-align: left;
  padding: 5px;
`

export const ContainerEdit = styled.View`
  background: #0d1d2580;
  padding: 8px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
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
  z-index: 5;
  /* align-self: center;
  align-items: center;
  justify-content: center; */
  /* align-self: center;
  align-items: center;
  justify-content: center; */
  /* top: 25px; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
export const Container = styled.SafeAreaView`
  flex: 1;
  background: white;
`

export const SearchBar = styled.View`
  margin-horizontal: 20px;
  margin-vertical: 10px;
  border-radius: 5px;
  align-items: center;
  padding: 10px 15px;
  background: #38454b;
  flex-direction: row;
`

export const TitleCreator = styled.View`
  align-items: center;
  margin-bottom: 10px;
  flex-direction: row;
`

export const NameTailor = styled(CustomText).attrs({
  weight: 'bold',
})`
  margin-right: 30px;
  font-size: 18px;
  color: #fff;
`

export const Creator = styled(CustomText).attrs({
  weight: 'bold',
  numberOfLines: 1,
})`
  font-size: 15px;
  color: #fff;
`

export const ProfilePicture = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: white;
`

export const ContainerTag = styled(ScrollView).attrs({
  showsHorizontalScrollIndicator: false,
  horizontal: true,
  contentContainerStyle: {
    alignItems: 'center',
    paddingRight: 10,
    flexGrow: 1,
  },
})`
  padding: 0px 5px;
  margin-right: 10px;
  background: #0d1d2580;
  border-radius: 10px;
`

export const Input = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  color: #cccdd3;
`

export const Error = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 10px;
  color: red;
  text-align: left;
  padding: 5px;
  margin-start: 10px;
`

export const SliderContainer = styled.View`
  padding: 8px;
  border-radius: 10px;
`

export const SliderText = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 12px;
  color: white;
  text-align: center;
  margin-start: -10px;
`

export const TextInputContainerWrapper = styled.View`
  border-top-width: 1px;
  padding-vertical: 10px;
  border-color: rgba(255, 255, 255, 0.2);
`

export const SliderContainerWrapper = styled.View`
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

export const SendButtonBackground = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  padding: 3px;
  aspect-ratio: 1;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
`
