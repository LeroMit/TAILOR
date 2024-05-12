import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar } from 'react-native'

import { FontAwesome, AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Camera } from 'expo-camera'

import { Container, Header, Button, Row, Description } from '@/styles/live'

const Record: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const navigation = useNavigation()
  useEffect(() => {
    async function permission(): Promise<void> {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
      StatusBar.setHidden(true)
    }
    permission()
  }, [])

  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <Camera style={{ flex: 1 }}>
      <Container>
        <Header>
          <Button
            onPress={() => {
              StatusBar.setHidden(false)
              navigation.goBack()
            }}
          >
            <AntDesign name="close" size={28} color="#fff" />
          </Button>
          <Button>
            <Row>
              <FontAwesome name="music" size={18} color="#fff" />
              <Description>Sons</Description>
            </Row>
          </Button>
        </Header>
      </Container>
    </Camera>
  )
}

export default Record
