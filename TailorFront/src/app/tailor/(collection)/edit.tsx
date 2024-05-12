import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  ElementControlBar,
  FlowGraph,
  BlockSettingsModal,
  ReturnToFlicks,
} from '@/components'
import { router } from 'expo-router'
import { Title, Header, Content, GradientBackground } from '@/styles/edit'
import { FAB } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocale } from '@/context/LocaleContext'
import { DataEditTailorItem, BlockSettingsModalType, BlockData } from '@/types'

import { useNavigation } from 'expo-router'
import StyledTailorNameTextInput from '@/components/TailorNameTextInput'
import ViewShot, { captureRef } from 'react-native-view-shot'
import { Dimensions } from 'react-native'

export default function edit() {
  const { i18n } = useLocale()

  const viewRef = useRef<ViewShot>(null)

  const handleCapture = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      })
      console.log('Snapshot captured:', uri)
      setCapturedUri(uri)
    } catch (error) {
      console.error('Failed to capture snapshot:', error)
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [hasBeenPressed, setHasBeenPressed] = useState(false)
  const [typeModal, setTypeModal] = useState(
    'blocks' as BlockSettingsModalType['type']
  )
  const [title, setTitle] = useState('TailorName')
  const [data, setData] = useState<DataEditTailorItem[]>([
    { title: i18n.t('createBlockSettingsModal.tag'), onPress: handleTagPress },
    {
      title: i18n.t('createBlockSettingsModal.time'),
      onPress: handleTimePress,
    },
    {
      title: i18n.t('createBlockSettingsModal.location'),
      onPress: handleLocationPress,
    },
  ])

  const [blocks, setBlocks] = useState<BlockData[]>([
    {
      id: 1,
      name: '1',
      type: 'tag',
      children: [3],
      percentage: 0.5681818,
      row: 1,
      column: 1,
    },
    {
      id: 2,
      name: '2',
      type: 'tag',
      children: [3],
      percentage: 0.4318182,
      row: 1,
      column: 2,
    },
    {
      id: 3,
      name: 'LUNDI_MATIN',
      type: 'hour',
      children: [0],
      row: 1,
      column: 3,
    },
    {
      id: 0,
      name: '',
      type: 'end',
      children: [],
      row: 4,
      column: 3,
    },
  ])

  const setBlocksBlockPos = (blockPos: BlockData, index: number) => {
    setBlocks((prevBlocks: BlockData[]) => {
      prevBlocks[index] = blockPos
      return [...prevBlocks]
    })
  }

  const getBlockById = (id: number) => {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].id === id) {
        return blocks[i]
      }
    }
  }

  function handleTagPress() {
    setTypeModal('settings')
    setHasBeenPressed(true)
  }

  function handleTimePress() {
    console.log('Time Pressed')
  }

  function handleLocationPress() {
    console.log('Location Pressed')
  }

  const navigation = useNavigation()

  useEffect(() => {
    const handleNavigate = () => {
      if (hasBeenPressed) {
        setIsModalVisible(true)
      }
    }

    navigation.addListener('focus', handleNavigate)

    return () => {
      navigation.removeListener('focus', handleNavigate)
    }
  }, [hasBeenPressed, navigation])

  const [capturedUri, setCapturedUri] = useState<string | null>(null)

  return (
    <SafeAreaView>
      <Header>
        <ElementControlBar
          style={{ zIndex: 200 }}
          onPress={() => {
            router.back()
          }}
          name="arrow-left"
          size={30}
          color="black"
          isSelected={true}
        />
        <Title>{i18n.t('tailorModal.subtitle.edit')}</Title>
        <ReturnToFlicks />
      </Header>
      <Content>
        <Header></Header>
        <Header></Header>
        <GradientBackground
          style={{
            borderRadius: 20,
          }}
          colors={['#FF0000', '#FFFF00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <StyledTailorNameTextInput
            weight="bold"
            style={{ color: 'white', fontSize: 20 }}
          >
            {title}
          </StyledTailorNameTextInput>
        </GradientBackground>

        <LinearGradient
          colors={['#FF0000', '#FFFF00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            margin: 16,
            right: 16,
            bottom: Dimensions.get('window').height * 0.095 + 90,
            borderRadius: 15,
            zIndex: 200,
          }}
        >
          <FAB
            icon="plus"
            style={{
              backgroundColor: 'transparent',
            }}
            color="#fff"
            onPress={() => {
              setIsModalVisible(true)
            }}
          />
        </LinearGradient>
        <LinearGradient
          colors={['#FF0000', '#FFFF00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            margin: 16,
            left: 16,
            bottom: Dimensions.get('window').height * 0.095 + 90,
            borderRadius: 15,
            zIndex: 200,
          }}
        >
          <FAB
            icon="floppy"
            style={{
              backgroundColor: 'transparent',
            }}
            color="#fff"
            onPress={handleCapture}
          />
        </LinearGradient>
        <FlowGraph
          viewRef={viewRef}
          blocks={blocks}
          setBlocksBlockPos={setBlocksBlockPos}
          getBlockById={getBlockById}
        />
      </Content>
      <BlockSettingsModal
        tailorModalType={typeModal}
        data={data}
        isModalVisible={isModalVisible}
        setTypeModal={setTypeModal}
        setIsModalVisible={setIsModalVisible}
        setHasBeenPressed={setHasBeenPressed}
        title="Settings"
        maxValue={100}
        setBlocks={setBlocks}
        blocks={blocks}
      />
    </SafeAreaView>
  )
}
