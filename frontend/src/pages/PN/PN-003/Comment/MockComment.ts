import type { Comment } from '../../types/comment'

export const MockComment: Omit<Comment, 'content'> = {
  id: '0',
  userId: '',
  username: '탐나라',
  createdAt: new Date().toISOString(),
  isMine: false,
}
