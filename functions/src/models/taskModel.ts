import { Note } from './noteModel'

interface Task {
  id: string
  authorUser: string
  assignedUser: string
  createdAt: string
  title: string
  description: string
  status: string
  dueDate: string
  notes?: Note[]
  wineryId?: string
  containerId?: string
  batchId: string
}

export { Task }
