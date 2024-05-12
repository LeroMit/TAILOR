import React, { Dispatch, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Toast from 'react-native-toast-message'
import { Badge } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import {
  Container,
  IconContainer,
  IconStyle,
  TitleIcon,
} from '@/styles/sharingSubComponent'
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler'
import { Icon } from '@/types'

interface ShareProps {
  icons: Icon[]
  type: string
  setReceivers?: Dispatch<React.SetStateAction<string[]>>
}

const SharingSubComponent: React.FC<ShareProps> = ({
  icons,
  type,
  setReceivers,
}) => {
  const [hasShared, setHasShared] = useState<boolean[]>([false])

  const handleSharingFriends = (item, index: number) => {
    const currentHasShared = !hasShared[index]

    setHasShared((prev: boolean[]) => {
      const updatedHasShared = [...prev]
      updatedHasShared[index] = hasShared[index] ? false : true
      return updatedHasShared
    })

    setReceivers((prev: string[]) => {
      const updatedReceivers = [...prev]
      if (currentHasShared) {
        updatedReceivers.push(item.title)
        return updatedReceivers
      } else {
        const indexInReceivers = updatedReceivers.indexOf(item.title)
        updatedReceivers.splice(indexInReceivers, 1)
      }
      return updatedReceivers
    })
  }

  const handleSharingSocial = (item, index: number) => {
    Toast.show({
      type: 'info',
      text1: 'TODO',
      text2: 'Share social, system call ' + item.title,
    })
  }

  return (
    <GestureHandlerRootView>
      <Container>
        <ScrollView
          horizontal
          alwaysBounceVertical={false}
          style={{
            overflow: 'scroll',
          }}
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          showsHorizontalScrollIndicator={false}
        >
          {icons.map((icon, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                type === 'friends'
                  ? handleSharingFriends(icon, index)
                  : handleSharingSocial(icon, index)
              }}
            >
              <IconContainer key={index}>
                <IconStyle source={icon.image} />

                {hasShared[index] && (
                  <Badge
                    style={{
                      marginTop: -20,
                      backgroundColor: 'orange',
                    }}
                  >
                    <MaterialCommunityIcons
                      name="check"
                      size={10}
                      color="white"
                    />
                  </Badge>
                )}
                <TitleIcon>{icon.title}</TitleIcon>
              </IconContainer>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Container>
    </GestureHandlerRootView>
  )
}

export default SharingSubComponent
