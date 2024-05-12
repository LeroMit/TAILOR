import React, { useState, useEffect, useRef } from 'react'
import {
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  LayoutChangeEvent,
  TextInput,
} from 'react-native'

import { useLocale } from '@/context/LocaleContext'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { CustomText, RecentSearchList, TextControlBar } from '@/components'
import { hexy } from '@/utils'
import { SearchItem } from '@/types'

import {
  Container,
  Header,
  CtrlGridColumn,
  ControlBar,
  ImageThumbnail,
  GradientMaskContainer,
  Search,
  Input,
} from '@/styles/discover'

import { LinearGradient, Path, Rect, Stop, Svg } from 'react-native-svg'
import MaskedView from '@react-native-masked-view/masked-view'
import { router } from 'expo-router'

const Discover: React.FC = () => {
  const { i18n } = useLocale()

  const [selectedTab, setSelectedTab] = useState('forMe')
  const [dataSourceAccounts, setdataSourceAccounts] = useState([])
  const [dataSourceFlicks, setdataSourceFlicks] = useState([])
  const [dataSourceTags, setdataSourceTags] = useState([])
  const [dataSourceShow, setDataSourceShow] = useState([])

  const [isInitForMe, setisInitForMe] = useState(false)
  const [isInitTrending, setisInitTrending] = useState(false)
  const [isInitTag, setisInitTag] = useState(false)

  const [search, setSearch] = useState('')

  const [isSearch, setIsSearch] = useState(false)
  const inputSearchRef = useRef<TextInput>(null)

  function onForMeClick() {
    if (!isInitForMe) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setdataSourceAccounts(items)
      setisInitForMe(true)
    }
    setDataSourceShow(dataSourceAccounts)
    setSelectedTab('forMe')
  }

  useEffect(() => {
    onForMeClick()
  }, [])

  function onTrendingClick() {
    if (!isInitTrending) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setdataSourceFlicks(items)
      setisInitTrending(true)
    }
    setDataSourceShow(dataSourceFlicks)
    setSelectedTab('trending')
  }

  function onTagClick() {
    if (!isInitTag) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setdataSourceTags(items)
      setisInitTag(true)
    }
    setDataSourceShow(dataSourceTags)
    setSelectedTab('tag')
  }

  function handleSearch(text: string) {
    setSearch(text)
  }

  function handleCancelClick() {
    inputSearchRef.current?.blur()
    setIsSearch(false)
  }

  useEffect(() => {
    if (isInitForMe) {
      setDataSourceShow(dataSourceAccounts)
    }
  }, [isInitForMe, dataSourceAccounts])

  useEffect(() => {
    if (isInitTrending) {
      setDataSourceShow(dataSourceFlicks)
    }
  }, [isInitTrending, dataSourceFlicks])

  useEffect(() => {
    if (isInitTag) {
      setDataSourceShow(dataSourceTags)
    }
  }, [isInitTag, dataSourceTags])

  const [gradientMaskPosition, setGradientMaskPosition] = useState({
    x: 0,
    y: 0,
  })

  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([
    { name: 'Ariana Grande', type: 'notFound' },
    { name: 'Evann Guillot', type: 'notFound' },
    { name: 'Marian Scuturicci', type: 'notFound' },
    { name: 'le_rom', chosen: 'Tim Morel', followed: true, type: 'found' },
  ])

  const addToRecentSearches = (search: string, type: 'found' | 'notFound') => {
    const newItem: SearchItem = { name: search, type: type }
    setRecentSearches([newItem, ...recentSearches])
  }

  const removeFromRecentSearches = (search: SearchItem) => {
    setRecentSearches(recentSearches.filter((item) => item !== search))
  }

  function onClick() {
    console.log('click')
  }

  function onSearch(search: string) {
    addToRecentSearches(search, 'notFound')

    const recentSearchesData = recentSearches.map((item) => ({
      name: item.name,
      type: item.type,
    }))
    const recentParam = {
      name: search,
      recentSearches: recentSearchesData,
    }

    router.push({
      pathname: '/search',
      params: {
        searchText: search,
        recent: JSON.stringify(recentParam),
      },
    })

    setSearch('')
    setIsSearch(false)
  }

  return (
    <Container>
      <Header>
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
            placeholder={i18n.t('discover.search.placeholder')}
            placeholderTextColor={'#CCCDD3'}
            value={search}
            returnKeyType="search"
            onChangeText={(text) => handleSearch(text)}
            onSubmitEditing={() => onSearch(search)}
          />
        </Search>
        {!isSearch && (
          <TouchableOpacity
            onPress={onClick}
            style={{
              alignSelf: 'center',
              width: 30,
              aspectRatio: 1,
            }}
          >
            <MaskedView
              style={{
                flex: 1,
                height: '100%',
                width: '100%',
              }}
              maskElement={
                <Svg width="41" height="25" viewBox="0 0 41 25" fill="none">
                  <LinearGradient
                    id="paint0_linear_305_241"
                    x1="1"
                    y1="12.5"
                    x2="39.8883"
                    y2="12.5"
                  >
                    <Stop stop-color="#FF0000" />
                    <Stop offset="1" stop-color="#FFFF00" />
                  </LinearGradient>
                  <LinearGradient
                    id="paint1_linear_305_241"
                    x1="1"
                    y1="12.5"
                    x2="39.8883"
                    y2="12.5"
                  >
                    <Stop stop-color="#FF0000" />
                    <Stop offset="1" stop-color="#FFFF00" />
                  </LinearGradient>
                  <Path
                    d="M9.93351 1.07966C9.26051 1.13196 8.77347 1.24527 7.56915 1.62879C6.73675 1.899 5.76267 2.25638 5.3996 2.43942C3.68167 3.28492 2.09658 4.6011 1.85748 5.36815C1.76893 5.6645 1.77779 5.73424 1.93718 5.94343C2.06116 6.10904 2.2117 6.18749 2.42422 6.20493C2.68988 6.23107 2.76958 6.18749 2.94669 5.95215C3.92077 4.6534 5.45273 3.70331 7.8968 2.89268C9.03913 2.50915 9.31364 2.45686 10.3763 2.37841C12.3864 2.22151 12.7495 2.26509 13.8653 2.80551C14.9899 3.34593 15.6806 3.9648 16.2916 4.98462C16.8849 5.98701 17.2923 8.07896 17.1506 9.48231C17.0974 10.1186 17.0797 10.1622 16.9026 10.1186C16.7964 10.0925 16.2562 9.95299 15.6983 9.80481C14.3346 9.44744 13.5022 9.39514 12.2536 9.56947C10.146 9.87455 8.92401 10.3104 6.94928 11.4697C5.84237 12.1147 5.20479 12.6725 4.20414 13.8492C2.59247 15.732 1.67152 17.3445 1.19334 19.1053C0.759428 20.7352 1.0428 21.8771 2.17627 23.0189C2.8847 23.725 3.34517 23.8731 4.84172 23.8644C6.11688 23.8644 6.63934 23.7075 8.4104 22.8359C10.3763 21.8596 11.7754 20.866 13.4491 19.2273C15.5832 17.1441 16.9912 15.0521 17.6908 12.9079C17.8236 12.4895 17.9918 12.1495 18.045 12.1495C18.2398 12.1495 19.692 13.1519 20.2942 13.7011C21.3126 14.6163 22.7648 16.7692 23.6061 18.5997C24.4385 20.4214 24.7396 20.866 25.8553 21.9817C27.3962 23.5245 28.1223 23.908 29.548 23.9865C30.3273 24.0213 30.3804 24.0126 31.3013 23.664C32.0009 23.3937 32.3551 23.1933 32.6916 22.8969C33.9314 21.7986 34.7549 19.9246 35.118 17.3271C35.3482 15.6797 35.543 12.6115 35.5076 11.1646C35.4899 10.415 35.4987 9.7961 35.5253 9.7961C35.5607 9.7961 35.6936 9.91813 35.8441 10.0663C35.9858 10.2145 36.6234 10.7549 37.2521 11.2779C37.8897 11.7922 38.5361 12.3762 38.6955 12.5766C38.9346 12.8643 39.0409 12.934 39.28 12.934C39.891 12.934 40.0858 12.2716 39.6607 11.644C39.5456 11.4609 39.2091 11.1384 38.9257 10.9292C37.6152 9.94428 36.6411 9.04648 36.0655 8.27944C35.7378 7.84362 35.4102 7.44266 35.3394 7.38164C35.1622 7.24218 34.4627 7.00684 34.1882 7.00684C33.7454 7.00684 33.3381 7.6257 31.1685 11.6527C30.3273 13.2129 30.221 13.5616 30.5221 13.8928C30.708 14.0933 31.1597 14.1282 31.381 13.9538C31.5139 13.858 32.4968 12.2716 32.8244 11.6266C32.9041 11.4609 33.2229 10.9554 33.524 10.5196L34.0642 9.70893L34.1262 10.0402C34.2944 10.938 34.1085 14.9998 33.7985 17.1615C33.6568 18.1552 33.3646 19.4103 33.161 19.8984C32.9484 20.3953 32.3551 21.3628 32.0452 21.7115C31.8769 21.8945 31.4873 22.156 31.0977 22.3391C30.4955 22.618 30.3627 22.6528 29.6808 22.6528C28.6005 22.6528 28.1223 22.3914 26.8471 21.1013L25.8642 20.1251L24.8104 18.0331C22.9419 14.3548 21.6402 12.7858 19.1165 11.2169C18.3903 10.7549 18.3372 10.7026 18.3815 10.4847C18.6825 8.98547 18.408 6.32695 17.8059 5.01949C17.4162 4.17399 16.4599 2.86653 15.9285 2.483C15.2644 1.99488 14.246 1.4719 13.4579 1.21912C12.8735 1.02736 12.6432 0.992493 11.7754 1.00121C11.2264 1.00993 10.394 1.04479 9.93351 1.07966ZM14.556 10.8857C15.3707 11.0513 16.5041 11.3563 16.6547 11.4435C16.7521 11.5045 16.7255 11.6527 16.5307 12.2454C15.778 14.4855 14.7065 16.0981 12.5104 18.2598C11.0316 19.7154 9.98664 20.4999 8.46353 21.3279C6.28513 22.5134 5.21364 22.7923 3.91191 22.5134C3.32746 22.3914 2.92897 22.0514 2.58362 21.3715C2.24712 20.7004 2.23826 20.2907 2.5482 19.2534C2.97325 17.8065 3.62854 16.6298 4.86828 15.0957C6.19658 13.4483 6.89615 12.9079 9.03027 11.8532C10.7925 10.9815 13.0949 10.5806 14.556 10.8857Z"
                    fill="url(#paint0_linear_305_241)"
                    stroke="url(#paint1_linear_305_241)"
                  />
                </Svg>
              }
            >
              <Svg width="50" height="50" viewBox="0 0 200 200" fill="none">
                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="red" />
                  <Stop offset="1" stopColor="yellow" />
                </LinearGradient>
                <Rect
                  x="0"
                  y="0"
                  width="200"
                  height="200"
                  fill="url(#grad)"
                  stroke="black"
                  strokeWidth="2"
                />
              </Svg>
            </MaskedView>
          </TouchableOpacity>
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
              {i18n.t('discover.search.cancelButton')}
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
            {i18n.t('discover.search.recentSearches')}
          </CustomText>
          <RecentSearchList
            recentSearches={recentSearches}
            onRemove={removeFromRecentSearches}
          />
        </>
      )}
      {isSearch && search != '' && (
        <>
          {/* TO DO : Quand le back sera opérationnel il faudra afficher les profils en base selon la recherche */}
          {/* <AccoutSearchList search={search} onClick={onClick} /> */}
        </>
      )}
      {!isSearch && (
        <>
          <ControlBar>
            <TextControlBar
              onPress={onForMeClick}
              text="For me"
              color="white"
              isSelected={selectedTab === 'forMe'}
            />
            <TextControlBar
              onPress={onTrendingClick}
              text="Trending"
              color="white"
              isSelected={selectedTab === 'trending'}
            />
            <TextControlBar
              onPress={onTagClick}
              text='"Nature"'
              color="white"
              isSelected={selectedTab === 'tag'}
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

export default Discover
