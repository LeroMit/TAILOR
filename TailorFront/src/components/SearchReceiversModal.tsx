import React, { useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native'
import Modal from 'react-native-modal'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import CustomText from './CustomText'
import { useLocale } from '@/context/LocaleContext'
import {
  GradientBackground,
  HeaderBottomSheet,
  Line,
  ModalView,
} from '@/styles/customModal'

import GradientText from './GradientText'
import axios from 'axios'
import { serverLocal } from '@/constants'
import Toast from 'react-native-toast-message'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { Input, Search } from '@/styles/inbox'
import { router } from 'expo-router'
import { SearchReceiversModalProps, UserApi, Receiver } from '@/types'

const { width } = Dimensions.get('window')
const height = Dimensions.get('window').height + (StatusBar.currentHeight || 0)

const SearchReceiversModal: React.FC<SearchReceiversModalProps> = ({
  USER_ID,
  isModalVisible,
  setIsModalVisible,
}) => {
  const { i18n } = useLocale()
  const [receivers, setReceivers] = useState<Receiver[]>([])
  const [users, setUsers] = useState<UserApi[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserApi[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [search, setSearch] = useState('')

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const fetchAllUsers = async () => {
    setUsers([])
    setFilteredUsers([])
    setReceivers([
      {
        id: USER_ID,
        name: i18n.t('inbox.chat.receivers.me'),
        selected: true,
      },
    ])
    try {
      const response = await axios.get(`${serverLocal}/api/users`)
      setUsers(response.data)
      setFilteredUsers(response.data.filter((user) => user.id !== USER_ID))

      setIsDataLoaded(true)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error ' + error.message,
      })
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [isModalVisible])

  useEffect(() => {
    if (search === '') {
      setFilteredUsers(users)
    } else {
      const filteredUsers = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredUsers(filteredUsers)
    }
  }, [search])

  const handleCreateConv = async () => {
    try {
      const response = await axios.post(
        `${serverLocal}/api/conversation/create`,
        {
          creatorId: USER_ID,
          userIds: [...receivers.map((receiver) => receiver.id)],
          content: i18n.t('inbox.chat.createConv'),
        }
      )

      setIsModalVisible(false)

      router.push({
        pathname: '/chat',
        params: {
          conversationId: response.data.id,
        },
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error ' + error.message,
      })
    }
  }

  return (
    <Modal
      animationInTiming={500}
      animationOutTiming={200}
      onBackdropPress={closeModal}
      isVisible={isModalVisible}
      onSwipeComplete={() => setIsModalVisible(false)}
      swipeDirection="down"
      propagateSwipe
      style={{
        margin: 0,
      }}
    >
      <View
        style={{
          position: 'absolute',
          height: height - 100,
          bottom: 0,
        }}
      >
        <ModalView
          style={{
            height: height,
            maxHeight: height - 100,
          }}
        >
          <HeaderBottomSheet style={{ width }}>
            <>
              <CustomText
                weight="bold"
                style={{
                  fontSize: 15,
                  color: 'white',
                }}
              >
                {i18n.t('inbox.modal.title')}
              </CustomText>
              <TouchableOpacity
                onPress={handleCreateConv}
                style={{ position: 'absolute', right: 30, top: 5 }}
                activeOpacity={0.7}
              >
                {receivers.length > 1 && (
                  <GradientText colors={['#FF0000', '#FFFF00']} size={15}>
                    {i18n.t('inbox.modal.button')}
                  </GradientText>
                )}
              </TouchableOpacity>
            </>
            <Line />
          </HeaderBottomSheet>

          <View style={{ flex: 1, marginTop: 5, alignContent: 'center' }}>
            <Search style={{ height: 40, width: width - 30, marginBottom: 5 }}>
              <MaterialCommunityIcons
                style={{
                  paddingRight: 10,
                }}
                name="magnify"
                size={18}
                color="#CCCDD3"
              />
              <Input
                placeholder={i18n.t('inbox.modal.searchPlaceholder')}
                placeholderTextColor={'#CCCDD3'}
                value={search}
                returnKeyType="search"
                onChangeText={(text) => setSearch(text)}
              />
            </Search>
            {isDataLoaded && (
              <GestureHandlerRootView>
                <FlatList
                  style={{ flex: 1 }}
                  data={filteredUsers}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      activeOpacity={0.7}
                      onPress={() => {
                        const receiver = receivers.find(
                          (receiver) => receiver.id === item.id
                        )
                        if (receiver) {
                          setReceivers(
                            receivers.filter(
                              (receiver) => receiver.id !== item.id
                            )
                          )
                          item.selected = !item.selected
                        } else {
                          setReceivers([
                            ...receivers,
                            {
                              id: item.id,
                              name: item.firstName,
                              selected: true,
                            },
                          ])
                          item.selected = !item.selected
                        }
                      }}
                    >
                      <GradientBackground
                        colors={
                          item.selected
                            ? ['#FF0000', '#FFFF00']
                            : ['#060E12', '#060E12']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 3,
                          height: 60,
                          width: width - 40,
                          borderRadius: 20,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignContent: 'center',
                            paddingStart: 25,
                            borderRadius: 20,
                            height: '100%',
                            width: '100%',
                            backgroundColor: '#060E12',
                          }}
                        >
                          <Image
                            source={{ uri: item.photoUrl }}
                            style={{
                              marginLeft: 10,
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                            }}
                          />
                          <View
                            style={{
                              marginLeft: 30,
                              marginRight: 10,
                              flexDirection: 'row',
                            }}
                          >
                            <CustomText
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: 'white',
                                overflow: 'hidden',
                              }}
                            >
                              {item.firstName} {item.lastName}
                            </CustomText>
                          </View>
                        </View>
                      </GradientBackground>
                    </TouchableOpacity>
                  )}
                />
              </GestureHandlerRootView>
            )}
          </View>
        </ModalView>
      </View>
    </Modal>
  )
}

export default SearchReceiversModal
