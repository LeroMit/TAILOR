import CustomText from '../components/CustomText'
import { Platform, ScrollView, TextInput } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components/native'

export const Container = styled.SafeAreaView`
  padding-top: ${getStatusBarHeight(Platform.OS === 'ios')}px;
  flex: 1;
  background: white;
`

export const Header = styled.View`
  pointer-events: auto;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const Title = styled(CustomText).attrs({
  weight: 'bold',
})`
  text-align: center;
  font-size: 18px;
  color: black;
  flex: 1;
`

export const Content = styled.View`
  justify-content: flex-start;
  background: #0d1d25;
  width: 100%;
  flex: 1;
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
