import React from 'react'
import { hexy } from '@/utils'
import CustomText from './CustomText'
import { View } from 'react-native'
import { Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface CustomMoreCardProps {
  item: { key: string; icon: string }
}
const { width } = Dimensions.get('window')
const cardWidth = (width - 40) / 2

const CustomMoreCard: React.FC<CustomMoreCardProps> = ({
  item,
}: CustomMoreCardProps) => {
  return (
    <View
      style={{
        backgroundColor: hexy(),
        padding: 20,
        height: 200,
        margin: 20,
        width: cardWidth,
        marginHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'flex-end',
      }}
    >
      <MaterialCommunityIcons
        name={item.icon}
        size={50}
        color="white"
        style={{ margin: 10 }}
      ></MaterialCommunityIcons>
      <CustomText weight="bold" style={{ color: 'white', fontSize: 25 }}>
        {item.key}
      </CustomText>
    </View>
  )
}

export default CustomMoreCard
