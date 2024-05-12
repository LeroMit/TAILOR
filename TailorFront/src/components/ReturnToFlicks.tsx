import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Container } from '@/styles/returnToFlicks'
import CustomText from './CustomText'
import { router } from 'expo-router'

const ReturnToFlicks = () => {
  return (
    // on press, navigate back to home screen
    <Container onPress={() => router.navigate('/')}>
      <MaterialCommunityIcons
        name="arrow-left-top"
        size={20}
        color="black"
        style={{ marginRight: 5 }}
      />
      <CustomText>Flicks</CustomText>
    </Container>
  )
}

export default ReturnToFlicks
