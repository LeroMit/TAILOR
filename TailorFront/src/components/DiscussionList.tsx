import React from 'react'
import { FlatList, View } from 'react-native'
import { DiscussionListProps } from '@/types'
import Discussion from './Discussion'
import {
  GestureHandlerRootView,
  RefreshControl,
} from 'react-native-gesture-handler'

import { useLocale } from '@/context/LocaleContext'

const DiscussionList: React.FC<DiscussionListProps> = ({
  discussions,
  fetchDiscussion,
  onDiscussionPress,
}) => {
  const { i18n } = useLocale()
  const sortedDiscussions = discussions.slice()

  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchDiscussion(true)
    setRefreshing(false)
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <GestureHandlerRootView>
        <FlatList
          style={{
            paddingBottom: 100,
            height: '100%',
          }}
          data={sortedDiscussions}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FFDD00', '#FF2222']}
              tintColor={'#FFDD00'}
              title={i18n.t('inbox.discussion.refresh')}
              titleColor={'#FFDD00'}
            />
          }
          renderItem={({ item }) => (
            <Discussion
              id={item.conversationId}
              profileImage={item.profilePictureUrl}
              date={item.updatedOn}
              sender={item.isSentByUser}
              name={item.name}
              seenDate={item.isRead}
              lastMessage={item.content}
              onPress={() => onDiscussionPress(item)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </GestureHandlerRootView>
    </View>
  )
}

export default DiscussionList
