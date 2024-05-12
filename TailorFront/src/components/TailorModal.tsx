import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import ElementControlBar from './ElementControlBar'
import { ContainerEdit, SubTitleTailor, TitleTailor } from '@/styles/collection'
import TagsBag from './TagsBag'
import { DataCarouselItem, TailorItem, myTailorApi } from '@/types'
import server from '@/server.json'
import { useLocale } from '@/context/LocaleContext'
import { Creator, Line, ProfilePicture } from '@/styles/tailorModal'
import CustomText from './CustomText'
import MyTailors from './MyTailors'
import axios from 'axios'
import { serverLocal } from '@/constants'
import Toast from 'react-native-toast-message'
import { useAuth } from '@/context/AuthContext'

interface TailorModalProps {
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  item: TailorItem | DataCarouselItem
}

const TailorModal: React.FC<TailorModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  item,
}) => {
  const { authState } = useAuth()
  const { i18n } = useLocale()
  const [showMessage, setShowMessage] = useState(false)
  const [messageKey, setMessageKey] = useState('tailorModal.copy.message')
  const [removeModal, setRemoveModal] = useState(false)
  const [removedModal, setRemovedModal] = useState(false)

  const [myTailors, setMyTailors] = useState<DataCarouselItem[]>()
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const [userTailors, setUserTailors] = useState<DataCarouselItem[]>(
    server.collection
  )

  const fetchMyTailor = async () => {
    {
      try {
        const response = await axios.get(
          `${serverLocal}/api/user/${authState.id}/tailors`
        )

        const tailorList = response.data.map((item: myTailorApi) => ({
          id: item.id,
          name: item.title,
          isFavorite: item.isFavourite,
          // TODO : recuperer les tags qui sont associés à un Tailor
        }))
        setMyTailors(tailorList)
        setIsDataLoaded(true)
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error ',
          text2: error.message,
        })
      }
    }
  }

  useEffect(() => {
    fetchMyTailor()
  }, [])

  const closeModal = () => {
    setIsModalVisible(false)
    setShowMessage(false)
    setMessageKey('tailorModal.copy.message')
    setRemoveModal(false)
    setRemovedModal(false)
  }

  const handleRemoveModal = (item: any) => {
    setRemovedModal(true)
    setMessageKey('tailorModal.removedTailor.message')
    setTimeout(() => {
      setIsModalVisible(false)
    }, 1000)
    setTimeout(() => {
      setShowMessage(false)
      setRemoveModal(false)
      setRemovedModal(false)
      setMessageKey('tailorModal.copy.message')
    }, 1500)
    const newTailors = userTailors.filter((tailor) => tailor.name !== item.name)
    setUserTailors(newTailors)
  }

  const addItemToUserTailors = (item: any) => {
    // TODO : create le post pour ajouter un Tailor à un user
    Toast.show({
      type: 'info',
      text1: 'TODO',
      text2: 'Create post to add Tailor to user',
    })
    if (myTailors.length >= 7) {
      setShowMessage(true)
      setMessageKey('tailorModal.removeTailor.message')
      setRemoveModal(true)
    } else {
      setShowMessage(true)
      setMessageKey('tailorModal.added.message')

      setTimeout(() => {
        setIsModalVisible(false)
      }, 1000)
      setTimeout(() => {
        setShowMessage(false)
        setMessageKey('tailorModal.copy.message')
      }, 1500)
    }
  }

  return (
    <>
      {isDataLoaded && (
        <Modal
          animationInTiming={500}
          animationOutTiming={700}
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}
          onBackdropPress={closeModal}
          isVisible={isModalVisible}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#1d2d35',
              width: '90%',
              borderRadius: 30,
              flexDirection: 'column',
            }}
          >
            <View
              style={{
                padding: 20,
                width: '100%',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CustomText
                style={{ color: 'white', fontSize: 18, textAlign: 'center' }}
                weight="bold"
              >
                {i18n.t(messageKey)}
              </CustomText>
              <Line />
            </View>
            {!showMessage && !removeModal && !removedModal && (
              <View
                style={{
                  padding: 20,
                  marginTop: -10,
                  width: '100%',
                  alignContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <ElementControlBar
                  style={{ zIndex: 200 }}
                  onPress={() => setIsModalVisible(false)}
                  name="close"
                  size={30}
                  color="white"
                  isSelected={true}
                />
                <TitleTailor>{item.name}</TitleTailor>
                <ElementControlBar
                  style={{ zIndex: 200 }}
                  onPress={() => addItemToUserTailors(item)}
                  name="check"
                  color="white"
                  size={30}
                  isSelected={true}
                />
              </View>
            )}
            {/* "Remove a Tailor" modal */}
            {removeModal && !removedModal && (
              <>
                <FlatList
                  data={userTailors.slice(1, -1)}
                  style={{ marginBottom: 40 }}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => handleRemoveModal(item)}>
                      <MyTailors
                        item={item}
                        index={index}
                        removeTailor={true}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.name}
                />
              </>
            )}

            {/* "Tailor" description modal */}
            {!removeModal && !removedModal && (
              <>
                <View
                  style={{
                    paddingTop: 0,
                    padding: 20,
                    alignContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <SubTitleTailor>Tags</SubTitleTailor>
                  <ContainerEdit>
                    <TagsBag tags={item.tags} canBeSelected={false} />
                  </ContainerEdit>
                </View>
                <View
                  style={{
                    paddingTop: 0,
                    padding: 20,
                    alignContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <SubTitleTailor>
                    {i18n.t('tailorModal.subtitle.creator')}
                  </SubTitleTailor>
                  <ContainerEdit>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {'profilePicture' in item && (
                        <ProfilePicture source={item.profilePicture} />
                      )}
                      {'creator' in item && <Creator>{item.creator}</Creator>}
                    </TouchableOpacity>
                  </ContainerEdit>
                </View>
                <View
                  style={{
                    paddingTop: 0,
                    padding: 20,
                    alignContent: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <ElementControlBar
                    style={{ zIndex: 200 }}
                    onPress={() => {}}
                    name="dots-horizontal"
                    size={30}
                    color="white"
                    isSelected={true}
                  />
                  <ElementControlBar
                    style={{ zIndex: 200 }}
                    onPress={() => {}}
                    name="send"
                    size={30}
                    color="white"
                    isSelected={true}
                  />
                </View>
              </>
            )}
          </View>
        </Modal>
      )}
    </>
  )
}

export default TailorModal
