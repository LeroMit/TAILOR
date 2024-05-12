import React, { useState } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { hexy } from '@/utils'
import { DataCarouselItem, SearchTagProps, TailorItem } from '@/types'
import TailorModal from './TailorModal'
import { Creator, ProfilePicture } from '@/styles/tailorModal'
import { ContainerTag, NameTailor, TitleCreator } from '@/styles/community'
import { Tag, TagBackground } from '@/styles/tagsBag'

import { useLocale } from '@/context/LocaleContext'

const ItemTailor: React.FC<SearchTagProps> = ({ item, index }) => {
  const { i18n } = useLocale()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<
    TailorItem | null | DataCarouselItem
  >(null)

  function pressTailor(item: TailorItem | DataCarouselItem) {
    setSelectedItem(item)
    setIsModalVisible(true)
  }

  return (
    <>
      {selectedItem && (
        <TailorModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          item={selectedItem}
        />
      )}
      <TouchableWithoutFeedback onPress={() => pressTailor(item)}>
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
            <TitleCreator>
              <NameTailor>{item.name}</NameTailor>
              {'creator' in item && (
                <Creator style={{ flexShrink: 1 }}>
                  {i18n.t('community.creator')}
                  {item.creator}
                </Creator>
              )}
            </TitleCreator>

            {/* Tags */}
            <ContainerTag style={{ width: '95%' }}>
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
      </TouchableWithoutFeedback>
    </>
  )
}

export default ItemTailor
