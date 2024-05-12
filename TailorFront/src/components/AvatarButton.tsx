import React from 'react'
import { Platform, View } from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import Svg, { LinearGradient, Stop, Rect } from 'react-native-svg'
import CustomText from './CustomText'
import { useLocale } from '@/context/LocaleContext'
import { Image } from 'react-native-svg'
import { CircleBehind } from '@/styles/avatarButton'

const AvatarButton: React.FC<{
  imageUrl: string
  isActive: boolean
  color: string
}> = ({ imageUrl, isActive, color }) => {
  const { i18n } = useLocale()
  return (
    <View
      style={{
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
      }}
    >
      <MaskedView
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: Platform.OS === 'ios' ? 3 : 0,
        }}
        maskElement={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircleBehind />
            <CustomText
              weight="bold"
              style={{
                fontSize: 10,
                color: 'black',
              }}
            >
              {i18n.t('meTab.title')}
            </CustomText>
          </View>
        }
      >
        {/* Shows behind the mask */}
        <Svg width="50" height="50" viewBox="0 0 200 200" fill="none">
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="red" />
            <Stop offset="1" stopColor="yellow" />
          </LinearGradient>

          <Rect
            x="0"
            y="0"
            width="200"
            height="200"
            fill={isActive ? 'url(#grad)' : color}
            stroke="black"
            strokeWidth="2"
          />
          <Image
            x={Platform.OS === 'ios' ? '60' : '62'}
            y={Platform.OS === 'ios' ? '23' : '8'}
            width="80"
            height="80"
            href={imageUrl}
            preserveAspectRatio="xMidYMid slice"
          />
        </Svg>
      </MaskedView>
    </View>
  )
}

export default AvatarButton
