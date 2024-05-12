import { CustomMoreCard, ElementControlBar, ReturnToFlicks } from '@/components'
import { useLocale } from '@/context/LocaleContext'
import { Title } from '@/styles/collection'
import { Container, Content, Header } from '@/styles/community'
import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'

const More: React.FC = () => {
  const { i18n } = useLocale()
  return (
    <Container>
      <Header>
        <ElementControlBar
          style={{ zIndex: 200, pointerEvents: 'auto' }}
          onPress={() => {}}
          name=""
          size={30}
          color="black"
          isSelected={true}
        />
        <Title>{i18n.t('more.title')}</Title>
        <ReturnToFlicks />
      </Header>
      <Content>
        <FlatList
          data={[
            { key: i18n.t('more.components.learnTailor'), icon: 'book' },
            { key: i18n.t('more.components.about'), icon: 'cogs' },
            { key: i18n.t('more.components.more'), icon: 'more' },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.7}>
              <CustomMoreCard item={item} />
            </TouchableOpacity>
          )}
          numColumns={2}
        />
      </Content>
    </Container>
  )
}
export default More
