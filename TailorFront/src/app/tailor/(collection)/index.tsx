import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Dimensions,
  FlatList,
  View,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'

import {
  ElementControlBar,
  TagsBag,
  ReturnToFlicks,
  CustomText,
  GradientButton,
} from '@/components'

import {
  Header,
  Title,
  Content,
  TitleTailor,
  SubTitleTailor,
  ContainerEdit,
} from '@/styles/collection'

import { SafeAreaView } from 'react-native-safe-area-context'
import { DataCarouselItem, ItemProps, myTailorApi } from '@/types'
import { hexy } from '@/utils'
import { useLocale } from '@/context/LocaleContext'
import { router } from 'expo-router'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { serverLocal } from '@/constants'
import { useAuth } from '@/context/AuthContext'

const { width } = Dimensions.get('window')

const SPACING = width * 0.05
const ITEM_LENGTH = width * 0.8
const EMPTY_ITEM_LENGTH = (width - ITEM_LENGTH) / 2
const CURRENT_ITEM_TRANSLATE_Y = 48

const Collection: React.FC = () => {
  const { authState } = useAuth()
  const { i18n } = useLocale()

  const scrollX = useRef(new Animated.Value(0)).current

  const [data, setData] = useState<DataCarouselItem[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const fetchMyTailor = async () => {
    {
      try {
        const response = await axios.get(
          `${serverLocal}/api/user/${authState.id}/tailors`
        )

        const tailorList = response.data.map((item: myTailorApi) => ({
          id: item.id,
          name: item.title,
          isFavorite: item.isFavourite,
          tags: ['chien', 'chat', 'lion'],
          // TODO : recuperer les tags qui sont associés à un Tailor
        }))

        tailorList.unshift({ id: -1, name: '', tags: [] })
        tailorList.unshift({ id: -2, name: '', tags: [] })

        setData(handleReorderData(tailorList))
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

  useEffect(() => {
    fetchMyTailor()
  }, [])

  function handleReorderData(data: DataCarouselItem[]) {
    const firstItem = data.filter((item) => item.id === -1)

    const lastItem = data.filter((item) => item.id === -2)

    const favoriteItems = data.filter((item) => item.isFavorite)

    const remainingItems = data.filter(
      (item) => !item.isFavorite && item.id !== -1 && item.id !== -2
    )

    const sortedFavoriteItems = [...favoriteItems, ...remainingItems].sort(
      (a, b) => (b.isFavorite ? 1 : -1) - (a.isFavorite ? 1 : -1)
    )

    return [...firstItem, ...sortedFavoriteItems, ...lastItem]
  }

  const handleFavorite = useCallback(
    // TODO : creer un post sur l'api pour mettre à jour les favoris

    (item: DataCarouselItem) => {
      return () => {
        const newData = data.map((dataItem) => {
          if (dataItem.id === item.id) {
            return { ...dataItem, isFavorite: !dataItem.isFavorite }
          }
          return dataItem
        })
        setData(newData)
        Toast.show({
          type: 'info',
          text1: 'TODO',
          text2: 'Feature not implemented yet',
        })
      }
    },
    [data]
  )

  const renderItem = useCallback(
    ({ item, index }) => (
      <Item item={item} index={index} handleFavorite={handleFavorite} />
    ),
    [handleFavorite]
  )

  const Item = React.memo<ItemProps>(({ item, index, handleFavorite }) => {
    if (!item.name || item.tags.length === 0) {
      return <View style={{ width: EMPTY_ITEM_LENGTH }} />
    }

    const inputRange = [
      (index - 2) * ITEM_LENGTH,
      (index - 1) * ITEM_LENGTH,
      index * ITEM_LENGTH,
    ]

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [
        CURRENT_ITEM_TRANSLATE_Y * 2,
        CURRENT_ITEM_TRANSLATE_Y,
        CURRENT_ITEM_TRANSLATE_Y * 2,
      ],
      extrapolate: 'clamp',
    })

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.2, 1, 0.2],
      extrapolate: 'clamp',
    })

    const [capturedUri, setCapturedUri] = useState<string | null>(
      '/private/var/mobile/Containers/Data/Application/9B922110-8F18-4FE9-A3A1-B84796BF6BB8/tmp/ReactNative/CC100A42-FCE6-4FFA-8F95-A5B341447387.png'
    )

    const handleCapturedImage = (uri: string) => {
      setCapturedUri(uri)
    }

    return (
      <View
        style={{
          width: ITEM_LENGTH,
          alignContent: 'center',
          justifyContent: 'center',
          marginRight: index !== data.length - 2 ? SPACING : 0,
        }}
      >
        <Animated.View
          style={[
            {
              transform: [{ translateY }],
              alignContent: 'center',
              justifyContent: 'center',
              opacity,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: hexy(),
              width: ITEM_LENGTH,
              borderRadius: 30,
              flexDirection: 'column',
            }}
          >
            <View
              style={{
                padding: 20,
                width: '100%',
                alignContent: 'center',
                flexDirection: 'row',
              }}
            >
              <ElementControlBar
                style={{ zIndex: 200 }}
                onPress={handleFavorite(item)}
                name="star"
                size={30}
                color={item.isFavorite ? 'white' : 'grey'}
                isSelected={true}
              />
              <TitleTailor>{item.name}</TitleTailor>
              <ElementControlBar
                style={{ zIndex: 200 }}
                onPress={() => {}}
                name="delete"
                size={30}
                color="white"
                isSelected={true}
              />
            </View>
            <View
              style={{
                paddingTop: 0,
                padding: 20,
                alignContent: 'center',
                flexDirection: 'column',
              }}
            >
              <SubTitleTailor>Tags</SubTitleTailor>
              <ContainerEdit>
                <TagsBag tags={item.tags} canBeSelected={false} />
              </ContainerEdit>
            </View>
            <View
              style={{
                paddingTop: 0,
                padding: 20,
                alignContent: 'center',
                flexDirection: 'column',
              }}
            >
              <SubTitleTailor>
                {i18n.t('tailorModal.subtitle.edit')}
              </SubTitleTailor>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/tailor/edit',
                    params: {
                      capturedUri: capturedUri,
                    },
                  })
                }}
              >
                <ContainerEdit>
                  {capturedUri ? (
                    <Image
                      source={{ uri: capturedUri }}
                      style={{ width: '100%', height: 250 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <></>
                  )}
                </ContainerEdit>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingTop: 0,
                padding: 20,
                alignContent: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <ElementControlBar
                style={{ zIndex: 200 }}
                onPress={() => {}}
                name="dots-horizontal"
                size={30}
                color="white"
                isSelected={true}
              />
              <ElementControlBar
                style={{ zIndex: 200 }}
                onPress={() => {}}
                name="send"
                size={30}
                color="white"
                isSelected={true}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    )
  })

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
      <Header>
        <ElementControlBar
          style={{ zIndex: 200, pointerEvents: 'auto' }}
          onPress={() => {}}
          name=""
          size={30}
          color="black"
          isSelected={true}
        />
        <Title>{i18n.t('collection.title')}</Title>
        <ReturnToFlicks />
      </Header>

      <Content>
        {isDataLoaded &&
          (data.length <= 2 ? (
            <>
              <CustomText
                style={{ fontSize: 25, color: 'white', marginBottom: 20 }}
              >
                {i18n.t('collection.empty')}
              </CustomText>
              <GradientButton
                onPress={() => {
                  router.push({
                    pathname: '/tailor/edit',
                  })
                }}
                text={i18n.t('collection.add')}
                colors={['#FF0000', '#FFFF00']}
              />
            </>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={({ item, index }) => renderItem({ item, index })}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              maxToRenderPerBatch={2}
              contentContainerStyle={{
                alignItems: 'flex-start',
                marginVertical:
                  Platform.OS !== 'ios' ? 0 : CURRENT_ITEM_TRANSLATE_Y,
              }}
              bounces={false}
              decelerationRate={0}
              renderToHardwareTextureAndroid
              snapToInterval={ITEM_LENGTH + SPACING}
              windowSize={6}
              snapToAlignment="start"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
            />
          ))}
      </Content>
    </SafeAreaView>
  )
}

export default Collection
