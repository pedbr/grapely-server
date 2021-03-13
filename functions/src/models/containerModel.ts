import { Batch } from './batchModel'
import { Note } from './noteModel'
import { Task } from './taskModel'
import { Winery } from './wineryModel'

interface Container {
  id: string
  capacity: number
  type: string
  name: string
  currentWineryId?: string
  currentWinery?: Winery
  currentBatch?: Batch
  createdAt: string
  tasks?: Task[]
  notes?: Note[]
}

export { Container }
