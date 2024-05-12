import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { View, Animated, Dimensions, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Video, AVPlaybackStatusSuccess, ResizeMode } from 'expo-av'

import PostOverlay from './PostOverlay'
import CustomText from './CustomText'

import { CardItemHandle, TinderCard } from 'rn-tinder-card'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Svg, { Path } from 'react-native-svg'

import { PostSingleProps, PostData } from '@/types'
import { bucketServer } from '@/constants'

/**
 * This component is responsible for displaying a post and play the
 * media associated with it.
 *
 * The ref is forwarded to this component so that the parent component
 * can manage the play status of the video.
 */
export const PostSingle: React.FC<PostSingleProps> = forwardRef(
  (
    {
      item,
      setCurrentPostData,
      isActionBarOpen,
      setIsActionBarOpen,
      isMuted,
      setIsMuted,
      setIsPaused,
    },
    parentRef
  ) => {
    const ref = useRef<Video>(null)
    useImperativeHandle(parentRef, () => ({
      play,
      pause,
      resume,
      mute,
      stop,
      unload,
    }))

    useEffect(() => {
      const cleanup = () => {
        const cleanupAsync = async () => {
          await unload()
        }
        cleanupAsync()
      }

      return cleanup
    }, [])

    const [watchingTimeNormalized, setWatchingTimeNormalized] =
      useState<number>(0)

    /**
     * Plays the video in the component if the ref
     * of the video is not null.
     *
     * @returns {void}
     */
    const play = async () => {
      if (ref.current == null) {
        return
      }

      // if video is already playing return
      const status =
        (await ref.current.getStatusAsync()) as AVPlaybackStatusSuccess
      if (status?.isPlaying) {
        return
      }
      try {
        await ref.current.playAsync()
      } catch (e) {
        console.log(e)
      }
    }

    /**
     * Pauses the video in the component if the ref
     * of the video is not null.
     *
     * @returns {void}
     */
    const pause = async () => {
      if (ref.current == null) {
        return
      }

      // if video is already paused return
      const status =
        (await ref.current.getStatusAsync()) as AVPlaybackStatusSuccess
      if (!status?.isPlaying) {
        return
      }
      try {
        await ref.current.pauseAsync()
      } catch (e) {
        console.log(e)
      }
    }

    /**
     * Resumes the video in the component if the ref
     * of the video is not null.
     *
     * @returns {void}
     */
    const resume = async () => {
      if (ref.current == null) {
        return
      }

      // if video is already playing return
      const status =
        (await ref.current.getStatusAsync()) as AVPlaybackStatusSuccess
      if (status?.isPlaying) {
        return
      }
      try {
        await ref.current.playAsync()
      } catch (e) {
        console.log(e)
      }
    }

    /**
     * Stops the video in the component if the ref
     * of the video is not null.
     *
     * @returns {void}
     */
    const stop = async () => {
      if (ref.current == null) {
        return
      }

      // if video is already stopped return
      const status =
        (await ref.current.getStatusAsync()) as AVPlaybackStatusSuccess
      if (!status?.isPlaying) {
        return
      }
      try {
        await ref.current.stopAsync()
      } catch (e) {
        console.log(e)
      }
    }

    /**
     *
     * Mutes the video in the component if the ref
     * of the video is not null.
     *
     * @param mute
     * @returns {void}
     */
    const mute = async (mute: boolean) => {
      if (ref.current == null) {
        return
      }

      try {
        await ref.current.setIsMutedAsync(mute)
      } catch (e) {
        console.log(e)
      }
    }

    /**
     * Unloads the video in the component if the ref
     * of the video is not null.
     *
     * This will make sure unnecessary video instances are
     * not in memory at all times
     *
     * @returns {void}
     */
    const unload = async () => {
      if (ref.current == null) {
        return
      }

      // if video is already stopped return
      try {
        await ref.current.unloadAsync()
      } catch (e) {
        console.log(e)
      }
    }

    const handlePlaybackStatusUpdate = (status) => {
      // if (status.isLoaded) {
      //   setWatchingTimeNormalized(
      //     status.positionMillis / status.durationMillis || 0
      //   )
      // }
    }

    const [isYay, setIsYay] = useState<boolean>(false)
    const [isNay, setIsNay] = useState<boolean>(false)
    const [isShared, setIsShared] = useState<boolean>(false)
    const [isLiked, setIsLiked] = useState<boolean>(false)

    useEffect(() => {
      setCurrentPostData((item) => {
        let myPostData: PostData = {
          id: item?.id,
          isLiked: isLiked,
          isShared: isShared,
          isYay: isYay,
          isNay: isNay,
          watchingTime: watchingTimeNormalized,
        }
        return myPostData
      })
    }, [item, isLiked, isShared, isYay, isNay, watchingTimeNormalized])

    const nayOpacity = useRef(new Animated.Value(0.5)).current
    const yayOpacity = useRef(new Animated.Value(0.5)).current

    const nayScale = useRef(new Animated.Value(1)).current // Initial scale
    const yayScale = useRef(new Animated.Value(1)).current // Initial scale

    const nayAnimation = () => {
      // Nay animations
      Animated.parallel([
        Animated.timing(nayScale, {
          toValue: 1.7,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(nayOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(yayScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(yayOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }

    const yayAnimation = () => {
      Animated.parallel([
        Animated.timing(yayScale, {
          toValue: 2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(yayOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(nayScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(nayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }

    const resetYayNay = () => {
      setIsYay(false)
      setIsNay(false)

      Animated.parallel([
        Animated.timing(yayScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(yayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(nayScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(nayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }

    const resetYayNayOrHandleYay = () => {
      if (isYay || isNay) {
        resetYayNay()
      } else {
        setIsYay(true)
        yayAnimation()
      }
    }

    const resetYayNayOrHandleNay = () => {
      if (isYay || isNay) {
        resetYayNay()
      } else {
        setIsNay(true)
        nayAnimation()
      }
    }

    const OverlayRight = () => {
      return (
        <View
          style={{
            backgroundColor: 'orange',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CustomText style={{ color: 'white', fontSize: 32 }} weight="bold">
            Yay
          </CustomText>
        </View>
      )
    }
    const OverlayLeft = () => {
      return (
        <View
          style={{
            backgroundColor: 'red',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CustomText style={{ color: 'white', fontSize: 32 }} weight="bold">
            Nay
          </CustomText>
        </View>
      )
    }

    const data = [
      <Video
        ref={ref}
        style={{ flex: 1 }}
        resizeMode={ResizeMode.COVER}
        //onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        //progressUpdateIntervalMillis={100}
        shouldPlay={false}
        isLooping
        source={{ uri: `${bucketServer}/${item.uri}` }}
      />,
    ]

    const cardRef = useRef<CardItemHandle>(null)

    return (
      <>
        <PostOverlay
          item={item}
          setIsShared={setIsShared}
          setIsCurrentLiked={setIsLiked}
          isActionBarOpen={isActionBarOpen}
          setIsActionBarOpen={setIsActionBarOpen}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          setIsPaused={setIsPaused}
          currentWatchingTime={watchingTimeNormalized}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: '#0D1D25',
          }}
        >
          <View
            style={{
              position: 'absolute',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              top: 0,
              bottom: 0,
              width: Dimensions.get('window').width,
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
          {data.map((video, index) => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                pointerEvents="box-none"
                key={index}
              >
                <TouchableOpacity
                  onPress={resetYayNayOrHandleNay}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    aspectRatio: 1,
                    height: 40,
                    position: 'absolute',
                    top: 75,
                    left: 30,
                    zIndex: 10,
                  }}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      transform: [{ scale: nayScale }],
                      opacity: nayOpacity,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="thumb-down"
                      size={40}
                      color="red"
                    />
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={resetYayNayOrHandleYay}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    aspectRatio: 1,
                    position: 'absolute',
                    top: 75,
                    right: 30,
                    zIndex: 10,
                  }}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      transform: [{ scale: yayScale }],
                      opacity: yayOpacity,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="fire"
                      color="orange"
                      size={40}
                    />
                  </Animated.View>
                </TouchableOpacity>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <TinderCard
                    ref={cardRef}
                    OverlayLabelRight={OverlayRight}
                    OverlayLabelLeft={OverlayLeft}
                    disableTopSwipe
                    disableBottomSwipe
                    cardStyle={{ borderRadius: 0 }}
                    onSwipedRight={() => {
                      yayAnimation()
                      if (cardRef.current) {
                        cardRef.current.swipeBack()
                      }
                      setIsYay(true)
                    }}
                    onSwipedLeft={() => {
                      nayAnimation()
                      if (cardRef.current) {
                        cardRef.current.swipeBack()
                      }
                      setIsNay(true)
                    }}
                  >
                    {video}
                  </TinderCard>
                </GestureHandlerRootView>
              </View>
            )
          })}
        </View>
      </>
    )
  }
)

export default PostSingle
