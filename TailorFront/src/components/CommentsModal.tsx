import React, { useState } from 'react'
import { TouchableOpacity, FlatList } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Toast from 'react-native-toast-message'

import CustomModal from './CustomModal'
import CustomText from './CustomText'
import StyledCustomTextInput from './CustomTextInput'
import CommentComponent from './CommentComponent'
import { useLocale } from '@/context/LocaleContext'
import { flattenReplies } from '@/utils'
import { Comment, CommentsModalProps } from '@/types'

import {
  TextInputContainer,
  IconContainer,
  SendButtonBackground,
  TextInputContainerWrapper,
} from '@/styles/feed'

/* Handling of Comment Features */
const handleAutoCompletionUsername = async () => {
  Toast.show({
    type: 'info',
    text1: 'TODO',
    text2: 'Feature not implemented',
  })
}

const handleGIF = async () => {
  Toast.show({
    type: 'info',
    text1: 'TODO',
    text2: 'Feature not implemented',
  })
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  nbComments,
  setNbComments,
  itemComments,
  setItemComments,
}) => {
  const { i18n } = useLocale()

  const [selectedCommentId, setSelectedCommentId] = useState<number>(null)
  const [selectedCommentUserName, setSelectedCommentUserName] =
    useState<string>(null)
  const [text, setText] = useState('')
  const [showSendButton, setShowSendButton] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  /**
   * Handle text input change in comment box
   * @param text string
   */
  const handleTextInputChange = (text: string) => {
    const commentText = text.trim()
    if (isReplying) {
      const replyText = text.substring(
        0,
        text.indexOf(' ') !== -1 ? text.indexOf(' ') : text.length
      )
      const replyUserName = replyText.substring(1)
      if (selectedCommentUserName !== replyUserName) {
        setIsReplying(false)
        setSelectedCommentId(null)
        setSelectedCommentUserName(null)
      }
    }
    setText(text)
    setShowSendButton(commentText.length > 0)
  }

  /**
   * Update comments with new reply
   * @param comments Comment[]
   * @param selectedId number
   * @param newReply Comment
   * @returns
   */
  const updateCommentsWithReply = (
    comments: Comment[],
    selectedId: number,
    newReply: Comment
  ) => {
    return comments.map((comment) => {
      if (comment.id === selectedId) {
        // Add new reply to selected comment
        return {
          ...comment,
          replies: [newReply, ...comment.replies],
        }
      } else if (comment.replies && comment.replies.length > 0) {
        // Recursively update replies
        const updatedReplies = updateCommentsWithReply(
          comment.replies,
          selectedId,
          newReply
        )
        return {
          ...comment,
          replies: updatedReplies,
        }
      }
      return comment
    })
  }

  /**
   * Handle add comment
   */
  const handleAddComment = () => {
    if (isReplying) {
      const newReply: Comment = {
        id: nbComments,
        username: 'le_rom',
        avatar: 'avatar_url',
        posted_ago: 'just now',
        text: text.trim(),
        likes: 0,
        replies: [],
      }

      const updatedComments = updateCommentsWithReply(
        itemComments,
        selectedCommentId,
        newReply
      )

      setItemComments(updatedComments)
    } else {
      const newComment: Comment = {
        id: nbComments,
        username: 'le_rom',
        avatar: 'avatar_url',
        posted_ago: 'just now',
        text: text.trim(),
        likes: 0,
        replies: [],
      }

      setItemComments((prevComments) => [newComment, ...prevComments])
    }

    setNbComments((prevNbComments) => prevNbComments + 1)

    // Clear input field and other params
    setText('')
    setShowSendButton(false)
    setIsReplying(false)
  }

  /**
   * On reply
   * @param username string
   * @param commentId number
   */
  const onReply = (username: string, commentId: number) => {
    const currentText = text.trim()
    const replyPrefix = `@${username} `
    const newText = currentText.startsWith(replyPrefix)
      ? `${replyPrefix}${currentText.substring(replyPrefix.length)}`
      : replyPrefix

    setText(newText)
    setSelectedCommentId(commentId)
    setSelectedCommentUserName(username)
    setIsReplying(true)
  }

  return (
    <CustomModal
      setIsModalVisible={setIsModalVisible}
      isModalVisible={isModalVisible}
      type="comments"
      Header={() => (
        <CustomText
          weight="bold"
          style={{
            fontSize: 13,
            color: 'white',
          }}
        >
          {i18n.t('headerModal.titleComment', { count: nbComments })}
        </CustomText>
      )}
    >
      <FlatList
        data={itemComments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const allReplies = flattenReplies(item.replies)
          return (
            <CommentComponent
              comment={item}
              onReply={onReply}
              allReplies={allReplies}
            />
          )
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      />
      <TextInputContainerWrapper>
        <TextInputContainer>
          <StyledCustomTextInput
            scrollEnabled
            blurOnSubmit={false}
            autoCapitalize="none"
            multiline
            placeholder={i18n.t('placeHolderComment.hint')}
            placeholderTextColor={'#86878B'}
            value={text}
            onChangeText={handleTextInputChange}
            style={{
              flex: 1,
              paddingLeft: 10,
              color: 'rgb(255, 255, 255)',
            }}
            keyboardType="twitter"
          />
          {showSendButton ? (
            <TouchableOpacity activeOpacity={0.7} onPress={handleAddComment}>
              <SendButtonBackground
                colors={['rgba(255, 0, 0, 1)', 'rgba(255, 255, 0, 1)']}
              >
                <MaterialCommunityIcons name="send" size={20} color="white" />
              </SendButtonBackground>
            </TouchableOpacity>
          ) : (
            <IconContainer>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleAutoCompletionUsername}
              >
                <MaterialCommunityIcons name="at" size={25} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={handleGIF}>
                <MaterialCommunityIcons
                  name="file-gif-box"
                  size={25}
                  color="#fff"
                />
              </TouchableOpacity>
            </IconContainer>
          )}
        </TextInputContainer>
      </TextInputContainerWrapper>
    </CustomModal>
  )
}

export default CommentsModal
