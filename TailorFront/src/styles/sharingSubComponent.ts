import styled from 'styled-components/native'
import CustomText from '../components/CustomText'

export const Container = styled.View`
  border-radius: 20px;
  margin-horizontal: 15px;
  background-color: black;
  margin-bottom: 15px;
  padding: 10px;
`
export const IconContainer = styled.View`
  margin-horizontal: 10px;
  align-items: center;
  align-self: left;
`
export const IconStyle = styled.Image`
  width: 55px;
  height: 55px;
  border-radius: 28px;
  background-color: white;
`
export const TitleIcon = styled(CustomText)`
  margin-top: 5px;
  font-size: 15px;
  color: white;
  flex: 1;
`
