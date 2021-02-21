interface Note {
  id: string
  authorUser: string
  createdAt: string
  body: string
  wineryId?: string
  containerId?: string
  batchId?: string
  taskId: string
}

export { Note }
