import React from 'react'
import { Actions, BoxAction, TextAction } from '@/styles/feed'
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons'

import { useLocale } from '@/context/LocaleContext'

interface PostActionsProps {
  isActionBarOpen: boolean
  toggleActionBar: () => void
  item: any
  isLiked: boolean
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>
  nbComments: number
  onPressComment: () => void
  onPressShare: () => void
}

const PostActions: React.FC<PostActionsProps> = ({
  isActionBarOpen,
  toggleActionBar,
  item,
  isLiked,
  setIsLiked,
  nbComments,
  onPressComment,
  onPressShare,
}) => {
  const { i18n } = useLocale()

  const heartColor = isLiked ? '#FF0000' : '#fff' // red or white heart

  return (
    <Actions
      isOpen={isActionBarOpen}
      colors={['rgba(255, 0, 0, 0.75)', 'rgba(255, 255, 0, 0.75)']}
    >
      {!isActionBarOpen ? ( // When action bar closed
        <BoxAction onPress={toggleActionBar} style={{ marginTop: -15 }}>
          <Entypo name="chevron-small-up" size={45} color="#fff" />
        </BoxAction>
      ) : (
        // When action bar open
        <>
          <BoxAction onPress={() => setIsLiked(!isLiked)}>
            <AntDesign
              style={{ alignSelf: 'center' }}
              name="heart"
              size={35}
              color={heartColor}
            />
            <TextAction>{isLiked ? item.likes + 1 : item.likes}</TextAction>
          </BoxAction>
          <BoxAction onPress={onPressComment}>
            <FontAwesome
              style={{ alignSelf: 'center' }}
              name="commenting"
              size={35}
              color="#fff"
            />
            <TextAction>{nbComments}</TextAction>
          </BoxAction>
          <BoxAction onPress={onPressShare}>
            <MaterialCommunityIcons name="share" size={40} color="#fff" />
            <TextAction>{i18n.t('shareBoxAction.title')}</TextAction>
          </BoxAction>
          <BoxAction onPress={toggleActionBar}>
            <Entypo name="chevron-small-down" size={45} color="#fff" />
          </BoxAction>
        </>
      )}
    </Actions>
  )
}
export default PostActions
