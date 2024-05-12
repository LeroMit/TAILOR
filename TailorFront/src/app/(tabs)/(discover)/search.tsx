import React, { useEffect, useRef, useState } from 'react'
import { CustomText, RecentSearchList, TextControlBar } from '@/components'
import { SearchItem } from '@/types'
import { hexy } from '@/utils'
import {
  Container,
  ControlBar,
  CtrlGridColumn,
  GradientMaskContainer,
  Header,
  ImageThumbnail,
  Input,
  Search,
} from '@/styles/discover'
import {
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'

import { useLocale } from '@/context/LocaleContext'

export default function search() {
  const { i18n } = useLocale()

  const params = useLocalSearchParams()
  const { searchText, recent } = params
  const parsedRecent: SearchItem[] = JSON.parse('[' + recent + ']')
  const [search, setSearch] = useState<string>(searchText as string)
  const [selectedTab, setSelectedTab] = useState('accounts')
  const [dataSourceAccounts, setDataSourceAccounts] = useState([])
  const [dataSourceFlicksd, setDataSourceFlicksd] = useState([])
  const [dataSourceTags, setDataSourceTags] = useState([])
  const [dataSourceShow, setDataSourceShow] = useState([])

  const [isInitAccounts, setIsInitAccounts] = useState(false)
  const [isInitFlicksd, setIsInitFlicksd] = useState(false)
  const [isInitTags, setIsInitTags] = useState(false)

  const [isSearch, setIsSearch] = useState(false)
  const inputSearchRef = useRef<TextInput>()

  function onAccountsClick() {
    if (!isInitAccounts) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setDataSourceAccounts(items)
      setIsInitAccounts(true)
    }
    setDataSourceShow(dataSourceAccounts)
    setSelectedTab('accounts')
  }

  useEffect(() => {
    if (!isInitAccounts) {
      let items = Array.apply(null, Array(10)).map((v, i) => ({
        color: hexy(),
      }))
      setDataSourceAccounts(items)
      setIsInitAccounts(true)
    }
  }, [isInitAccounts])

  function onFlicksClick() {
    if (!isInitFlicksd) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setDataSourceFlicksd(items)
      setIsInitFlicksd(true)
    }
    setDataSourceShow(dataSourceFlicksd)
    setSelectedTab('flicks')
  }

  function onTagsClick() {
    if (!isInitTags) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setDataSourceTags(items)
      setIsInitTags(true)
    }
    setDataSourceShow(dataSourceTags)
    setSelectedTab('tags')
  }

  function handleSearch(text: string) {
    setSearch(text)
  }

  function handleCancelClick() {
    inputSearchRef.current?.blur()
    setIsSearch(false)
  }

  useEffect(() => {
    if (isInitAccounts) {
      setDataSourceShow(dataSourceAccounts)
    }
  }, [isInitAccounts, dataSourceAccounts])

  useEffect(() => {
    if (isInitFlicksd) {
      setDataSourceShow(dataSourceFlicksd)
    }
  }, [isInitFlicksd, dataSourceFlicksd])

  useEffect(() => {
    if (isInitTags) {
      setDataSourceShow(dataSourceTags)
    }
  }, [isInitTags, dataSourceTags])

  const [gradientMaskPosition, setGradientMaskPosition] = useState({
    x: 0,
    y: 0,
  })

  const [recentSearches, setRecentSearches] =
    useState<SearchItem[]>(parsedRecent)

  const addToRecentSearches = (search: string, type: 'found' | 'notFound') => {
    const newItem: SearchItem = { name: search, type: type }
    setRecentSearches([newItem, ...recentSearches])
  }

  const removeFromRecentSearches = (search: SearchItem) => {
    setRecentSearches(recentSearches.filter((item) => item !== search))
  }

  function onChevronClick() {
    router.back()
  }

  function onSearch(search: string) {
    addToRecentSearches(search, 'notFound')
    router.push({
      pathname: '/search',
      params: {
        searchText: search,
        recent:
          '{"name":"' +
          search +
          '","type":"notFound"},' +
          recentSearches.map((item) => JSON.stringify(item)).toString(),
      },
    })

    setSearch(searchText as string)
    setIsSearch(false)
  }

  return (
    <Container>
      <Header>
        {!isSearch && (
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
        )}
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
            ref={inputSearchRef}
            onFocus={() => setIsSearch(true)}
            placeholder={i18n.t('searchBar.placeholder')}
            placeholderTextColor={'#CCCDD3'}
            value={search}
            returnKeyType="search"
            onChangeText={(text) => handleSearch(text)}
            onSubmitEditing={() => onSearch(search)}
          />
        </Search>
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
              {i18n.t('searchBar.cancelButton')}
            </CustomText>
          </TouchableOpacity>
        )}
      </Header>
      {isSearch && search == '' && (
        <>
          <CustomText
            style={{
              color: 'white',
              marginStart: 10,
              fontSize: 25,
            }}
          >
            {i18n.t('searchBar.recentSearches')}
          </CustomText>
          <RecentSearchList
            recentSearches={recentSearches}
            onRemove={removeFromRecentSearches}
          />
        </>
      )}
      {isSearch && search != '' && (
        <>
          {/* TO DO : Quand le back sera opérationnel il faudra afficher les profils en base  selon la recherche */}
          {/* <AccoutSearchList search={search} onClick={onClick} /> */}
        </>
      )}
      {!isSearch && (
        <>
          <ControlBar>
            <TextControlBar
              onPress={onAccountsClick}
              text="Accounts"
              color="white"
              isSelected={selectedTab === 'accounts'}
            />
            <TextControlBar
              onPress={onFlicksClick}
              text="Flicks"
              color="white"
              isSelected={selectedTab === 'flicks'}
            />
            <TextControlBar
              onPress={onTagsClick}
              text="Tags"
              color="white"
              isSelected={selectedTab === 'tags'}
            />
          </ControlBar>
          <ScrollView
            collapsable={false}
            onLayout={({
              nativeEvent: {
                layout: { x, y, width: w, height: h },
              },
            }: LayoutChangeEvent) => {
              setGradientMaskPosition({
                x: x,
                y: y / Dimensions.get('screen').height,
              })
            }}
            style={{ zIndex: -2, pointerEvents: 'auto' }}
          >
            <CtrlGridColumn>
              <FlatList
                style={{ paddingBottom: 100 }}
                scrollEnabled={false}
                data={dataSourceShow}
                renderItem={({ item }) => <ImageThumbnail color={item.color} />}
                numColumns={3}
              />
            </CtrlGridColumn>
          </ScrollView>
          <GradientMaskContainer
            colors={['#0d1d25', 'transparent']}
            start={{ x: 0, y: gradientMaskPosition.y }}
            end={{ x: 0, y: gradientMaskPosition.y + 0.2 }}
          />
        </>
      )}
    </Container>
  )
}
