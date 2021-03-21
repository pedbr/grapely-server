import { Note } from './noteModel'

interface Task {
  id: string
  authorUserId: string
  createdAt: string
  title: string
  description: string
  status: string
  dueDate: string
  assignedUser?: string
  wineryId?: string
  containerId?: string
  batchId?: string
  notes?: Note[]
}

export { Task }
