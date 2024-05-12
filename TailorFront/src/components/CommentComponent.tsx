import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import MentionHashtagText from './MentionHashtagText'

import {
  Container,
  ContainerOriginalComment,
  Avatar,
  CommentContainer,
  Username,
  CommentText,
  ViewReplies,
  LogoChevron,
  IconContainer,
  IconText,
  ReplyContainer,
  InteractionContainer,
} from '@/styles/commentComponent'

import { useLocale } from '@/context/LocaleContext'
import { CommentProps } from '@/types'

const CommentComponent: React.FC<CommentProps> = ({
  comment,
  onReply,
  isReply = false,
  allReplies = [],
}) => {
  const { i18n } = useLocale()

  const { id, username, avatar, posted_ago, text, likes, replies } = comment
  const [isLiked, setIsLiked] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const handleLikePress = () => {
    setIsLiked((prev) => !prev)
  }

  /* REPLIES */
  const toggleReplies = () => {
    setShowReplies((prev) => !prev)
  }

  const calculateTotalReplies = (comment: Comment): number => {
    let totalReplies = comment.replies.length

    // Recursively count replies of each reply
    comment.replies.forEach((reply) => {
      totalReplies += calculateTotalReplies(reply)
    })

    return totalReplies
  }

  const nbReplies = calculateTotalReplies(comment)

  const renderReplies = (replies: Comment[]) => {
    return (
      <ReplyContainer>
        {replies.map((reply) => (
          <View key={reply.id}>
            <CommentComponent
              comment={reply}
              onReply={onReply}
              isReply={true}
            />
          </View>
        ))}
      </ReplyContainer>
    )
  }

  return (
    <Container>
      <TouchableOpacity activeOpacity={1}>
        <ContainerOriginalComment>
          {/* User avatar */}
          <TouchableOpacity activeOpacity={0.7}>
            <Avatar source={require('@/assets/images/avatar.png')} />
          </TouchableOpacity>

          <CommentContainer>
            {/* Username and posted_ago */}
            <Username>
              {username}
              {'   '} {posted_ago}
            </Username>

            {/* Comment text */}
            <CommentText>
              <MentionHashtagText>{text}</MentionHashtagText>
            </CommentText>

            {/* View replies */}
            {!isReply && nbReplies > 0 && (
              <TouchableOpacity onPress={toggleReplies} activeOpacity={0.5}>
                <ViewReplies>
                  {showReplies
                    ? `${i18n.t('commentComponent.replies.hide', { count: nbReplies })}`
                    : `${i18n.t('commentComponent.replies.view', { count: nbReplies })}`}{' '}
                  <LogoChevron>
                    <AntDesign
                      name={showReplies ? 'up' : 'down'}
                      size={14}
                      color="grey"
                    />
                  </LogoChevron>
                </ViewReplies>
              </TouchableOpacity>
            )}

            {/* If is a reply -> "Reply" */}
            {isReply && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onReply(username, id)}
              >
                <ViewReplies>
                  {i18n.t('commentComponent.replies.reply')}
                </ViewReplies>
              </TouchableOpacity>
            )}
          </CommentContainer>

          <InteractionContainer>
            {/* Replying icon */}
            {!isReply && (
              <TouchableOpacity
                style={{ marginRight: 5 }}
                activeOpacity={0.7}
                onPress={() => onReply(username, id)}
              >
                <IconContainer>
                  <MaterialCommunityIcons
                    name="arrow-u-left-bottom"
                    size={18}
                    color={'grey'}
                  />
                  <IconText>{nbReplies}</IconText>
                </IconContainer>
              </TouchableOpacity>
            )}

            {/* Likes */}
            <IconContainer>
              <TouchableOpacity onPress={handleLikePress} activeOpacity={0.7}>
                <AntDesign
                  name={isLiked ? 'heart' : 'hearto'}
                  size={16}
                  color={isLiked ? 'red' : 'grey'}
                />
              </TouchableOpacity>

              <IconText>{isLiked ? likes + 1 : likes}</IconText>
            </IconContainer>
          </InteractionContainer>
        </ContainerOriginalComment>

        {/* Render all replies (if visible) of the original comment */}
        {showReplies && renderReplies(allReplies)}
      </TouchableOpacity>
    </Container>
  )
}

export default CommentComponent
