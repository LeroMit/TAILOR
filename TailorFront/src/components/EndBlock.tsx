import { BlockProps2 } from '@/types'
import React from 'react'
import { DraxView } from 'react-native-drax'
import Icon from 'react-native-vector-icons/FontAwesome5'

const Block: React.FC<BlockProps2> = ({
  squareWidth,
  blockPos,
  setBlockPos,
  setMoving,
  draggingStyle,
  iconName = 'chess-block',
  iconColor = 'red',
}) => {
  return (
    <DraxView
      style={[
        {
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          width: squareWidth,
          height: squareWidth,
          top: blockPos.row * squareWidth,
          left: blockPos.column * squareWidth,
        },
      ]}
      draggingStyle={[{ opacity: 0.2 }, draggingStyle]}
      hoverDragReleasedStyle={{ opacity: 0 }}
      dragPayload={{ setBlockPos }}
      onDragStart={() => {
        setMoving(true)
      }}
      onDragEnd={() => {
        setMoving(false)
      }}
      onDragDrop={() => {
        setMoving(false)
      }}
      onDrag={() => setBlockPos(blockPos)}
    >
      <Icon name={iconName} size={squareWidth * 0.8} color={iconColor} />
    </DraxView>
  )
}

export default Block
