import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, FlatList, Keyboard } from 'react-native'

import CustomModal from './CustomModal'
import CustomText from './CustomText'
import CustomTextInput from './CustomTextInput'
import GradientButton from './GradientButton'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocale } from '@/context/LocaleContext'
import Toast from 'react-native-toast-message'

import { LinearGradient } from 'expo-linear-gradient'
import {
  SubTitleTailor,
  TextInputContainerWrapper,
  TextInputContainer,
  IconContainer,
  Error,
  SliderContainer,
  SliderText,
  SliderContainerWrapper,
  SendButtonBackground,
} from '@/styles/collection'
import { Slider } from '@miblanchard/react-native-slider'
import { router } from 'expo-router'
import { SearchItem, BlockData, BlockSettingsModalProps } from '@/types'
import { TouchableWithoutFeedback } from 'react-native'

const BlockSettingsModal: React.FC<BlockSettingsModalProps> = ({
  tailorModalType,
  isModalVisible,
  setIsModalVisible,
  setHasBeenPressed,
  setTypeModal,
  title,
  maxValue,
  data,
  setBlocks,
  blocks,
}) => {
  const { i18n } = useLocale()

  const [text, setText] = useState('')
  const [color, setColor] = useState('white')
  const [tooManyCharacters, setTooManyCharacters] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [canValidate, setCanValidate] = useState(false)
  const addNewBlock = (text: string, sliderValue: number) => {
    // Find the first available empty slot
    let emptySlot = { row: -1, column: -1 }
    const maxRow = 6
    const maxColumn = 3

    outerLoop: for (let row = 0; row < maxRow; row++) {
      for (let column = 0; column <= maxColumn; column++) {
        const existingBlock = blocks.find(
          (block) => block.row === row && block.column === column
        )

        if (!existingBlock) {
          emptySlot = { row, column }
          break outerLoop
        }
      }
    }

    if (emptySlot.row !== -1 && emptySlot.column !== -1) {
      const endBlock = blocks.find((block) => block.type === 'end')
      // Generate a new block with an incremented id
      const newId = blocks.length
      const newBlock: BlockData = {
        id: newId,
        name: '#' + text,
        row: emptySlot.row,
        column: emptySlot.column,
        children: [endBlock.id], // Set children to an empty array
        type: 'tag', // Set the type to 'tag' for a new block
        percentage: sliderValue / 100, // Set a default percentage or leave it as desired
      }

      // Update the blocks array with the new block
      setBlocks((prevBlocks: BlockData[]) => {
        prevBlocks[newId] = newBlock
        return [...prevBlocks]
      })
      setIsModalVisible(false)
      setHasBeenPressed(false)
      setText('')
      setSliderValue(0)
      setTypeModal('blocks')
    } else {
      Toast.show({
        type: 'error',
        text1: 'No empty slots available',
      })
    }
  }

  const calculateMaxSliderValue = (blocks: BlockData[]) => {
    let maxPercentage = 1
    for (let block of blocks) {
      if (block.type === 'tag') {
        maxPercentage -= block.percentage
      }
    }
    return maxPercentage * 100
  }

  useEffect(() => {
    if (text.length > 30) {
      setTooManyCharacters(true)
      setColor('red')
    } else {
      setTooManyCharacters(false)
      setColor('white')
    }
  }),
    [text]

  useEffect(() => {
    if (sliderValue > 0 && text.length > 0 && text.length <= 30) {
      setCanValidate(true)
    } else {
      setCanValidate(false)
    }
  }),
    [sliderValue, text]

  /**
   * Handle text input change in comment box
   * @param text string
   */
  const handleTextInputChange = (text: string) => {
    const commentText = text
      .trim()
      .replace(/[^a-zA-Z ]/g, '')
      .toLowerCase()
    setText(commentText)
  }

  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([
    { name: 'Ariana Grande', type: 'notFound' },
    { name: 'Evann Guillot', type: 'notFound' },
    { name: 'Marian Scuturicci', type: 'notFound' },
    { name: 'le_rom', chosen: 'Tim Morel', followed: true, type: 'found' },
  ])
  /**
   * Handle search tag
   * @param search string
   */
  const handleSearchTag = (search: string) => {
    setIsModalVisible(false)
    router.push({
      pathname: '/tailor/searchTagCollection',
      params: {
        searchText: search,
        recent:
          '{"name":"' +
          search +
          '","type":"notFound"},' +
          recentSearches.map((item) => JSON.stringify(item)).toString(),
      },
    })
  }

  let blockModal = (
    <CustomModal
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      type="share"
      Header={() => (
        <CustomText
          weight="bold"
          style={{
            fontSize: 13,
            color: 'white',
          }}
        >
          {tailorModalType === 'blocks'
            ? i18n.t('createBlockSettingsModal.blocks')
            : title}
        </CustomText>
      )}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View
                style={{
                  margin: 10,
                  borderRadius: 20,
                  backgroundColor: '#060E12',
                }}
              >
                <TouchableOpacity onPress={item.onPress}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="plus"
                      size={20}
                      color="white"
                      style={{ marginEnd: 40 }}
                    />
                    <CustomText
                      weight="bold"
                      style={{ fontSize: 16, color: 'white' }}
                    >
                      {item.title}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.title.toString()}
          />
        </View>
      </TouchableWithoutFeedback>
    </CustomModal>
  )

  let BlockSettingsModal = (
    <CustomModal
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      onCloseVoluntary={() => {
        setHasBeenPressed(false)
        setSliderValue(0)
        setTimeout(() => {
          setTypeModal('blocks')
        }, 500)
      }}
      type="comments"
      Header={() => (
        <CustomText
          weight="bold"
          style={{
            fontSize: 13,
            color: 'white',
          }}
        >
          {tailorModalType === 'settings'
            ? i18n.t('createBlockSettingsModal.settings')
            : title}
        </CustomText>
      )}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            padding: 20,
            alignContent: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <SubTitleTailor>
              {i18n.t('createBlockSettingsModal.chooseTag')}
            </SubTitleTailor>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                handleSearchTag(text)
              }}
            >
              <SendButtonBackground
                colors={['rgba(255, 0, 0, 1)', 'rgba(255, 255, 0, 1)']}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color="white"
                />
              </SendButtonBackground>
            </TouchableOpacity>
          </View>
          <TextInputContainerWrapper>
            <TextInputContainer
              style={{
                borderColor: tooManyCharacters ? 'red' : 'transparent',
                borderWidth: 1,
              }}
            >
              <IconContainer style={{ marginStart: 10 }}>
                <MaterialCommunityIcons
                  name="music-accidental-sharp"
                  size={20}
                  color={color}
                ></MaterialCommunityIcons>
              </IconContainer>
              <CustomTextInput
                placeholder={i18n.t(
                  'createBlockSettingsModal.settingsPlaceHolder'
                )}
                placeholderTextColor={'#86878B'}
                value={text}
                onChangeText={handleTextInputChange}
                style={{
                  flex: 1,
                  color: color,
                }}
                keyboardType="default"
              />
            </TextInputContainer>
            {tooManyCharacters ? (
              <Error>
                {i18n.t('createBlockSettingsModal.commentLengthError')}
              </Error>
            ) : (
              <Error />
            )}
          </TextInputContainerWrapper>
          <SliderContainer>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <SubTitleTailor>
                {i18n.t('createBlockSettingsModal.choosePercentage')}
              </SubTitleTailor>
            </View>
            <SliderContainerWrapper>
              <Slider
                value={0}
                onValueChange={(value) => setSliderValue(value[0])}
                minimumValue={0}
                maximumValue={calculateMaxSliderValue(blocks)}
                step={1}
                animateTransitions
                renderBelowThumbComponent={() => (
                  <SliderText>{sliderValue}%</SliderText>
                )}
                thumbTintColor="#fff"
                renderMinimumTrackComponent={() => (
                  <LinearGradient
                    colors={['#FF0000', '#FFFF00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: 5,
                      position: 'absolute',
                      top: -0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      borderRadius: 5,
                    }}
                  />
                )}
              />
            </SliderContainerWrapper>
          </SliderContainer>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <GradientButton
              text={i18n.t('createBlockSettingsModal.validate')}
              colors={
                canValidate ? ['#FF0000', '#FFFF00'] : ['#D9D9D9', '#A1A1A1']
              }
              onPress={() =>
                canValidate ? addNewBlock(text, sliderValue) : undefined
              }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </CustomModal>
  )

  return tailorModalType === 'blocks' ? blockModal : BlockSettingsModal
}

export default BlockSettingsModal
