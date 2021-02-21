import { Task } from './taskModel'
import { Winery } from './wineryModel'

interface User {
  userId: string
  email: string
  firstName: string
  createdAt: string
  lastName: string
  company?: string
  role?: string
  wineries?: Winery[]
  tasks?: Task[]
}

export { User }
