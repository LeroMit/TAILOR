import styled from 'styled-components/native'
import { CustomText } from '@/components'
import { LinearGradient } from 'expo-linear-gradient'

export const ProfilePic = styled.Image`
  margin-top: 0px;
  align-self: center;
  width: 30px;
  height: 30px;
  margin-right: 20px;
  border-radius: 50px;
`

export const Title = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 18px;
  margin-left: -10px;
  margin-right: 10px;
  color: #fff;
  flex: 1;
`

export const Header = styled.View`
  pointer-events: auto;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const Content = styled.View`
  padding: 3px;
  margin-bottom: 5px;
  height: 40px;
`

export const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #cccdd3;
  height: 400px;
  bottom: 0;
  justify-content: flex-end;
`

export const MessageView = styled.View`
  flex: 1;
  border-radius: 5px;
  align-items: center;
  padding: 10px 15px;
  margin-right: 15px;
  background: #38454b;
  flex-direction: row;
  justify-content: flex-end;
`

export const MessageContainer = styled.View`
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  margin: 0px;
`

export const Write = styled.View`
  flex: 1;
  border-radius: 15px;
  align-items: center;
  margin-right: 0;
  background: #38454b;
  flex-direction: row;
  justify-content: space-between;
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

export const MessageBox = styled(LinearGradient)`
  position: absolute;
  pointer-events: none;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
