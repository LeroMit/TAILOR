import React, { useCallback, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import {
  DraxProvider,
  DraxView,
  DraxSnapbackTargetPreset,
} from 'react-native-drax'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Block from './Block'
import Svg, {
  Line,
  LinearGradient,
  Polygon,
  Stop,
  Text,
} from 'react-native-svg'
import { BlockData, FlowGraphProps, SquareProps } from '@/types'
import ViewShot from 'react-native-view-shot'

const Square = ({ width, position, receptive }: SquareProps) => {
  const { row, column } = position
  const colorStyle = row % 2 === column % 2 ? styles.light : styles.dark
  return (
    <DraxView
      style={[
        styles.square,
        { backgroundColor: 'transparent' },
        receptive ? styles.receptive : undefined,
        { width },
      ]}
      receivingStyle={styles.receiving}
      receptive={receptive}
      onReceiveDragDrop={({ dragged: { payload } }) => {
        payload?.setBlockPos?.(
          { ...payload?.blockPos, ...position },
          payload?.index
        )
        return DraxSnapbackTargetPreset.None
      }}
    >
      <View
        style={[
          colorStyle,
          {
            width: '10%',
            height: '10%',
            alignSelf: 'center',
            borderRadius: 20,
            top: '45%',
          },
        ]}
      />
    </DraxView>
  )
}

const FlowGraph: React.FC<FlowGraphProps> = ({
  blocks,
  setBlocksBlockPos,
  getBlockById,
  viewRef,
}) => {
  const [moving, setMoving] = useState(false)
  const { width, height } = Dimensions.get('window')
  const canvaWidth = width * 0.95
  const squareWidth = Math.min(canvaWidth / 4, height / 9)
  const rowViews: JSX.Element[] = []
  for (let row = 0; row < 7; row += 1) {
    const squareViews: JSX.Element[] = []
    for (let column = 0; column < 4; column += 1) {
      if (row === 6) {
        squareViews.push()
      } else {
        const isBlockAtPosition = blocks.some(
          (block) => block.row === row && block.column === column
        )
        const receptive = moving && !isBlockAtPosition
        squareViews.push(
          <Square
            width={squareWidth}
            key={`r${row}c${column}`}
            position={{ row, column }}
            receptive={receptive}
          />
        )
      }
    }
    rowViews.push(
      <View key={`r${row}`} style={{ flexDirection: 'row' }}>
        {squareViews}
      </View>
    )
  }

  const getBlockCenter = (block: BlockData) => {
    const x = (block.column + 0.5) * squareWidth
    const y = (block.row + 0.5) * squareWidth
    return { x, y }
  }

  const Arrow = React.memo(
    ({
      blockId,
      childBlockId,
      blockPercentage,
      parentCenter,
      childCenter,
    }: {
      blockId: number
      childBlockId: number
      blockPercentage?: number
      parentCenter: { x: number; y: number }
      childCenter: { x: number; y: number }
    }) => {
      const arrowSize = 10

      // Calculate the angle of the line
      const angle = Math.atan2(
        childCenter.y - parentCenter.y,
        childCenter.x - parentCenter.x
      )

      // Calculate the coordinates of the arrow points at 1/4, 1/2, and 3/4 positions
      const arrowPositions = [1 / 4, 1 / 2, 3 / 4]

      const arrowPoints = arrowPositions.map((position) => {
        const arrowX =
          parentCenter.x +
          (childCenter.x - parentCenter.x) * position +
          arrowSize * Math.cos(angle)
        const arrowY =
          parentCenter.y +
          (childCenter.y - parentCenter.y) * position +
          arrowSize * Math.sin(angle)

        const baseX1 = arrowX - arrowSize * Math.cos(angle + Math.PI / 6)
        const baseY1 = arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
        const baseX2 = arrowX - arrowSize * Math.cos(angle - Math.PI / 6)
        const baseY2 = arrowY - arrowSize * Math.sin(angle - Math.PI / 6)

        return `${arrowX},${arrowY} ${baseX1},${baseY1} ${baseX2},${baseY2}`
      })

      // Calculate the midpoint of the arrow
      const midX = parentCenter.x + (childCenter.x - parentCenter.x) * 0.5
      const midY = parentCenter.y + (childCenter.y - parentCenter.y) * 0.5

      // Calculate the offset to prevent overlap
      const offsetX = 50 * Math.cos(angle + Math.PI / 2)
      const offsetY = 15 * Math.sin(angle + Math.PI / 2)

      return (
        <Svg key={'svg' + `${blockId}-${childBlockId}`} fill="url(#grad)">
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="red" />
            <Stop offset="1" stopColor="yellow" />
          </LinearGradient>
          <Line
            key={`${blockId}-${childBlockId}`}
            x1={parentCenter.x}
            y1={parentCenter.y}
            x2={childCenter.x}
            y2={childCenter.y}
            stroke="url(#grad)"
            strokeWidth="3"
          />
          {arrowPoints.map((points, index) => (
            <Polygon
              key={`polygon-${index}-${blockId}-${childBlockId}`}
              points={points}
              fill="url(#grad)"
              stroke="url(#grad)"
              strokeWidth="5"
              opacity={0.8}
            />
          ))}
          {blockPercentage && (
            <Text
              x={midX + offsetX}
              y={midY + offsetY}
              fill="url(#grad)"
              fontSize="16"
              textAnchor="middle"
            >
              {`${Math.round(blockPercentage * 100)}%`}
            </Text>
          )}
        </Svg>
      )
    }
  )

  const createElements = (
    block: BlockData,
    index: number,
    arrowsElements: React.ReactElement[],
    blocksElements: React.ReactElement[]
  ) => {
    const parentCenter = getBlockCenter(block)
    blocksElements.push(
      <Block
        key={block.id}
        blockPos={block}
        index={index}
        setBlockPos={setBlocksBlockPos}
        setMoving={setMoving}
        squareWidth={squareWidth}
        draggingStyle={{
          opacity: 0.2,
        }}
      />
    )
    block.children.forEach((childBlockId: number) => {
      const childBlock = getBlockById(childBlockId)
      const childCenter = getBlockCenter(childBlock)
      arrowsElements.push(
        <Arrow
          key={'arrow' + childBlockId + block.id}
          blockId={block.id}
          blockPercentage={block.percentage ? block.percentage : undefined}
          childBlockId={childBlock.id}
          parentCenter={parentCenter}
          childCenter={childCenter}
        />
      )
    })
  }

  const renderBlocksAndArrows = useCallback(
    (viewRef: React.RefObject<ViewShot>) => {
      const arrowsElements: React.ReactElement[] = []
      const blocksElements: React.ReactElement[] = []
      blocks.forEach((block: BlockData, index: number) => {
        createElements(block, index, arrowsElements, blocksElements)
      })
      const svgElement = () => (
        <Svg key="svgKey" style={StyleSheet.absoluteFill}>
          {arrowsElements}
        </Svg>
      )
      const elementList = [svgElement(), ...blocksElements]
      const finalElement = () => (
        <ViewShot
          style={StyleSheet.absoluteFill}
          key="viewshotKey"
          ref={viewRef}
          options={{ format: 'png', quality: 0.9 }}
        >
          {elementList}
        </ViewShot>
      )
      return finalElement()
    },
    [blocks]
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DraxProvider>
        <View style={styles.container}>
          <View style={styles.containerRow}>
            <View style={styles.canva}>
              {rowViews}
              {renderBlocksAndArrows(viewRef)}
            </View>
          </View>
        </View>
      </DraxProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '12.5%',
  },
  containerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canva: {
    borderColor: 'blue',
    borderWidth: 0,
  },
  dark: {
    backgroundColor: '#999999',
    opacity: 0.5,
  },
  light: {
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  square: {
    margin: 0,
    aspectRatio: 1,
  },
  receptive: {
    borderColor: '#039AE3',
    opacity: 0.8,
    borderWidth: 1,
  },
  receiving: {
    borderColor: '#00ff00',
    borderWidth: 1,
  },
  block: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default FlowGraph
