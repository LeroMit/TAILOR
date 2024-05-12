import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import StyledCustomText from './CustomText'
import Toast from 'react-native-toast-message'
import { MentionHashtagTextViewProps } from '@/types'

const MentionHashtagTextView: React.FC<MentionHashtagTextViewProps> = ({
  children,
  mentionHashtagColor,
  style,
  numberOfLines,
  ellipsizeMode,
}) => {
  const prepareText = (text: string, mentionHashtagColor: string) => {
    const result = []

    let mentList = children.match(/[@#][a-z0-9_\.]+/gi)
    if (mentList == null) {
      return [
        <StyledCustomText key="text" style={{ color: 'white' }}>
          {text}
        </StyledCustomText>,
      ]
    }

    for (let i = 0; i < mentList.length; i++) {
      const ment = mentList[i]
      const startIndex = text.indexOf(ment)
      const beforeMention = text.substring(0, startIndex)
      if (beforeMention) {
        result.push(
          <View key={`before_${i}`}>
            <StyledCustomText style={{ color: 'white' }}>
              {beforeMention}
            </StyledCustomText>
          </View>
        )
      }
      result.push(
        <Mention
          key={`mention_${i}`}
          mentionHashtagColor={mentionHashtagColor}
          text={ment}
          onPress={() => {
            Toast.show({
              type: 'info',
              text1: 'TODO',
              text2: `Mention or Hashtag Clicked ${ment}`,
            })
          }}
        />
      )
      text = text.substring(startIndex + ment.length)
    }

    if (text.length > 0) {
      result.push(
        <View key={`remaining_${mentList.length}`}>
          <StyledCustomText style={{ color: 'white' }}>{text}</StyledCustomText>
        </View>
      )
    }
    return result
  }
  return (
    <Text
      style={style}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {prepareText(children, mentionHashtagColor)}
    </Text>
  )
}

interface MentionProps {
  mentionHashtagColor: string
  text: string
  onPress: () => void
}

const Mention: React.FC<MentionProps> = ({
  mentionHashtagColor,
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <StyledCustomText
        style={{
          color: mentionHashtagColor || 'white',
        }}
        weight="bold"
      >
        {text}
      </StyledCustomText>
    </TouchableOpacity>
  )
}

export default MentionHashtagTextView
