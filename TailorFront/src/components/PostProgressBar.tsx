import { PostProgressBarProps } from '@/types'
import { Dimensions, View } from 'react-native'

const PostProgressBar: React.FC<PostProgressBarProps> = ({ progress }) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignSelf: 'center',
        width: '90%',
        position: 'absolute',
        bottom: Dimensions.get('window').height * 0.095,
        height: 4,
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: `${progress}%`,
          borderRadius: 5,
          height: '100%',
          backgroundColor: 'orange',
          zIndex: 20,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 5,
          backgroundColor: '#9EA4A7',
          zIndex: 19,
        }}
      />
    </View>
  )
}

export default PostProgressBar
