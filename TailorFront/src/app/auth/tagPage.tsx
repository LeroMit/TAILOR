import React, { useEffect, useState } from 'react'
import { Header, Title } from '@/styles/discover'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import {
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import axios from 'axios'
import { serverLocal } from '@/constants'

import { CustomText, ElementControlBar } from '@/components'
import { router, useLocalSearchParams } from 'expo-router'
import Toast from 'react-native-toast-message'
import { useLocale } from '@/context/LocaleContext'
import RegisterTagsBag from '@/components/RegisterTagsBag'
import { Tag } from '@/types'

const TagPage = () => {
  const params = useLocalSearchParams()
  const { email, password, confirmPassword, firstName, lastName, username } =
    params
  const { i18n } = useLocale()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const mapLabelsToIds = (labels: string[]) => {
    const tagsIds: number[] = []
    tags.forEach((tag) => {
      if (labels.includes(tag.label)) {
        tagsIds.push(tag.id)
      }
    })
    return tagsIds
  }

  useEffect(() => {
    fetchTags(false)
  }, [])

  const fetchTags = async (erase: boolean) => {
    try {
      const response = await axios.get(`${serverLocal}/api/tags`)

      if (erase) {
        setTags(() => [])
      }

      response.data.forEach((tag: Tag) => {
        setTags((tags) => [tag, ...tags])
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Unable to fetch tags.',
      })
    }
  }

  const postMessage = async () => {
    try {
      const response = await axios.post(`${serverLocal}/api/user`, {
        email: email,
        password: password,
        passwordConf: confirmPassword,
        firstName: firstName,
        lastName: lastName,
        username: username,
        defaultTagsIds: mapLabelsToIds(selectedTags),
      })
      console.log(response.status)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error ' + error.message,
      })
    }
  }

  const handleSignUp = async () => {
    console.log(selectedTags.length)
    if (selectedTags.length != 5) {
      Toast.show({
        type: 'error',
        text1: 'You need to select 5 tags to continue.',
      })
    } else {
      await postMessage()
      router.replace('/auth')
    }
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#0D1D25',
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingTop: getStatusBarHeight(Platform.OS === 'ios'),
      }}
    >
      <Header>
        <ElementControlBar
          style={{ zIndex: 200 }}
          onPress={() => {
            router.back()
          }}
          name="arrow-left"
          size={30}
          color="white"
          isSelected={true}
        />
        <Title>{i18n.t('signup.title')}</Title>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 1,
          }}
          onPress={() => handleSignUp()}
        >
          <MaterialCommunityIcons
            name="check-bold"
            size={20}
            color="black"
            style={{ marginRight: 5 }}
          />
          <CustomText>Sign up</CustomText>
        </TouchableOpacity>
      </Header>
      <CustomText style={{ color: 'white', fontSize: 20, marginTop: 20 }}>
        {i18n.t('signup.tagSelection')}
      </CustomText>
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
        <RegisterTagsBag
          tags={tags}
          canBeSelected={true}
          onTagPress={() => {}}
          setterSelectedTags={setSelectedTags}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default TagPage
