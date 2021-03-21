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
    parentId: string
  }
}

//-----------GET NOTE BY ID----------//
const getNoteById = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const noteRef = db.collection('notes').doc(req.params.noteId)
    const note = await noteRef.get()
    return res.status(200).json(note.data())
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY PARENT ID----------//
const getParentNotes = async (req: Request, res: Response) => {
  try {
    const parentNotes: Note[] = []
    const querySnapshot = await db
      .collection('notes')
      .where('parentId', '==', req.params.parentId)
      .get()
    querySnapshot.forEach((doc: any) => {
      parentNotes.push(doc.data())
    })
    return res.status(200).json(parentNotes)
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

  const { body, parentId } = req.body
  try {
    const note = db.collection('notes').doc()
    const noteObject: Note = {
      id: note.id,
      authorUserId: req.user.uid,
      createdAt: new Date().toISOString(),
      body,
      parentId,
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
      parentId: currentData.parentId,
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
  getNoteById,
  getParentNotes,
  addNote,
  editNote,
  deleteNote,
}
