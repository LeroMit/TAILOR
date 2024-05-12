import React, { useState, useEffect, useRef } from 'react'
import {
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { ElementControlBar } from '@/components'

import {
  Container,
  Header,
  Title,
  Content,
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
} from '@/styles/me'

import { hexy } from '@/utils'
import Toast from 'react-native-toast-message'

import axios from 'axios'
import { serverLocal } from '@/constants'
import { useAuth } from '@/context/AuthContext'

const Me: React.FC = () => {
  const { authState } = useAuth()

  const [selectedTab, setSelectedTab] = useState('grid')
  const [dataSourceGrid, setDataSourceGrid] = useState([])
  const [dataSourceLiked, setDataSourceLiked] = useState([])
  const [dataSourceSaved, setDataSourceSaved] = useState([])
  const [dataSourceShow, setDataSourceShow] = useState([])

  const [isInitGrid, setIsInitGrid] = useState(false)
  const [isInitLiked, setIsInitLiked] = useState(false)
  const [isInitSaved, setIsInitSaved] = useState(false)

  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profileText, setProfileText] = useState('')
  const [avatar, setAvatar] = useState(require('@/assets/images/avatar.png'))
  const [background, setBackground] = useState(
    require('@/assets/images/background.png')
  )
  const [stats, setStats] = useState([1950, 650, 950])
  const [flicks, setFlicks] = useState([
    'flicks1',
    'flicks2',
    'flicks3',
    'flicks4',
    'flicks5',
    'flicks6',
    'flicks7',
    'flicks8',
    'flicks9',
    'flicks10',
  ])
  const [flicksLiked, setFlicksLiked] = useState([
    'flicksLiked1',
    'flicksLiked2',
    'flicksLiked3',
    'flicksLiked4',
    'flicksLiked5',
  ])

  function fetchUserData() {
    axios
      .get(serverLocal + '/api/user/' + authState.id)
      .then((response) => {
        console.log(response.data)
        setUsername(response.data.username)
        setProfileText(response.data.bio)
        setAvatar(response.data.photoUrl)
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setFlicks(response.data.flicks)
        setIsInitGrid(false)

        // TODO
        //setFlicksLiked(response.data.flicksLiked)
        //setIsInitLiked(false)
      })
      .catch((error) =>
        Toast.show({
          type: 'error',
          text1: 'Error ' + error.message,
        })
      )
  }

  function onGridClick() {
    if (!isInitGrid) {
      let items = Array.apply(null, flicks).map((v, i) => {
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
    fetchUserData()
  }, [])

  useEffect(() => {
    onGridClick()
  }, [isInitGrid])

  function onLikeClick() {
    if (!isInitLiked) {
      let items = Array.apply(null, flicksLiked).map((v, i) => {
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
    <Container>
      <Header>
        <Title>{username}</Title>
        <ElementControlBar
          style={{ zIndex: 200, pointerEvents: 'auto' }}
          onPress={onGridClick}
          name="dots-horizontal"
          size={30}
          color="white"
          isSelected={true}
        />
      </Header>
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
          <Username>
            {firstName} {lastName}
          </Username>
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
    </Container>
  )
}

export default Me
