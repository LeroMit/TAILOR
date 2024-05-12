import React from 'react'
import { View, FlatList } from 'react-native'
import RecentSearch from './RecentSearch'
import { SearchItem, SearchTagItem } from '@/types'

interface RecentSearchListProps {
  recentSearches: SearchItem[] | SearchTagItem[]
  onRemove: (search: SearchItem | SearchTagItem) => void
}

const RecentSearchList: React.FC<RecentSearchListProps> = ({
  recentSearches,
  onRemove,
}) => {
  return (
    <View style={{ marginVertical: 10 }}>
      <FlatList
        data={recentSearches as SearchItem[]}
        renderItem={({ item }) => (
          <RecentSearch search={item} onRemove={onRemove} />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default RecentSearchList
