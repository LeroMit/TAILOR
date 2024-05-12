import React, { useState, useEffect } from 'react'
import { View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { DiscussionList, ElementControlBar } from '@/components'

import { useLocale } from '@/context/LocaleContext'

import {
  Container,
  Header,
  Title,
  Content,
  ControlBar,
  GradientBackground,
  GradientMaskContainer,
  Search,
  Input,
} from '@/styles/inbox'
import axios from 'axios'
import { serverLocal } from '@/constants'
import Toast from 'react-native-toast-message'
import { DiscussionItem } from '@/types'
import { useNavigation } from 'expo-router'
import SearchReceiversModal from '@/components/SearchReceiversModal'
import { useAuth } from '@/context/AuthContext'

const Inbox: React.FC = () => {
  const { i18n } = useLocale()
  const [selectedTab, setSelectedTab] = useState('messages')

  const [isInitMessages, setIsInitMessages] = useState(false)
  const [isInitArchived, setIsInitArchived] = useState(false)
  const [isInitMasked, setIsInitMasked] = useState(false)

  const [discussions, setDiscussions] = useState<DiscussionItem[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const [search, setSearch] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)

  const { authState } = useAuth()

  const fetchDiscussions = async (erase: boolean) => {
    console.log(authState?.id)
    try {
      const response = await axios.get(
        `${serverLocal}/api/conversations/user/${authState?.id}`
      )

      if (erase) {
        setDiscussions(() => [])
      }

      response.data.forEach((discussion: DiscussionItem) => {
        discussion.section = 'messages'
        setDiscussions((discussions) => [discussion, ...discussions])
      })

      setIsDataLoaded(true)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error ',
        text2: error.message,
      })
      console.log('Error: ', error)
    }
  }

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDiscussions(true)
    })

    return unsubscribe
  }, [navigation])

  /**
   * Handle messages click
   */
  function onMessagesClick() {
    setSelectedTab('messages')
  }

  useEffect(() => {
    onMessagesClick()
  }, [])

  /**
   * Handle archive click
   */
  function onArchiveClick() {
    setSelectedTab('archive')
  }

  /**
   * Handle masked click
   */
  function onMaskedClick() {
    setSelectedTab('masked')
  }

  const [gradientMaskPosition, setGradientMaskPosition] = useState({
    x: 0,
    y: 0,
  })

  /**
   * Filter discussions by name or last message
   * @param text
   */
  const handleSearch = (text: string) => {
    setSearch(text)
    const filteredDiscussions = discussions.filter(
      (discussion) =>
        discussion.name.toLowerCase().includes(text.toLowerCase()) ||
        discussion.content.toLowerCase().includes(text.toLowerCase())
    )
    setDiscussions(filteredDiscussions)
  }

  /**
   * Filter discussions by section
   * @param discussions
   * @returns
   */
  function filterDiscussionsBySection(discussions) {
    return discussions.filter(
      (discussion: DiscussionItem) => discussion.section === selectedTab
    )
  }

  const onDiscussionPress = (discussion: DiscussionItem) => {
    console.log('Discussion pressed: ', discussion)
  }

  function handlePlusClick() {
    setIsModalVisible(true)
  }

  return (
    <Container>
      <Header>
        <Title> </Title>
        <Title>{i18n.t('inbox.title')}</Title>
        <ElementControlBar
          style={{ zIndex: 200, pointerEvents: 'auto' }}
          onPress={handlePlusClick}
          name="plus"
          size={30}
          color="white"
          isSelected={true}
        />
      </Header>
      <Content>
        <Search>
          <MaterialCommunityIcons
            style={{
              paddingRight: 10,
            }}
            name="magnify"
            size={18}
            color="#CCCDD3"
          />
          <Input
            placeholder={i18n.t('inbox.searchPlaceholder')}
            placeholderTextColor={'#CCCDD3'}
            value={search}
            returnKeyType="search"
            onChangeText={(text) => handleSearch(text)}
            // onSubmitEditing={() => onSearch()}
          />
        </Search>
      </Content>
      <GradientBackground
        colors={['#FF0000', '#FFFF00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <ControlBar>
          <ElementControlBar
            onPress={onMessagesClick}
            name="send"
            size={30}
            color="white"
            isSelected={selectedTab === 'messages'}
          />
          <ElementControlBar
            onPress={onArchiveClick}
            name="archive"
            size={30}
            color="white"
            isSelected={selectedTab === 'archive'}
          />
          <ElementControlBar
            onPress={onMaskedClick}
            name="eye-off"
            size={30}
            color="white"
            isSelected={selectedTab === 'masked'}
          />
        </ControlBar>
      </GradientBackground>
      <View
        collapsable={false}
        style={{
          zIndex: -2,
          pointerEvents: 'auto',
          flex: 1,
        }}
      >
        {isDataLoaded && (
          <DiscussionList
            discussions={filterDiscussionsBySection(discussions)}
            onDiscussionPress={onDiscussionPress}
            fetchDiscussion={() => fetchDiscussions(true)}
          />
        )}
      </View>
      <GradientMaskContainer
        colors={['#0d1d25', 'transparent']}
        start={{ x: 0, y: gradientMaskPosition.y }}
        end={{ x: 0, y: gradientMaskPosition.y + 0.2 }}
      />
      <SearchReceiversModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        USER_ID={authState?.id}
      />
    </Container>
  )
}

export default Inbox
