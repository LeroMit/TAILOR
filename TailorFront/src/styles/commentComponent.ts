import styled from 'styled-components/native'
import CustomText from '../components/CustomText'

export const Container = styled.View`
  flex-direction: column;
`
export const ContainerOriginalComment = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
`
export const Avatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  margin-left: 10px;
  margin-right: 10px;
`
export const CommentContainer = styled.View`
  flex: 1;
  flex-direction: column;
`
export const Username = styled(CustomText)`
  font-size: 13px;
  color: grey;
  margin-bottom: 3px;
`
export const CommentText = styled(CustomText)`
  font-size: 14px;
  color: white;
  margin-bottom: 5px;
  padding-right: 4px;
`
export const ViewReplies = styled(CustomText)`
  font-size: 12px;
  color: grey;
  margin-bottom: 5px;
`
export const LogoChevron = styled.View`
  margin-bottom: -2px;
`
export const InteractionContainer = styled.View`
  flex-direction: row;
  margin-right: 15px;
  margin-top: 5px;
  width: 45px;
  height: 35px;
  justify-content: flex-end;
`
export const IconContainer = styled.View`
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: space-between;
`
export const IconText = styled(CustomText)`
  font-size: 11px;
  color: grey;
`
export const ReplyContainer = styled.View`
  margin-left: 30px;
`
