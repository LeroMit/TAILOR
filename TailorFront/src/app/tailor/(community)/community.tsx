import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import axios from 'axios'
import { useNavigation } from 'expo-router'
import { useLocale } from '@/context/LocaleContext'
import { AntDesign } from '@expo/vector-icons'

import {
  Container,
  Title,
  Header,
  Input,
  Content,
  SearchBar,
} from '@/styles/community'

import {
  CustomText,
  ElementControlBar,
  RecentSearchList,
  ReturnToFlicks,
  ItemTailor,
} from '@/components'

import { SearchTagItem, TailorItem, myTailorApi } from '@/types'
import { serverLocal } from '@/constants'
import Toast from 'react-native-toast-message'

const Community: React.FC = () => {
  const { i18n } = useLocale()
  const [isSearch, setIsSearch] = useState(false)
  const [search, setSearch] = useState('')
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [dataTailor, setDataTailor] = useState<TailorItem[]>([])
  const inputSearchRef = useRef<TextInput>(null)

  const fetchCommunity = async () => {
    {
      try {
        // TODO : recuperer non pas tous les tailors mais que 10 random
        const response = await axios.get(`${serverLocal}/api/tailors`)

        const tailorList = response.data.map((item: myTailorApi) => ({
          id: item.id,
          name: item.title,
          tags: ['chat', 'chien', 'lion'],
          profilePicture: item.createdBy.photoUrl,
          creator: item.createdBy.username,
          // TODO : recuperer les tags qui sont associés à un Tailor
        }))

        setDataTailor(tailorList)
        setIsDataLoaded(true)
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error ',
          text2: error.message,
        })
      }
    }
  }

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCommunity()
    })

    return unsubscribe
  }, [navigation])

  function handleCancelClick() {
    inputSearchRef.current?.blur()
    setIsSearch(false)
  }

  const handleSearch = (text: string) => {
    setSearch(text)
  }

  // TODO : creer un get recentSearches dans l'api
  const [recentSearches, setRecentSearches] = useState<SearchTagItem[]>([
    { name: 'Cat', type: 'tailor' },
    { name: 'Dogs', type: 'tailor' },
    { name: 'Cute', type: 'tailor' },
  ])

  const addToRecentSearches = (search: string) => {
    const newItem: SearchTagItem = { name: search, type: 'tailor' }
    setRecentSearches([newItem, ...recentSearches])
  }

  const removeFromRecentSearches = (search: SearchTagItem) => {
    setRecentSearches(recentSearches.filter((item) => item !== search))
  }

  function onSearch(search: string) {
    addToRecentSearches(search)

    const recentSearchesData = recentSearches.map((item) => ({
      name: item.name,
      type: item.type,
    }))
    const recentParam = {
      name: search,
      recentSearches: recentSearchesData,
    }

    // TODO : post API pour avoir les tailors qui correspondent à la recherche

    setSearch('')
    setIsSearch(false)
  }

  return (
    <Container>
      <Header>
        <ElementControlBar
          style={{ zIndex: 200, pointerEvents: 'auto' }}
          onPress={() => {}}
          name=""
          size={30}
          color="black"
          isSelected={true}
        />
        <Title>{i18n.t('community.title')}</Title>
        <ReturnToFlicks />
      </Header>

      <Content>
        <SearchBar>
          <AntDesign
            style={{
              paddingRight: 10,
            }}
            name="search1"
            size={18}
            color="#838383"
          />
          <Input
            ref={inputSearchRef}
            onFocus={() => setIsSearch(true)}
            placeholder={i18n.t('community.searchPlaceholder')}
            placeholderTextColor={'#bfc3d3'}
            value={search}
            returnKeyType="search"
            onChangeText={(text) => handleSearch(text)}
            onSubmitEditing={() => onSearch(search)}
          />
          {!isSearch && (
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                width: 30,
                aspectRatio: 1,
              }}
            ></TouchableOpacity>
          )}
          {isSearch && (
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}
              onPress={handleCancelClick}
            >
              <CustomText
                style={{
                  color: 'white',
                  alignSelf: 'center',
                  fontSize: 20,
                }}
              >
                {i18n.t('community.cancelButton')}
              </CustomText>
            </TouchableOpacity>
          )}
        </SearchBar>
        {isSearch && search == '' && (
          <>
            <CustomText
              style={{
                color: 'white',
                marginStart: 10,
                fontSize: 25,
              }}
            >
              {i18n.t('community.recentSearches')}
            </CustomText>
            <RecentSearchList
              recentSearches={recentSearches}
              onRemove={removeFromRecentSearches}
            />
          </>
        )}
        {!isSearch && (
          <FlatList
            data={dataTailor}
            style={{
              marginBottom:
                Platform.OS === 'ios'
                  ? 40
                  : Dimensions.get('window').height * 0.095,
            }}
            renderItem={({ item, index }) => (
              <ItemTailor item={item} index={index} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </Content>
    </Container>
  )
}

export default Community
