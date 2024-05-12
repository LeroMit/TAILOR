import React, { useState, useRef, useEffect } from 'react'
import {
  Animated,
  TouchableOpacity,
  GestureResponderEvent,
  Dimensions,
} from 'react-native'

import { Comment, PostOverlayProps } from '@/types'
import { calculateTotalComments } from '@/utils'
import { fadeInIcon } from '@/utils/animations'

import PostActions from './PostActions'
import PostDetails from './PostDetails'
import PostProgressBar from './PostProgressBar'
import CommentsModal from './CommentsModal'
import ShareModal from './ShareModal'
import MuteAnimation from './MuteAnimation'
import HeartAnimation from './HeartAnimation'

const PostOverlay: React.FC<PostOverlayProps> = ({
  item,
  setIsShared,
  setIsCurrentLiked,
  isActionBarOpen,
  setIsActionBarOpen,
  isMuted,
  setIsMuted,
  setIsPaused,
  currentWatchingTime,
}) => {
  /* Like Animation */
  const heartIconOpacity = useRef(new Animated.Value(0)).current
  const [isLiked, setIsLiked] = useState(false)
  const [tapX, setTapX] = useState(0)
  const [tapY, setTapY] = useState(0)

  /* Double Tap */
  const handleDoubleTapRef = useRef(0)

  /* Mute Animation */
  const muteIconOpacity = useRef(new Animated.Value(0)).current

  /**
   * Toggle mute/unmute
   */
  const toggleMute = () => {
    setIsMuted((prev) => !prev)
    fadeInIcon(muteIconOpacity)
  }

  /**
   * Handle double tap
   * @param e GestureResponderEvent
   */
  const handleDoubleTap = (e: GestureResponderEvent) => {
    if (!isCommentModalOpen && !isShareModalOpen) {
      const now = Date.now()
      if (
        handleDoubleTapRef.current &&
        now - handleDoubleTapRef.current < 150
      ) {
        // Double tap
        setIsLiked(true)

        setTapX(e.nativeEvent.locationX)
        setTapY(e.nativeEvent.locationY)

        fadeInIcon(heartIconOpacity)
        handleDoubleTapRef.current = null
      } else {
        // Single tap
        setTimeout(() => {
          if (handleDoubleTapRef.current === now) {
            toggleMute()
          }
        }, 150)

        handleDoubleTapRef.current = now
      }
    }
  }

  /**
   * Toggle action bar
   */
  const toggleActionBar = () => {
    setIsActionBarOpen((prev) => !prev)
  }

  /* COMMENTS Modal */
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)

  // Initialize nbComments state with the computed total
  const [nbComments, setNbComments] = useState(
    calculateTotalComments(item.comments)
  )

  const [itemComments, setItemComments] = useState<Comment[]>(item.comments)

  /**
   * On press comment
   */
  const onPressComment = () => {
    setIsCommentModalOpen(true)
    setIsShareModalOpen(false)
  }

  /* Share BottomSheet */
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    setIsShared(isShareModalOpen)
  }, [isShareModalOpen])

  useEffect(() => {
    setIsCurrentLiked(isLiked)
  }, [isLiked])

  const onPressShare = () => {
    setIsShareModalOpen(true)
    setIsCommentModalOpen(false)
  }

  return (
    <>
      <CommentsModal
        isModalVisible={isCommentModalOpen}
        setIsModalVisible={setIsCommentModalOpen}
        nbComments={nbComments}
        setNbComments={setNbComments}
        itemComments={itemComments}
        setItemComments={setItemComments}
      />
      <ShareModal
        isModalVisible={isShareModalOpen}
        setIsModalVisible={setIsShareModalOpen}
      />

      <TouchableOpacity
        onPress={(e) => {
          handleDoubleTap(e)
        }}
        onLongPress={() => {
          if (!isCommentModalOpen && !isShareModalOpen) {
            setIsPaused(true)
          }
        }}
        onPressOut={() => setIsPaused(false)}
        activeOpacity={1}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.7,
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
        }}
      >
        <PostProgressBar progress={currentWatchingTime * 100} />

        <PostDetails
          username={item.username}
          music={item.music}
          tags={item.tags}
        />

        <PostActions
          isActionBarOpen={isActionBarOpen}
          toggleActionBar={toggleActionBar}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          onPressComment={onPressComment}
          onPressShare={onPressShare}
          item={item}
          nbComments={nbComments}
        />

        <MuteAnimation muteIconOpacity={muteIconOpacity} isMuted={isMuted} />

        <HeartAnimation
          heartIconOpacity={heartIconOpacity}
          tapX={tapX}
          tapY={tapY}
        />
      </TouchableOpacity>
    </>
  )
}

export default PostOverlay
