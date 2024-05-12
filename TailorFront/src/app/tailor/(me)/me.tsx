import React, { useState, useEffect, useRef } from 'react'
import {
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { ElementControlBar, ReturnToFlicks } from '@/components'
import { Header } from '@/styles/community'

import {
  HeaderContainer,
  Container,
  Content,
  Title,
  Avatar,
  BackgroundImage,
  Username,
  Stats,
  StatsColumn,
  StatsNumber,
  StatsText,
  ProfileColumn,
  ProfileText,
  CtrlGridColumn,
  ControlBar,
  GradientBackground,
  ImageThumbnail,
  GradientMaskContainer,
  WhiteSquare,
} from '@/styles/meTailor'
import { useLocale } from '@/context/LocaleContext'
import { hexy } from '@/utils'

const Me: React.FC = () => {
  const { i18n } = useLocale()

  const [selectedTab, setSelectedTab] = useState('grid')
  const [dataSourceGrid, setDataSourceGrid] = useState([])
  const [dataSourceLiked, setDataSourceLiked] = useState([])
  const [dataSourceSaved, setDataSourceSaved] = useState([])
  const [dataSourceShow, setDataSourceShow] = useState([])

  const [isInitGrid, setIsInitGrid] = useState(false)
  const [isInitLiked, setIsInitLiked] = useState(false)
  const [isInitSaved, setIsInitSaved] = useState(false)

  const [username, setUsername] = useState('Tim MOREL')
  const [profileText, setProfileText] = useState("C'est tarpin drole")
  const [avatar, setAvatar] = useState(require('@/assets/images/avatar.png'))
  const [background, setBackground] = useState(
    require('@/assets/images/background.png')
  )
  const [stats, setStats] = useState([1950, 650, 950])

  function onGridClick() {
    if (!isInitGrid) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setDataSourceGrid(items)
      setIsInitGrid(true)
    }
    setDataSourceShow(dataSourceGrid)
    setSelectedTab('grid')
  }

  useEffect(() => {
    onGridClick()
  }, [])

  function onLikeClick() {
    if (!isInitLiked) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setDataSourceLiked(items)
      setIsInitLiked(true)
    }
    setDataSourceShow(dataSourceLiked)
    setSelectedTab('like')
  }

  function onSavedClick() {
    if (!isInitSaved) {
      let items = Array.apply(null, Array(10)).map((v, i) => {
        return {
          color: hexy(),
        }
      })
      setDataSourceSaved(items)
      setIsInitSaved(true)
    }
    setDataSourceShow(dataSourceSaved)
    setSelectedTab('saved')
  }

  useEffect(() => {
    if (isInitGrid) {
      setDataSourceShow(dataSourceGrid)
    }
  }, [isInitGrid, dataSourceGrid])

  useEffect(() => {
    if (isInitLiked) {
      setDataSourceShow(dataSourceLiked)
    }
  }, [isInitLiked, dataSourceLiked])

  useEffect(() => {
    if (isInitSaved) {
      setDataSourceShow(dataSourceSaved)
    }
  }, [isInitSaved, dataSourceSaved])

  const scrollViewRef = useRef(null)
  const [gradientMaskPosition, setGradientMaskPosition] = useState({
    x: 0,
    y: 0,
  })

  const backgroundImageRef = useRef(null)
  const [backgroundImagePosition, setBackgroundImagePosition] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    if (backgroundImageRef.current) {
      backgroundImageRef.current.measure((pageX: number, pageY: number) => {
        setBackgroundImagePosition({
          x: pageX,
          y: pageY / Dimensions.get('screen').height,
        })
      })
    }
  }, [backgroundImageRef.current])

  function onClick() {
    console.log('click')
  }

  return (
    <>
      <HeaderContainer>
        <Header>
          <ElementControlBar
            style={{ zIndex: 200, pointerEvents: 'auto' }}
            onPress={() => {}}
            name="menu"
            size={30}
            color="black"
            isSelected={true}
          />
          <Title>{i18n.t('me.title')}</Title>
          <ReturnToFlicks />
        </Header>
        <Container>
          <Content>
            <BackgroundImage source={background} />
            <GradientMaskContainer
              colors={['#0d1d25', 'transparent']}
              start={{ x: 0, y: backgroundImagePosition.y }}
              end={{ x: 0, y: backgroundImagePosition.y + 0.2 }}
            />
            <Stats>
              <Avatar source={avatar} />
              <StatsColumn>
                <StatsNumber>{stats[0]}</StatsNumber>
                <StatsText>Following</StatsText>
              </StatsColumn>
              <StatsColumn>
                <StatsNumber>{stats[1]}</StatsNumber>
                <StatsText>Followers</StatsText>
              </StatsColumn>
              <StatsColumn>
                <StatsNumber>{stats[2]}</StatsNumber>
                <StatsText>Likes</StatsText>
              </StatsColumn>
              <TouchableOpacity onPress={onClick}>
                <WhiteSquare>
                  <MaterialCommunityIcons
                    style={{ alignSelf: 'center', justifyContent: 'center' }}
                    name="pencil"
                    size={24}
                    color="#0d1d25"
                  />
                </WhiteSquare>
              </TouchableOpacity>
            </Stats>
            <ProfileColumn>
              <Username>{username}</Username>
              <ProfileText>{profileText}</ProfileText>
            </ProfileColumn>
          </Content>
          <GradientBackground
            colors={['#FF0000', '#FFFF00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ControlBar>
              <ElementControlBar
                onPress={onGridClick}
                name="dots-grid"
                size={30}
                color="white"
                isSelected={selectedTab === 'grid'}
              />
              <ElementControlBar
                onPress={onLikeClick}
                name="heart"
                size={30}
                color="white"
                isSelected={selectedTab === 'like'}
              />
              <ElementControlBar
                onPress={onSavedClick}
                name="bookmark"
                size={30}
                color="white"
                isSelected={selectedTab === 'saved'}
              />
            </ControlBar>
          </GradientBackground>
          <ScrollView
            collapsable={false}
            ref={scrollViewRef}
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
                style={{ paddingBottom: 500 }}
                scrollEnabled={false}
                data={dataSourceShow}
                renderItem={({ item }) => <ImageThumbnail color={item.color} />}
                numColumns={3}
              />
            </CtrlGridColumn>
          </ScrollView>
          <GradientMaskContainer
            colors={['#0d1d25', 'transparent']}
            start={{ x: 0, y: gradientMaskPosition.y - 0.1 }}
            end={{ x: 0, y: gradientMaskPosition.y }}
          />
        </Container>
      </HeaderContainer>
    </>
  )
}

export default Me
