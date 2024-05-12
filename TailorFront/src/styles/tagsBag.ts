import { hexy } from '@/utils'
import styled from 'styled-components/native'
import CustomText from '../components/CustomText'

const marginBetweenTags = 5
const tagPaddingHorizontal = 10
const tagPaddingVertical = 5

export const Tag = styled(CustomText)`
  font-size: 14px;
  color: #ffffff;
  border-radius: 10px;
`

export const TagBackground = styled.View`
  background-color: ${hexy};
  padding: ${tagPaddingVertical}px ${tagPaddingHorizontal}px;
  margin-right: ${marginBetweenTags}px;
  border-radius: 10px;
  margin: 2px;
`

export const TagRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`
