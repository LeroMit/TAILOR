import React from 'react'
import { TouchableOpacity, View, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import CustomText from './CustomText'
import Toast from 'react-native-toast-message'

const RecentSearch = ({ search, onRemove }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 10,
          borderRadius: 20,
          marginRight: 10,
          flexDirection: 'row',
        }}
        onPress={() =>
          // TODO : Implement this because it's not working

          // router.push({
          //   pathname: '/search',
          //   params: { searchText: search.name },
          // })
          {
            Toast.show({
              type: 'info',
              text1: 'TODO',
              text2: 'Feature not implemented',
            })
          }
        }
      >
        <View
          style={{
            borderColor: 'white',
            justifyContent: 'center',
            borderRadius: 1000,
            marginEnd: 10,
          }}
        >
          {(search.type === 'notFound' || search.type === 'tailor') && (
            <MaterialCommunityIcons name="magnify" size={20} color={'white'} />
          )}
          {search.type == 'found' && (
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={require('@/assets/images/avatar.png')}
            ></Image>
          )}
        </View>
        <View>
          <CustomText
            style={{
              justifyContent: 'center',
              alignSelf: 'flex-start',
              color: '#fff',
            }}
          >
            {search.name}
          </CustomText>
          {search.type == 'found' && (
            <CustomText
              style={{
                justifyContent: 'center',
                alignSelf: 'flex-start',
                color: 'gray',
              }}
            >
              {search.chosen} {search.followed ? '•  Following' : ''}
            </CustomText>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          borderRadius: 20,
          marginRight: 10,
          flexDirection: 'row',
        }}
        onPress={() => onRemove(search)}
      >
        <MaterialCommunityIcons
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          name="close"
          size={15}
          color={'white'}
        />
      </TouchableOpacity>
    </View>
  )
}

export default RecentSearch
