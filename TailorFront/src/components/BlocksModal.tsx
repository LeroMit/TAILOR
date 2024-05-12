import React from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'

import CustomModal from './CustomModal'
import CustomText from './CustomText'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlocksModalProps } from '@/types'

const BlocksModal: React.FC<BlocksModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  title,
  data,
}) => {
  return (
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
          {title}
        </CustomText>
      )}
    >
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
    </CustomModal>
  )
}

export default BlocksModal
