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
  createdAt: string
  containerId: string
  endDate?: string
  tasks?: Task[]
  notes?: Note[]
}

export { Batch }
