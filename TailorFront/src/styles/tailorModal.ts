import styled from 'styled-components/native'
import CustomText from '../components/CustomText'

export const Line = styled.View`
  width: 175px;
  height: 2px;
  background-color: white;
  align-self: center;
  margin-top: 10px;
  border-radius: 2px;
`
export const ProfilePicture = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: white;
`

export const Creator = styled(CustomText).attrs({
  style: { maxWidth: '80%' },
  numberOfLines: 1,
})`
  font-size: 16px;
  color: white;
`
