import React, { useEffect, useRef, useState } from 'react'
import { Header, Title, ProfilePic, Content, Input, Write } from '@/styles/chat'
import {
  TouchableOpacity,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { useLocale } from '@/context/LocaleContext'
import { CustomText } from '@/components'
import { useAuth } from '@/context/AuthContext'

import {
  FlatList,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  View,
  Animated,
  Image,
} from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import axios from 'axios'
import { serverLocal } from '@/constants'
import Toast from 'react-native-toast-message'
import { ApiMessage, Message } from '@/types'

const { width } = Dimensions.get('window')
const height = Dimensions.get('window').height + (StatusBar.currentHeight || 0)

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

export default function chat() {
  const params = useLocalSearchParams()
  const { conversationId } = params
  const { i18n } = useLocale()
  const { authState } = useAuth()

  const scrollViewRef = useRef(null)
  const [inputText, setInputText] = useState('')

  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const [scrollPosition, setScrollPosition] = useState(0)

  const [title, setTitle] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [photoUrl, setPhotoUrl] = useState('photo')

  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const fetchChat = async (id: number) => {
    try {
      const response = await axios.get(`${serverLocal}/api/conversation/${id}`)

      setTitle(response.data.title)
      setPhotoUrl(response.data.photoUrl)

      response.data.messages.forEach((msg: ApiMessage) => {
        setMessages((messages) => [
          {
            id: msg.id,
            receiver: authState?.id === msg.writtenBy.id ? false : true,
            text: msg.content,
            date: new Date(msg.createdOn),
          },
          ...messages,
        ])
      })
      setIsDataLoaded(true)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error ' + error.message,
      })
    }
  }

  useEffect(() => {
    fetchChat(parseInt(conversationId as string))
  }, [])

  const handleScroll = (event) => {
    let yOffset = event.nativeEvent.contentOffset.y
    setScrollPosition(yOffset)
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        const kHeight = event.endCoordinates.height
        setKeyboardHeight(kHeight)
        scrollViewRef.current.scrollTo({
          y: scrollPosition + kHeight,
          animated: true,
        })
      }
    )

    return () => {
      keyboardDidShowListener.remove()
    }
  }, [keyboardHeight, scrollPosition])

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [messages])

  const scrollToBottom = () => {
    if (Platform.OS === 'ios') {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    } else {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }
  }

  const postMessage = async (text: string) => {
    try {
      const response = await axios.post(
        `${serverLocal}/api/conversation/${conversationId}/message/add`,
        {
          writtenById: authState?.id,
          content: text,
        }
      )
      console.log(response.status)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error ' + error.message,
      })
    }
  }

  const sendMessage = () => {
    if (inputText.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        receiver: false,
        text: inputText,
        date: new Date(),
      }

      setMessages([...messages, newMessage])
      postMessage(inputText)

      setInputText('')
    }
    scrollToBottom()
  }

  function onChevronClick() {
    router.back()
  }

  const [dimension, setDimension] = React.useState({ height })
  const scrollY = React.useRef(new Animated.Value(0)).current

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{ backgroundColor: '#0d1d25', height: height, flex: 1 }}
      >
        <View
          style={{
            position: 'absolute',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            top: '10%',
            bottom: '6%',
            flex: 1,
            width: width,
          }}
        >
          <Svg
            height="100%"
            width="100%"
            viewBox="0 0 500 500"
            fill="#FFFFFF11"
            transform={'scale(2.5)' + 'translate(-150, -150)'}
          >
            <Path d="M245.5 92c-27.4 4-52.4 22-64.8 46.6-6.6 13.2-6.9 15-7.5 46.8-.4 26.4-.6 29-2.3 30.7-2.5 2.5-6.5 3.4-9.4 2.1-1.4-.7-3.7-3.7-5.5-7.2-2.7-5.3-3.4-6-6-6-10.2 0-6.6 19.6 4.6 25 9.4 4.6 19.6 2.3 26.8-6.2 5.9-6.8 6.6-11 6.6-37.3 0-26.9 1.2-33.9 7.9-45.4 19.7-33.7 67-45.6 109.3-27.5 14.8 6.3 26 14.8 38.9 29.4 8.3 9.4 9.7 10.3 15.7 10.2 5.4-.2 7.2-1.5 7.2-5.5 0-2.5-2-5.1-12.7-15.9-15.2-15.4-22.5-21.1-35.3-27.7-18.2-9.3-34.9-13.2-55.9-13-6.9.1-14.9.5-17.6.9zM147.4 127.6c-13.7 4.7-10.7 24.4 3.8 24.4 4.5 0 7.8-1.9 10.5-5.9 6.8-10-2.8-22.4-14.3-18.5z" />
            <Path d="M249.6 138.5c-13.6 3.5-25.6 11.9-30.7 21.6-3.2 6.1-3.2 15.7 0 21.8 5.2 10 18.3 18.5 32.9 21.7 7.9 1.6 28.5 1.8 36.6.3 3.2-.6 6-.8 6.3-.5.3.3-2.1 5-5.4 10.3-3.3 5.4-8.9 14.5-12.5 20.3-3.5 5.8-18.5 30.3-33.4 54.5-24.8 40.5-27.6 44.7-35.4 52.6-6.5 6.6-10.2 9.5-16 12.3-11.7 5.7-16.3 6.6-35.7 6.6-10.8 0-17.4.4-17.8 1-1.1 1.8 2.2 5.7 7.1 8.6 20.1 11.8 53.1 3.5 74.4-18.7 6.4-6.7 9.4-11.2 33.5-50.9 6.6-10.7 19.3-31.4 28.3-45.9 9.1-14.6 22.3-36.2 29.4-48l13-21.6-.4-10.6c-.3-9.4-.6-11-2.9-14.5-5.9-8.8-14.2-14.8-26.4-19-7.2-2.5-9.6-2.8-23.5-3.1-11.1-.2-17.2.2-21.4 1.2zm31.9 12c15.8 2.8 29.5 12.5 29.5 20.8 0 13.6-28 24.9-51.5 20.8-17.7-3.1-31.7-14-29.8-23.3 1.5-7.4 13.2-15.4 26.8-18.2 9-1.8 15-1.9 25-.1z" />
            <Path d="M124.5 166.9c-14.6 6.9-24.4 26.6-23.2 46.6 1.1 17.8 7.7 32.6 20.2 45 12.4 12.4 25.2 17.8 42 17.8 15.7-.1 28.9-5.5 39.5-16.3 5.2-5.4 8-9.5 14.3-21.6 5.6-10.6 8.8-15.6 11.2-17.4 3.6-2.7 6.5-6.9 6.5-9.4 0-2.8-3.8-5.6-7.5-5.6-8.2 0-12.2 4.2-21.3 22.6-8.8 17.5-14.1 23.8-25 29.1-7.4 3.7-7.9 3.8-18.1 3.8-10-.1-11-.3-17.6-3.4-22-10.7-34.5-38.6-27.5-61.3 3.6-11.6 11-18.7 19.6-18.8 4.2 0 9.5 3.8 11.6 8.3 2 4.1 5.4 5.5 8.7 3.8 4.6-2.5 4-12.5-1.1-17.8-8.1-8.6-21.1-10.8-32.3-5.4zM356.9 165.4c-9.1 3.2-14.6 8.6-18 17.6-5.1 13.4.8 28.4 13.7 35 7 3.6 18.8 3.6 25.7 0 9.7-4.9 15.2-14.1 15.1-25.5 0-8.4-2.4-14.2-7.9-19.9-7.6-7.6-19.2-10.6-28.6-7.2zm15.9 14.6c4.6 2.8 7.2 7.6 7.2 13.3 0 4.2-.5 5.3-3.8 8.9-3.5 3.7-4.5 4.2-9.3 4.5-6.3.5-10.7-1.7-13.9-6.9-4-6.6-1.6-15.6 5.2-19.8 1.9-1.1 5.1-2 7.3-2s5.4.9 7.3 2zM319.3 234.2c-1.8.5-4.8 2.5-6.8 4.5s-12.2 18.1-22.9 35.7c-10.6 17.7-25.3 42-32.6 54.1-18.2 29.9-18.3 30.2-18.8 58.7l-.4 22.8h15l.4-22.2c.5-26.5.3-25.7 13.3-47 9.6-15.6 12.2-19.8 33.5-54.8 18.5-30.6 20.3-33.2 24-35.4 3.3-1.9 7-7 7-9.7 0-2.4-3.7-6.6-6.2-7.1-1.3-.2-3.8-.1-5.5.4zM393.5 234.2c-.2.7-.6 11.9-.7 24.8l-.3 23.5-3.2 6.7c-3.5 7.6-10.3 15.3-17.2 19.7-7.5 4.9-14.3 6.1-33.6 6.1-24.5 0-33.6 2.9-43.5 13.7-7.1 7.7-9.3 13.1-9.8 23.3-.3 7 0 9.5 1.8 14.4 3 7.8 11.6 16.6 19.2 19.4 15.7 5.9 28.1 2.8 43.1-10.8 4.3-3.8 8.2-7 8.8-7 1.5 0 4.9-6.3 4.9-9.2 0-3.7-2.5-4.8-10.8-4.8h-6.9l-4.6 6.9c-5.4 8.1-9.5 11.5-15.8 13.2-5.9 1.6-10.7.6-16.5-3.4-14.4-9.7-11.9-29.9 4.8-38.3 4.7-2.4 6.1-2.5 25.6-3 11.4-.3 22.8-.9 25.4-1.4 8.5-1.7 17.8-7 24.9-14 12.9-12.8 18.4-26.4 20-50 .6-8 .8-18.2.4-22.8l-.7-8.2h-7.4c-5.1 0-7.6.4-7.9 1.2z" />
            <Path d="M231.2 251.1c-4.8 2.4-8.6 7.5-17.2 23.1-15 27.4-32.8 39.8-57.1 39.8-24.2 0-44.4-16-50.9-40.3-2.5-9.6-4.1-12.4-7.7-13.8-1.9-.7-3.2-.6-4.9.6-2 1.3-2.4 2.4-2.4 6.9 0 7.2 3.3 19.5 7.2 26.9 2 3.7 6.5 9.5 11.3 14.3 12.5 12.6 25.3 18.7 42.1 20 11.1.8 21-.7 31.7-4.8 19.2-7.3 28.1-16.3 45.7-46 4.8-8.1 7.1-11.1 9.6-12.3 3.5-1.6 7.4-5.9 7.4-8.1 0-2.6-2.3-6.2-4.7-7.3-3.4-1.6-5.2-1.4-10.1 1zM348.5 252.6c-5.9 2.1-11.2 6.8-14.1 12.7-2.2 4.3-2.6 6-2.2 12.3.3 6.1.8 7.9 3.3 11.6 1.7 2.3 5 5.6 7.4 7.3 4 2.8 4.9 3 12.9 3s9.1-.2 13.2-3c2.4-1.7 5.8-5.2 7.5-7.9 2.7-4.4 3-5.8 3-12.5 0-5.9-.5-8.5-2.2-11.8-2.9-5.4-8.6-10-14.7-11.8-6-1.8-8.8-1.8-14.1.1zm12.5 13.9c1.6.9 3.7 2.9 4.6 4.6 5.3 10.3-8.6 20.4-16.7 12.2-9-8.9.9-22.6 12.1-16.8zM211.1 377.8c-6.1 1-10.1 6.3-10.1 13.3 0 3.3.6 4.7 3.4 7.5s4.2 3.4 7.5 3.4c10.2 0 15.6-8 11.8-17.3-.8-1.8-2.1-3.8-2.9-4.5-2.1-1.7-6.7-2.9-9.7-2.4z" />
          </Svg>
        </View>
        <Header
          style={{
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            backgroundColor: '#0d1d25',
            marginTop: StatusBar.currentHeight,
          }}
        >
          {
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                marginRight: 5,
              }}
              onPress={onChevronClick}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={40}
                color="white"
              />
            </TouchableOpacity>
          }
          <ProfilePic source={{ uri: photoUrl }} />
          <Title numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Title>
          <TouchableOpacity>
            <MaterialCommunityIcons
              style={{ marginRight: 10 }}
              name="camera-outline"
              size={30}
              color={'gray'}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Svg width="41" height="25" viewBox="0 0 41 25" fill="none">
              <Path
                d="M9.93351 1.07966C9.26051 1.13196 8.77347 1.24527 7.56915 1.62879C6.73675 1.899 5.76267 2.25638 5.3996 2.43942C3.68167 3.28492 2.09658 4.6011 1.85748 5.36815C1.76893 5.6645 1.77779 5.73424 1.93718 5.94343C2.06116 6.10904 2.2117 6.18749 2.42422 6.20493C2.68988 6.23107 2.76958 6.18749 2.94669 5.95215C3.92077 4.6534 5.45273 3.70331 7.8968 2.89268C9.03913 2.50915 9.31364 2.45686 10.3763 2.37841C12.3864 2.22151 12.7495 2.26509 13.8653 2.80551C14.9899 3.34593 15.6806 3.9648 16.2916 4.98462C16.8849 5.98701 17.2923 8.07896 17.1506 9.48231C17.0974 10.1186 17.0797 10.1622 16.9026 10.1186C16.7964 10.0925 16.2562 9.95299 15.6983 9.80481C14.3346 9.44744 13.5022 9.39514 12.2536 9.56947C10.146 9.87455 8.92401 10.3104 6.94928 11.4697C5.84237 12.1147 5.20479 12.6725 4.20414 13.8492C2.59247 15.732 1.67152 17.3445 1.19334 19.1053C0.759428 20.7352 1.0428 21.8771 2.17627 23.0189C2.8847 23.725 3.34517 23.8731 4.84172 23.8644C6.11688 23.8644 6.63934 23.7075 8.4104 22.8359C10.3763 21.8596 11.7754 20.866 13.4491 19.2273C15.5832 17.1441 16.9912 15.0521 17.6908 12.9079C17.8236 12.4895 17.9918 12.1495 18.045 12.1495C18.2398 12.1495 19.692 13.1519 20.2942 13.7011C21.3126 14.6163 22.7648 16.7692 23.6061 18.5997C24.4385 20.4214 24.7396 20.866 25.8553 21.9817C27.3962 23.5245 28.1223 23.908 29.548 23.9865C30.3273 24.0213 30.3804 24.0126 31.3013 23.664C32.0009 23.3937 32.3551 23.1933 32.6916 22.8969C33.9314 21.7986 34.7549 19.9246 35.118 17.3271C35.3482 15.6797 35.543 12.6115 35.5076 11.1646C35.4899 10.415 35.4987 9.7961 35.5253 9.7961C35.5607 9.7961 35.6936 9.91813 35.8441 10.0663C35.9858 10.2145 36.6234 10.7549 37.2521 11.2779C37.8897 11.7922 38.5361 12.3762 38.6955 12.5766C38.9346 12.8643 39.0409 12.934 39.28 12.934C39.891 12.934 40.0858 12.2716 39.6607 11.644C39.5456 11.4609 39.2091 11.1384 38.9257 10.9292C37.6152 9.94428 36.6411 9.04648 36.0655 8.27944C35.7378 7.84362 35.4102 7.44266 35.3394 7.38164C35.1622 7.24218 34.4627 7.00684 34.1882 7.00684C33.7454 7.00684 33.3381 7.6257 31.1685 11.6527C30.3273 13.2129 30.221 13.5616 30.5221 13.8928C30.708 14.0933 31.1597 14.1282 31.381 13.9538C31.5139 13.858 32.4968 12.2716 32.8244 11.6266C32.9041 11.4609 33.2229 10.9554 33.524 10.5196L34.0642 9.70893L34.1262 10.0402C34.2944 10.938 34.1085 14.9998 33.7985 17.1615C33.6568 18.1552 33.3646 19.4103 33.161 19.8984C32.9484 20.3953 32.3551 21.3628 32.0452 21.7115C31.8769 21.8945 31.4873 22.156 31.0977 22.3391C30.4955 22.618 30.3627 22.6528 29.6808 22.6528C28.6005 22.6528 28.1223 22.3914 26.8471 21.1013L25.8642 20.1251L24.8104 18.0331C22.9419 14.3548 21.6402 12.7858 19.1165 11.2169C18.3903 10.7549 18.3372 10.7026 18.3815 10.4847C18.6825 8.98547 18.408 6.32695 17.8059 5.01949C17.4162 4.17399 16.4599 2.86653 15.9285 2.483C15.2644 1.99488 14.246 1.4719 13.4579 1.21912C12.8735 1.02736 12.6432 0.992493 11.7754 1.00121C11.2264 1.00993 10.394 1.04479 9.93351 1.07966ZM14.556 10.8857C15.3707 11.0513 16.5041 11.3563 16.6547 11.4435C16.7521 11.5045 16.7255 11.6527 16.5307 12.2454C15.778 14.4855 14.7065 16.0981 12.5104 18.2598C11.0316 19.7154 9.98664 20.4999 8.46353 21.3279C6.28513 22.5134 5.21364 22.7923 3.91191 22.5134C3.32746 22.3914 2.92897 22.0514 2.58362 21.3715C2.24712 20.7004 2.23826 20.2907 2.5482 19.2534C2.97325 17.8065 3.62854 16.6298 4.86828 15.0957C6.19658 13.4483 6.89615 12.9079 9.03027 11.8532C10.7925 10.9815 13.0949 10.5806 14.556 10.8857Z"
                fill="gray"
                stroke="gray"
              />
            </Svg>
          </TouchableOpacity>
        </Header>
        <Animated.ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          ref={scrollViewRef}
          style={{
            backgroundColor: 'transparent',
            pointerEvents: 'auto',
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
              listener: (event) => {
                handleScroll(event)
              },
            }
          )}
        >
          {isDataLoaded && (
            <MaskedView
              maskElement={
                <View
                  onLayout={(ev) => setDimension(ev.nativeEvent.layout)}
                  style={{ backgroundColor: 'transparent' }}
                >
                  {messages.map((item) => (
                    <View key={item.id.toString()}>
                      <View style={{ width: '100%' }}>
                        <Image
                          style={{
                            position: 'absolute',
                            bottom: 5,
                            left: item.receiver ? 10 : width - 40,
                            right: item.receiver ? width - 40 : 0,
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                          }}
                          source={{
                            uri: 'https://wallpapercave.com/wp/wp1947053.jpg',
                          }}
                        />
                        <View
                          style={[
                            {
                              flexDirection: 'row',
                              alignItems: 'center',
                              alignContent: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 15,
                              padding: 10,
                              margin: 5,
                              marginHorizontal: 45,
                              borderRadius: 30,
                              borderBottomLeftRadius: item.receiver ? 0 : 30,
                              borderBottomRightRadius: item.receiver ? 30 : 0,
                              maxWidth: width * 0.7,
                              backgroundColor: 'red',
                              alignSelf: item.receiver
                                ? 'flex-start'
                                : 'flex-end',
                            },
                          ]}
                        >
                          <CustomText
                            style={{
                              justifyContent: 'center',
                              fontSize: 16,
                              fontWeight: 'normal',
                              color: 'white',
                              overflow: 'hidden',
                              opacity: 0,
                            }}
                          >
                            {item.text}
                          </CustomText>
                        </View>
                      </View>
                      <CustomText
                        style={{
                          fontSize: 9,
                          marginLeft: 10,
                          marginRight: 10,
                          zIndex: item.receiver ? -1 : 1, // only display the other messages above the gradient mask, we want to avoid gradient being applied to the other message other than own.
                          color: '#FFFFFF', // remove the background for my messages because we're using the gradient mask
                          alignSelf: item.receiver ? 'flex-start' : 'flex-end',
                        }}
                      >
                        {item.date.toDateString().split(' ')[2] +
                          ' ' +
                          item.date.toDateString().split(' ')[1] +
                          ' - ' +
                          item.date.getHours() +
                          ':' +
                          item.date.getMinutes()}
                      </CustomText>
                    </View>
                  ))}
                </View>
              }
            >
              <View style={{ height: dimension.height }}>
                <FlatList
                  scrollEnabled={false}
                  data={messages}
                  keyExtractor={(item) => item.id.toString()}
                  style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
                  removeClippedSubviews={false}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        <View style={{ width: '100%' }}>
                          <Image
                            style={{
                              position: 'absolute',
                              bottom: 5,
                              left: item.receiver ? 10 : width - 40,
                              right: item.receiver ? width - 40 : 0,
                              height: 30,
                              width: 30,
                              borderRadius: 15,
                            }}
                            source={{
                              uri: 'https://wallpapercave.com/wp/wp1947053.jpg',
                            }}
                          />
                          <View
                            style={[
                              {
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignContent: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 15,
                                padding: 10,
                                margin: 5,
                                borderRadius: 30,
                                marginHorizontal: 45,
                                borderBottomLeftRadius: item.receiver ? 0 : 30,
                                borderBottomRightRadius: item.receiver ? 30 : 0,
                                maxWidth: width * 0.7,
                                zIndex: item.receiver ? -1 : 1, // only display the other messages above the gradient mask, we want to avoid gradient being applied to the other message other than own.
                                backgroundColor: item.receiver
                                  ? '#616161'
                                  : 'transparent', // remove the background for my messages because we're using the gradient mask
                                alignSelf: item.receiver
                                  ? 'flex-start'
                                  : 'flex-end',
                              },
                            ]}
                          >
                            <CustomText
                              style={{
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 'normal',
                                color: item.receiver ? 'white' : 'white',
                                overflow: 'hidden',
                              }}
                            >
                              {item.text}
                            </CustomText>
                          </View>
                        </View>
                        <CustomText
                          style={[
                            {
                              marginLeft: 10,
                              marginRight: 10,
                              fontSize: 9,
                              zIndex: item.receiver ? -1 : 1, // only display the other messages above the gradient mask, we want to avoid gradient being applied to the other message other than own.
                              color: '#FFFFFF', // remove the background for my messages because we're using the gradient mask
                              alignSelf: item.receiver
                                ? 'flex-start'
                                : 'flex-end',
                            },
                          ]}
                        >
                          {item.date.toDateString().split(' ')[2] +
                            ' ' +
                            item.date.toDateString().split(' ')[1] +
                            ' - ' +
                            item.date.getHours() +
                            ':' +
                            item.date.getMinutes()}
                        </CustomText>
                      </View>
                    )
                  }}
                />
                <AnimatedLinearGradient
                  style={{
                    height,
                    transform: [
                      {
                        translateY: scrollY,
                      },
                    ],
                  }}
                  colors={['#FFDD00', '#FF2222']}
                />
              </View>
            </MaskedView>
          )}
        </Animated.ScrollView>
        <KeyboardAvoidingView>
          <Content style={{ backgroundColor: '#0d1d25' }}>
            <Write>
              <MaterialCommunityIcons
                style={{
                  paddingRight: 10,
                  paddingLeft: 10,
                }}
                name="image"
                size={18}
                color="#CCCDD3"
              />
              <Input
                value={inputText}
                onChangeText={setInputText}
                placeholder={i18n.t('inbox.chat.textPlaceHolder')}
                placeholderTextColor={'#CCCDD3'}
                style={{ height: '100%', color: 'white' }}
              />
              <TouchableOpacity onPress={sendMessage}>
                <MaterialCommunityIcons
                  style={{
                    paddingRight: 10,
                    paddingLeft: 10,
                  }}
                  name="send"
                  size={18}
                  color="#CCCDD3"
                />
              </TouchableOpacity>
            </Write>
          </Content>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
