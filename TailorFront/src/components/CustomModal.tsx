import { Dimensions, View } from 'react-native'
import Modal from 'react-native-modal'
import React from 'react'

import { HeaderBottomSheet, Line, ModalView } from '@/styles/customModal'
import { CustomModalProps } from '@/types'

const SCREEN_WIDTH = Dimensions.get('screen').width

const CustomModal: React.FC<CustomModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  onCloseVoluntary,
  Header,
  children,
  type,
}) => {
  const closeModal = () => {
    setIsModalVisible(false)
    if (onCloseVoluntary) {
      onCloseVoluntary()
    }
  }

  return (
    <>
      <Modal
        animationInTiming={500}
        animationOutTiming={1000}
        onBackdropPress={closeModal}
        avoidKeyboard
        isVisible={isModalVisible}
        onSwipeComplete={() => setIsModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        style={{
          margin: 0,
        }}
      >
        <View
          style={{
            position: 'absolute',
            height: type === 'share' ? 300 : 'auto',
            bottom: 0,
          }}
        >
          <ModalView
            style={{
              height: type === 'share' ? 300 : 570,
              maxHeight: 450,
            }}
          >
            <HeaderBottomSheet style={{ width: SCREEN_WIDTH }}>
              <Header />
              <Line />
            </HeaderBottomSheet>

            <View style={{ flex: 1, width: '100%' }}>{children}</View>
          </ModalView>
        </View>
      </Modal>
    </>
  )
}

export default CustomModal
