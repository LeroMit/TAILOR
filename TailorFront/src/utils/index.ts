import { Comment } from '@/types'

/**
 * Flattens nested replies into a single array
 * @param replies Comment[]
 * @returns
 */
export const flattenReplies = (replies: Comment[]) => {
  let flattened = []

  const traverse = (reply) => {
    flattened.push(reply) // Add current reply to flattened array

    if (reply.replies && reply.replies.length > 0) {
      reply.replies.forEach((nestedReply: Comment) => {
        traverse(nestedReply) // Recursively look into each reply
      })
    }
  }

  // Iterate over each reply in the array and traverse to flatten replies
  if (replies && Array.isArray(replies)) {
    replies.forEach((reply) => {
      traverse(reply)
    })
  }
  return flattened
}

/**
 * Calculates the total number of comments including replies
 * @param comments Comment[]
 * @returns
 */
export const calculateTotalComments = (comments: Comment[]) => {
  let totalCount = comments.length // Initial count of direct comments

  // Recursively count replies
  comments.forEach((comment: Comment) => {
    if (comment.replies && comment.replies.length > 0) {
      totalCount += calculateTotalComments(comment.replies)
    }
  })
  return totalCount
}

/**
 * Random hex color
 * @returns {string}
 */
export const hexy = () => {
  const hex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']
  let hexColor = '#'
  for (let i = 0; i < 6; i++) {
    hexColor += hex[Math.floor(Math.random() * 14)]
  }
  return hexColor
}

export interface MediaRef {
  play: () => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  stop: () => Promise<void>
  mute: (mute: boolean) => Promise<void>
  unload: () => Promise<void>
}

export interface FlicksApiResponse {
  id: number
  title: string
  description: string
  url: string
  comments: CommentApi[]
  tags: TagApi[]
  postedBy: UserApi
  createdOn: Date
  updatedOn: Date
}

export interface CommentApi {
  id: number
  message: string
  mentions?: UserApi[]
  postedBy: UserApi
  createdOn: Date
  updatedOn: Date
}

export interface TagApi {
  id: number
  label: string
  createdOn: Date
  updatedOn: Date
}

export interface UserApi {
  id: number
  bio: string
  photoUrl: string
  username: string
  firstName: string
  lastName: string
}

export interface UserFlickRequest {
  idFlick?: number
  watchedDuring: number
  isYay?: boolean
  isNay?: boolean
  isLiked?: boolean
  isShared?: boolean
  latitude?: string
  longitude?: string
  watchedAt: string
}
