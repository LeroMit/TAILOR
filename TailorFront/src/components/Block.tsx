import React from 'react'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { DraxView } from 'react-native-drax'
import Icon from 'react-native-vector-icons/FontAwesome5'
import CustomText from './CustomText'
import { BlockProps } from '@/types'

const Block: React.FC<BlockProps> = ({
  squareWidth,
  blockPos,
  setBlockPos,
  index,
  setMoving,
  draggingStyle,
}) => {
  return (
    <DraxView
      style={[
        styles.block,
        {
          width: squareWidth,
          height: squareWidth,
          top: blockPos.row * squareWidth,
          left: blockPos.column * squareWidth,
        },
      ]}
      draggingStyle={[styles.dragging, draggingStyle]}
      hoverDragReleasedStyle={{ opacity: 0 }}
      dragPayload={{ setBlockPos, blockPos, index }}
      onDragStart={() => {
        setMoving(true)
      }}
      onDragEnd={() => {
        setMoving(false)
      }}
      onDragDrop={() => {
        setMoving(false)
      }}
    >
      {blockPos.type === 'end' && (
        <View
          style={[
            styles.endBlock,
            {
              width: squareWidth * 0.6,
              height: squareWidth * 0.6,
              borderRadius: (squareWidth * 0.8) / 2,
            },
          ]}
        >
          <View
            style={[
              styles.endDot,
              {
                width: squareWidth * 0.2,
                height: squareWidth * 0.2,
                borderRadius: (squareWidth * 0.2) / 2,
              },
            ]}
          />
        </View>
      )}
      {blockPos.type != 'end' && (
        <View
          style={[
            blockPos.type === 'tag' ? styles.tag : styles.hour,
            {
              backgroundColor: 'white',
              borderRadius: 20,
              width: squareWidth * 0.8,
              height: squareWidth * 0.8,
            },
          ]}
        >
          <Icon
            name={blockPos.type === 'tag' ? 'hashtag' : 'clock'}
            size={squareWidth * 0.6}
            color="rgba(0, 0, 0, 0.10)"
            style={styles.backgroundIcon}
          />
          <View
            style={{
              height: '26%',
              top: '37%',
            }}
          >
            <CustomText
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
              }}
            >
              {blockPos.name}
            </CustomText>
          </View>
        </View>
      )}
    </DraxView>
  )
}

const styles = StyleSheet.create({
  backgroundIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '15%',
  },
  block: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragging: {
    opacity: 0.8,
  },
  tag: {},
  hour: {},
  endBlock: {
    backgroundColor: 'transparent',
    borderWidth: 6,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endDot: {
    backgroundColor: '#FF7F00',
  },
})

export default memo(Block)
