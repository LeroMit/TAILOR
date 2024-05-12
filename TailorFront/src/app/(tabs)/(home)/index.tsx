import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Dimensions,
  FlatList,
  View,
  Animated,
  Easing,
  StatusBar,
} from 'react-native'
import { router, useFocusEffect } from 'expo-router'

import { Post, PostData } from '@/types'
import { PostSingle, BigButton } from '@/components'
import { Header } from '@/styles/home'

import axios from 'axios'
import { serverLocal } from '@/constants'
import Toast from 'react-native-toast-message'
import {
  CommentApi,
  FlicksApiResponse,
  MediaRef,
  TagApi,
  UserFlickRequest,
} from '@/utils'
import * as Location from 'expo-location'
import { useAuth } from '@/context/AuthContext'

const Home: React.FC = () => {
  const { authState } = useAuth()

  const [isActionBarOpen, setIsActionBarOpen] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isTab, setIsTab] = useState<boolean>(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPostIndex, setCurrentPostIndex] = useState<number>(0)
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)
  const maxPostIndexRef = useRef(currentPostIndex)

  const mediaRefs = useRef<Array<MediaRef>>([])
  const rotateValue = useRef(new Animated.Value(0)).current

  const fetchLocation = async () => {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.error('Permission to access location was denied')
      return
    }

    // Get the current location
    let location = await Location.getCurrentPositionAsync({})
    const { latitude, longitude } = location.coords
    console.log('Latitude: ', latitude)
    console.log('Longitude: ', longitude)
    setLatitude(latitude)
    setLongitude(longitude)
  }

  useFocusEffect(
    useCallback(() => {
      setIsTab(true) // When the screen gains focus, set isTab to true
      return () => {
        setIsTab(false) // When the screen loses focus, set isTab to false
      }
    }, [])
  )

  /**
   * This function is called when the viewable items change
   * in the FlatList. It will pause the video that is not
   * in view and play the video that is in view.
   */
  let currentPlayingIndex = null

  const onViewableItemsChanged = ({ viewableItems }) => {
    const newIndex = viewableItems.find((item) => item.isViewable)?.index

    if (newIndex !== undefined && newIndex !== currentPlayingIndex) {
      if (currentPlayingIndex !== null) {
        const cellToStop =
          mediaRefs.current[Object.keys(mediaRefs.current)[currentPlayingIndex]]
        if (cellToStop) {
          cellToStop.stop()
        }
      }
      const cellToPlay =
        mediaRefs.current[Object.keys(mediaRefs.current)[newIndex]]
      if (cellToPlay) {
        cellToPlay.play()
        currentPlayingIndex = newIndex
        setCurrentPostIndex(newIndex)
      }
    }
  }

  function onClick() {
    router.push('/tailor')
  }

  setInterval(fetchLocation, 7200000)

  useEffect(() => {
    mediaRefs.current.forEach((mediaRef) => {
      mediaRef?.mute(isMuted)
    })
  }, [isMuted])

  useEffect(() => {
    if (isTab) {
      mediaRefs.current[currentPostIndex]?.resume()
    } else {
      mediaRefs.current[currentPostIndex]?.pause()
    }
  }, [isTab])

  useEffect(() => {
    if (isPaused) {
      mediaRefs.current[currentPostIndex]?.pause()
    } else {
      mediaRefs.current[currentPostIndex]?.resume()
    }
  }, [isPaused])

  useEffect(() => {
    // Start the rotation animation
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 30000, // 5 seconds
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
    return () => {
      rotateValue.stopAnimation()
    }
  }, [rotateValue])

  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const fetchFlicks = async (nb: number) => {
    try {
      const response = await axios.post<FlicksApiResponse[]>(
        `${serverLocal}/api/user/${authState.id}/feed`,
        {
          nbVideos: nb,
          latitude: latitude,
          longitude: longitude,
          watchedAt: '2011-12-03T10:15:30.000+01:00',
        }
      )

      const postsArray: Post[] = []
      response.data.forEach((flick: any) => {
        const flicksApiResponse: FlicksApiResponse = {
          id: flick.id,
          title: flick.title,
          description: flick.description,
          url: flick.url,
          comments: flick.comments.map((comment: CommentApi) => ({
            id: comment.id,
            message: comment.message,
            postedBy: comment.postedBy,
            createdOn: new Date(comment.createdOn),
            updatedOn: new Date(comment.updatedOn),
          })),
          tags: flick.tags.map((tag: TagApi) => ({
            id: tag.id,
            label: tag.label,
            createdOn: new Date(tag.createdOn),
            updatedOn: new Date(tag.updatedOn),
          })),
          postedBy: flick.postedBy,
          createdOn: new Date(flick.createdOn),
          updatedOn: new Date(flick.updatedOn),
        }

        const post: Post = {
          id: flicksApiResponse.id,
          username: flicksApiResponse.postedBy.username,
          tags: flicksApiResponse.tags.map((tag) => tag.label),
          music: flicksApiResponse.url,
          likes: 0,
          comments: flicksApiResponse.comments.map((commentApi) => {
            return {
              id: commentApi.id,
              username: commentApi.postedBy.username,
              avatar: 'string',
              text: commentApi.message,
              likes: 0,
              replies: [],
              posted_ago: formatTimeDifference(
                commentApi.createdOn,
                new Date()
              ).toString(),
            }
          }),
          uri: flicksApiResponse.url,
        }
        postsArray.push(post)
      })
      setPosts((posts) => [...posts, ...postsArray])

      Toast.show({
        type: 'success',
        text1: 'Flicks fetched successfully',
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error: ' + error.message,
      })
    }
  }

  const [CurrentPostData, setCurrentPostData] = useState<PostData | null>(null)

  const postUserFlick = async () => {
    if (maxPostIndexRef.current > 0 && posts[maxPostIndexRef.current - 1]) {
      const lastSeenPost = posts[maxPostIndexRef.current - 1]
      try {
        // const response = await axios.post<UserFlickRequest>(
        //   `${serverLocal}/api/user/${authState.id}/flick/${lastSeenPost?.id || 1}`,
        //   console.log('lastSeenPost:', lastSeenPost),
        //   {
        //     idFlick: lastSeenPost?.id || 1,
        //     watchedDuring: 0.5,
        //     isYay: CurrentPostData?.isYay,
        //     isNay: CurrentPostData?.isNay,
        //     isLiked: CurrentPostData?.isLiked,
        //     isShared: CurrentPostData?.isShared,
        //     latitude: 45.75, //latitude,
        //     longitude: 4.85, //longitude,
        //     watchedAt: '2011-12-03T10:15:30+01:00', //new Date().toISOString(),
        //   }
        // )
        //console.log('Post info sent successfully:', response.data)
      } catch (error) {
        console.error('Failed to send post info:', error)
      }
    }
  }

  useEffect(() => {
    fetchFlicks(20)
  }, [])

  useEffect(() => {
    const isNearEnd = posts.length - currentPostIndex == 5
    if (isNearEnd) {
      fetchFlicks(10)
    }
  }, [currentPostIndex, posts.length])

  useEffect(() => {
    if (currentPostIndex > maxPostIndexRef.current) {
      maxPostIndexRef.current = currentPostIndex
      postUserFlick()
    }
  }, [currentPostIndex])

  /**
   * Renders a single post
   * @param item
   * @param index
   * @returns {void}
   */
  const renderItem = ({ item, index }: { item: Post; index: number }) => {
    return (
      <View
        style={{
          height:
            Dimensions.get('window').height + (StatusBar.currentHeight || 0),
          backgroundColor: 'black',
        }}
      >
        <PostSingle
          item={item}
          setCurrentPostData={setCurrentPostData}
          isActionBarOpen={isActionBarOpen}
          setIsActionBarOpen={setIsActionBarOpen}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          setIsPaused={setIsPaused}
          ref={(PostSingleRef: MediaRef) =>
            (mediaRefs.current[item.id] = PostSingleRef)
          }
        />
      </View>
    )
  }

  return (
    <>
      <Header>
        <BigButton
          rotationInterpolation={rotateInterpolation}
          onPress={onClick}
          text='"Nature"'
        />
      </Header>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <FlatList
          data={posts}
          windowSize={4}
          maxToRenderPerBatch={2}
          showsVerticalScrollIndicator={false}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          removeClippedSubviews
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={renderItem}
          pagingEnabled
          keyExtractor={(item) => item.id.toString()}
          decelerationRate={'normal'}
        />
      </View>
    </>
  )
}
export default Home

function formatTimeDifference(createdOn: Date, arg1: Date): string {
  throw new Error('Function not implemented.')
}
