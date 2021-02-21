import { Note } from './noteModel'
import { Task } from './taskModel'

interface Container {
  id: string
  capacity: number
  type: string
  name: string
  wineryId: string
  createdAt: string
  tasks?: Task[]
  notes?: Note[]
}

export { Container }
