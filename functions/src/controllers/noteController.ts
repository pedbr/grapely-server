import { Response } from 'express'
import { db } from '../config/firebase'
import { Note } from '../models/noteModel'

type RequestUser = {
  uid: string
}

type Request = {
  body: Note
  user?: RequestUser
  params: {
    noteId: string
    wineryId: string
    containerId: string
    batchId: string
    taskId: string
  }
}

//-----------GET BY WINERY ID----------//
const getWineryNotes = async (req: Request, res: Response) => {
  try {
    const wineryNotes: Note[] = []
    const querySnapshot = await db
      .collection('notes')
      .where('wineryId', '==', req.params.wineryId)
      .get()
    querySnapshot.forEach((doc: any) => {
      wineryNotes.push(doc.data())
    })
    return res.status(200).json(wineryNotes)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY CONTAINER ID----------//
const getContainerNotes = async (req: Request, res: Response) => {
  try {
    const containerNotes: Note[] = []
    const querySnapshot = await db
      .collection('notes')
      .where('containerId', '==', req.params.containerId)
      .get()
    querySnapshot.forEach((doc: any) => {
      containerNotes.push(doc.data())
    })
    return res.status(200).json(containerNotes)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY BATCH ID----------//
const getBatchNotes = async (req: Request, res: Response) => {
  try {
    const batchNotes: Note[] = []
    const querySnapshot = await db
      .collection('notes')
      .where('batchId', '==', req.params.batchId)
      .get()
    querySnapshot.forEach((doc: any) => {
      batchNotes.push(doc.data())
    })
    return res.status(200).json(batchNotes)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY TASK ID----------//
const getTaskNotes = async (req: Request, res: Response) => {
  try {
    const taskNotes: Note[] = []
    const querySnapshot = await db
      .collection('notes')
      .where('taskId', '==', req.params.taskId)
      .get()
    querySnapshot.forEach((doc: any) => {
      taskNotes.push(doc.data())
    })
    return res.status(200).json(taskNotes)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------CREATE NEW----------//
const addNote = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  const { body, wineryId, containerId, batchId, taskId } = req.body
  try {
    const note = db.collection('notes').doc()
    const noteObject: Note = {
      id: note.id,
      authorUserId: req.user.uid,
      createdAt: new Date().toISOString(),
      body,
      wineryId,
      containerId,
      batchId,
      taskId,
    }

    note.set(noteObject)

    res.status(200).send({
      status: 'success',
      message: 'Note added successfully!',
      data: noteObject,
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
  return
}

//-----------EDIT----------//
const editNote = async (req: Request, res: Response) => {
  const {
    body: { body },
    params: { noteId },
  } = req

  try {
    const note = db.collection('notes').doc(noteId)
    const currentData = (await note.get()).data() || {}
    const noteObject: Note = {
      id: currentData.id,
      authorUserId: currentData.authorUserId,
      createdAt: currentData.createdAt,
      body: body || currentData.body,
      containerId: currentData.containerId,
      batchId: currentData.batchId,
      wineryId: currentData.wineryId,
      taskId: currentData.taskId,
    }

    await note.set(noteObject).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Note updated successfully',
      data: noteObject,
    })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------DELETE----------//
const deleteNote = async (req: Request, res: Response) => {
  const { noteId } = req.params

  try {
    const note = db.collection('notes').doc(noteId)

    await note.delete().catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Note deleted successfully',
    })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export {
  getWineryNotes,
  getContainerNotes,
  getBatchNotes,
  getTaskNotes,
  addNote,
  editNote,
  deleteNote,
}
