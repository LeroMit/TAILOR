import React from 'react'
import { View } from 'react-native'
import { hexy } from '@/utils'
import { SearchTagProps } from '@/types'
import { Creator, ProfilePicture } from '@/styles/tailorModal'
import { ContainerTag, NameTailor, TitleCreator } from '@/styles/community'
import { Tag, TagBackground } from '@/styles/tagsBag'

import { useLocale } from '@/context/LocaleContext'

const MyTailors: React.FC<SearchTagProps> = ({ item, index }) => {
  const { i18n } = useLocale()

  return (
    <View
      style={{
        backgroundColor: hexy(),
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: 10,
        width: '90%',
        borderRadius: 20,
        height: 100,
        flexDirection: 'row',
        flexShrink: 1,
      }}
    >
      {'profilePicture' in item && (
        <View
          style={{
            width: '15%',
            height: '100%',
            marginLeft: 10,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <ProfilePicture source={item.profilePicture} />
        </View>
      )}
      {/* Title + creator + tags */}
      <View
        style={{
          padding: 10,
          alignContent: 'center',
          flexDirection: 'column',
          flex: 1,
          flexShrink: 1,
        }}
      >
        {/* Title + creator */}
        <TitleCreator style={{ alignSelf: 'center' }}>
          <NameTailor>{item.name}</NameTailor>
          {'creator' in item && (
            <Creator style={{ flexShrink: 1 }}>
              {i18n.t('community.creator')}
              {item.creator}
            </Creator>
          )}
        </TitleCreator>

        {/* Tags */}
        <ContainerTag style={{ width: '100%' }}>
          <View
            onStartShouldSetResponder={() => true}
            style={{
              flexDirection: 'row',
              flex: 1,
            }}
          >
            {item.tags.map((tag, tagIndex) => (
              <TagBackground key={tagIndex}>
                <Tag>{tag}</Tag>
              </TagBackground>
            ))}
          </View>
        </ContainerTag>
      </View>
    </View>
  )
}

export default MyTailors
