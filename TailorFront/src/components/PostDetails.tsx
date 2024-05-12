import {
  Details,
  UserBox,
  UserIcon,
  UserName,
  Tags,
  MusicBox,
  MusicText,
} from '@/styles/feed'
import { FontAwesome } from '@expo/vector-icons'
import AutoScroll from '@homielab/react-native-auto-scroll'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity } from 'react-native'
import Toast from 'react-native-toast-message'
import CustomText from './CustomText'

interface PostDetailsProps {
  username: string
  tags: string[]
  music: string
}

const PostDetails: React.FC<PostDetailsProps> = ({ username, tags, music }) => {
  const onPress = (tag: string) => {
    Toast.show({
      type: 'info',
      text1: 'TODO',
      text2: tag + ' redirection, feature not implemented',
    })
  }

  /* Handling of Video Details */
  const handleUserRedirection = async () => {
    Toast.show({
      type: 'info',
      text1: 'TODO',
      text2: 'Handle user redirect',
    })
  }

  const handleMusicRedirection = async () => {
    Toast.show({
      type: 'info',
      text1: 'TODO',
      text2: 'Handle music redirect',
    })
  }
  return (
    <>
      <Details>
        <UserBox>
          <TouchableOpacity activeOpacity={0.7} onPress={handleUserRedirection}>
            <UserIcon name="face-man-profile" size={30} color="#f5f5f5" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={handleUserRedirection}>
            <UserName>@{username}</UserName>
          </TouchableOpacity>
        </UserBox>
        <Tags>
          <CustomText>
            {tags.map((tag, index) => (
              <TouchableOpacity key={index} onPress={() => onPress(tag)}>
                <CustomText
                  weight="bold"
                  style={{ fontSize: 12, color: 'white' }}
                >
                  #{tag}{' '}
                </CustomText>
              </TouchableOpacity>
            ))}
          </CustomText>
        </Tags>
        <MusicBox>
          <FontAwesome name="music" size={15} color="#f5f5f5" />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleMusicRedirection}
          >
            <AutoScroll style={{ marginLeft: 10, flex: 1 }}>
              <MusicText>{music}</MusicText>
            </AutoScroll>
          </TouchableOpacity>
        </MusicBox>
      </Details>
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', 'rgba(0,0,0,.8)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 998,
          height: '50%',
        }}
      />
    </>
  )
}

export default PostDetails
