import { TextStyle, ViewStyle } from 'react-native'
import ViewShot from 'react-native-view-shot'

export interface Post {
  id: number
  username: string
  tags: string[]
  music: string
  likes: number
  comments: Comment[]
  uri: string
}

export interface PostData {
  id: number
  isLiked: boolean
  isShared: boolean
  isYay: boolean
  isNay: boolean
  watchingTime: number
}

export interface Comment {
  id: number
  username: string
  avatar: string
  posted_ago: string
  text: string
  likes: number
  replies: Comment[]
  allReplies?: Comment[]
}

export interface SearchItem {
  name: string
  chosen?: string
  followed?: boolean
  type: 'found' | 'notFound'
}

export interface SearchTagItem {
  name: string
  type: 'tailor'
}

export interface SearchTagProps {
  item: TailorItem | DataCarouselItem
  index: number
  removeTailor?: boolean
}

export interface TailorItem {
  profilePicture: any
  creator: string
  name: string
  tags: string[]
}

export interface DataCarouselItem {
  id: number
  name: string
  tags?: string[]
  isFavorite: boolean
}

export interface DataEditTailorItem {
  title: string
  onPress: () => void
}

export interface BlockSettingsModalType {
  type: 'blocks' | 'settings'
}

export interface BlockData {
  id: number
  name: string
  children: number[]
  row: number
  column: number
  type: 'tag' | 'hour' | 'end'
  percentage?: number
}

export interface ItemProps {
  item: DataCarouselItem
  index: number
  handleFavorite: (item: DataCarouselItem) => () => void
}

export interface DiscussionItem {
  conversationId: number
  profilePictureUrl: string
  name: string
  isSentByUser: boolean
  content: string
  isRead: boolean
  section: string
  updatedOn: Date
  createdOn: Date
}

export interface DiscussionProps {
  id: number
  profileImage: string
  name: string
  lastMessage: string
  sender: boolean | string
  seenDate: Date | boolean
  date: Date
  onPress?: () => void
}

export interface DiscussionListProps {
  discussions: DiscussionItem[]
  fetchDiscussion: (erase: boolean) => Promise<void>
  onDiscussionPress: (discussion: DiscussionItem) => void
}

export interface SearchReceiversModalProps {
  USER_ID: number
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export interface UserApi {
  id: number
  bio: string
  photoUrl: string
  firstName: string
  lastName: string
  username: string
  selectedTailorId: number | null
  tailors: []
  flicks: []
  createdOn: string
  updatedOn: string
  selected?: boolean
}

export interface Receiver {
  id: number
  name: string
  selected: boolean
}

export interface PostOverlayProps {
  item: Post
  setIsShared: React.Dispatch<React.SetStateAction<boolean>>
  setIsCurrentLiked: React.Dispatch<React.SetStateAction<boolean>>
  isActionBarOpen: boolean
  setIsActionBarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMuted: boolean
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>
  currentWatchingTime: number
}

export interface PostProgressBarProps {
  progress: number
}

export interface PostSingleProps {
  item: Post
  setCurrentPostData: React.Dispatch<React.SetStateAction<PostData>>
  isActionBarOpen: boolean
  setIsActionBarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMuted: boolean
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>
  ref: any
}

export interface BlockProps1 {
  squareWidth: number
  blockPos: BlockData
  index: number
  setBlockPos: (pos: BlockData, index: number) => void
  setMoving: (isMoving: boolean) => void
  draggingStyle?: ViewStyle
}

export interface BlockProps2 {
  squareWidth: number
  blockPos: { row: number; column: number }
  setBlockPos: (pos: { row: number; column: number }) => void
  setMoving: (isMoving: boolean) => void
  draggingStyle?: ViewStyle
  iconName?: string
  iconColor?: string
}

export interface BlocksModalProps {
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  data: DataEditTailorItem[]
}

export interface CanvaPosition {
  row: number
  column: number
}

export interface SquareProps {
  width: number
  position: CanvaPosition
  receptive: boolean
}

export interface FlowGraphProps {
  blocks: BlockData[]
  setBlocksBlockPos: (blockPos: BlockData, index: number) => void
  getBlockById: (id: number) => BlockData
  viewRef?: React.RefObject<ViewShot>
}

export interface ButtonGradientProps {
  colors: string[]
  text: string
  onPress: () => void
}

export interface Message {
  id: number
  receiver: boolean
  text: string
  date: Date
}

export interface ApiMessage {
  id: number
  writtenBy: {
    id: number
    bio: string
    photoUrl: string
    username: string
    firstName: string
    lastName: string
  }
  content: string
  createdOn: string
  updatedOn: string
}

export interface BlockSettingsModalProps {
  tailorModalType: BlockSettingsModalType['type']
  setTypeModal: React.Dispatch<
    React.SetStateAction<BlockSettingsModalType['type']>
  >
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  setHasBeenPressed: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  maxValue: number
  data: DataEditTailorItem[]
  setBlocks: React.Dispatch<React.SetStateAction<BlockData[]>>
  blocks: BlockData[]
}

export interface CommentProps {
  comment: Comment
  onReply: (username: string, commentId: number) => void
  isReply?: boolean
  allReplies?: Comment[]
}

export interface CommentsModalProps {
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  nbComments: number
  setNbComments: React.Dispatch<React.SetStateAction<number>>
  itemComments: Comment[]
  setItemComments: React.Dispatch<React.SetStateAction<Comment[]>>
}

export interface BlockProps {
  squareWidth: number
  blockPos: BlockData
  index: number
  setBlockPos: (pos: BlockData, index: number) => void
  setMoving: (isMoving: boolean) => void
  draggingStyle?: ViewStyle
}

export interface CustomModalProps {
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  Header: React.FC
  children?: React.ReactNode
  type: 'comments' | 'share'
  onCloseVoluntary?: () => void
}

export interface CustomTabBarIconProps {
  Icon: React.FC
  color: string
  isFocused: boolean
  routeName: string
}

export interface GradientTextProps {
  colors: string[]
  size: number
  [x: string]: any
  children: React.ReactNode
  style?: TextStyle
}

export interface MentionHashtagTextViewProps {
  children: string
  mentionHashtagColor?: string
  style?: TextStyle
  numberOfLines?: number
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
}

export interface Icon {
  title: string
  image: any
}

export interface myTailorApi {
  id: number
  title: string
  isLocked: boolean
  isPublic: boolean
  isFavourite: boolean
  createdBy: {
    id: number
    bio: string
    photoUrl: string
    username: string
    firstName: string
    lastName: string
  }
  createdOn: string
  updatedOn: string
}

export interface Tag {
  id: number
  label: string
  createdOn: Date
  updatedOn: Date
}
