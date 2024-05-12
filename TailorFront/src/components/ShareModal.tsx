import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'

import CustomModal from './CustomModal'
import CustomText from './CustomText'
import { useLocale } from '@/context/LocaleContext'

import SharingSubComponent from './SharingSubComponent'
import GradientText from './GradientText'
import { Icon } from '@/types'

const avatar = require('@/assets/images/avatar.png')
const iconFriends: Icon[] = [
  { title: 'bonjour1', image: avatar },
  { title: 'karenn', image: avatar },
  { title: 'tailor', image: avatar },
  { title: 'hunter4', image: avatar },
  { title: 'pierre', image: avatar },
  { title: 'paul', image: avatar },
]

const mediaTypes: Icon[] = [
  { title: 'Whatsapp', image: require('@/assets/icons/whatsapp.png') },
  { title: 'SMS', image: require('@/assets/icons/message.png') },
  { title: 'Messenger', image: require('@/assets/icons/messenger.png') },
  { title: 'Instagram', image: require('@/assets/icons/instagram.png') },
  { title: 'Download', image: require('@/assets/icons/download.png') },
  { title: 'Snapchat', image: require('@/assets/icons/snapchat.png') },
]

interface ShareModalProps {
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const ShareModal: React.FC<ShareModalProps> = ({
  isModalVisible,
  setIsModalVisible,
}) => {
  const { i18n } = useLocale()
  const [receivers, setReceivers] = useState<string[]>([])

  return (
    <CustomModal
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      type="share"
      Header={() => (
        <>
          <CustomText
            weight="bold"
            style={{
              fontSize: 13,
              color: 'white',
            }}
          >
            {i18n.t('headerModal.titleShare')}
          </CustomText>
          <TouchableOpacity
            onPress={() => {}}
            style={{ position: 'absolute', right: 30, top: 5 }}
            activeOpacity={0.7}
          >
            {receivers.length > 0 && (
              <GradientText colors={['#FF0000', '#FFFF00']} size={15}>
                {i18n.t('buttonModal.title')}
              </GradientText>
            )}
          </TouchableOpacity>
        </>
      )}
    >
      <View style={{ flex: 1 }}>
        <ScrollView>
          <SharingSubComponent
            icons={iconFriends}
            type="friends"
            setReceivers={setReceivers}
          />
        </ScrollView>
        <ScrollView>
          <SharingSubComponent icons={mediaTypes} type="socialNetwork" />
        </ScrollView>
      </View>
    </CustomModal>
  )
}

export default ShareModal
