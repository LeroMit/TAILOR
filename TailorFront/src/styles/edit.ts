import styled from 'styled-components/native'
import { LinearGradient } from 'expo-linear-gradient'

import CustomText from '../components/CustomText'

export const Header = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const Title = styled(CustomText).attrs({
  weight: 'bold',
})`
  font-size: 18px;
  color: #000;
  flex: 1;
`

export const Content = styled.View`
  align-items: center;
  background: #0d1d25;
  width: 100%;
  height: 100%;
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
  marginbottom: 5px;
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

export const GradientBackground = styled(LinearGradient)`
  width: 180px;
  margintop: 10px;
  padding: 8px;
  align-items: center;
  justify-content: center;
  height: 45px;
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
