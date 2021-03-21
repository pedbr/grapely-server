import { Container } from './containerModel'
import { Note } from './noteModel'
import { Task } from './taskModel'

interface Winery {
  id: string
  location: string
  name: string
  ownerId: string
  createdAt: string
  containers?: Container[]
  tasks?: Task[]
  notes?: Note[]
}

export { Winery }
