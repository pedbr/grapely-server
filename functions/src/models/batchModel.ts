import { Container } from './containerModel'
import { Note } from './noteModel'
import { Task } from './taskModel'

interface Batch {
  id: string
  name: string
  amount: number
  year: number
  product: string
  type: string
  targetTemperature: number
  startDate: string
  estimatedEndDate: string
  endDate: string
  createdAt: string
  containers: Container[]
  tasks?: Task[]
  notes?: Note[]
}

export { Batch }
