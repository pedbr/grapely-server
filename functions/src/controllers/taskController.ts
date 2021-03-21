import { Response } from 'express'
import { db } from '../config/firebase'
import { Task } from '../models/taskModel'

type RequestUser = {
  uid: string
}

type Request = {
  body: Task
  user?: RequestUser
  params: {
    taskId: string
    wineryId: string
    containerId: string
    batchId: string
  }
}

//-----------GET MY----------//
const getMyTasks = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const myTasks: Task[] = []
    const querySnapshot = await db
      .collection('tasks')
      .where('authorUserId', '==', req.user?.uid)
      .get()
    querySnapshot.forEach((doc: any) => {
      myTasks.push(doc.data())
    })
    return res.status(200).json(myTasks)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY WINERY ID----------//
const getWineryTasks = async (req: Request, res: Response) => {
  try {
    const wineryTasks: Task[] = []
    const querySnapshot = await db
      .collection('tasks')
      .where('wineryId', '==', req.params.wineryId)
      .get()
    querySnapshot.forEach((doc: any) => {
      wineryTasks.push(doc.data())
    })
    return res.status(200).json(wineryTasks)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY WINERY ID----------//
const getContainerTasks = async (req: Request, res: Response) => {
  try {
    const containerTasks: Task[] = []
    const querySnapshot = await db
      .collection('tasks')
      .where('containerId', '==', req.params.containerId)
      .get()
    querySnapshot.forEach((doc: any) => {
      containerTasks.push(doc.data())
    })
    return res.status(200).json(containerTasks)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY BATCH ID----------//
const getBatchTasks = async (req: Request, res: Response) => {
  try {
    const batchTasks: Task[] = []
    const querySnapshot = await db
      .collection('tasks')
      .where('batchId', '==', req.params.batchId)
      .get()
    querySnapshot.forEach((doc: any) => {
      batchTasks.push(doc.data())
    })
    return res.status(200).json(batchTasks)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------CREATE NEW----------//
const addTask = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  const {
    title,
    description,
    status,
    dueDate,
    wineryId,
    containerId,
    batchId,
  } = req.body
  try {
    const task = db.collection('tasks').doc()
    const taskObject: Task = {
      id: task.id,
      authorUserId: req.user.uid,
      createdAt: new Date().toISOString(),
      title,
      description,
      status,
      dueDate,
      wineryId,
      containerId,
      batchId,
    }

    task.set(taskObject)

    res.status(200).send({
      status: 'success',
      message: 'Task added successfully!',
      data: taskObject,
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
  return
}

//-----------EDIT----------//
const editTask = async (req: Request, res: Response) => {
  const {
    body: {
      title,
      description,
      status,
      dueDate,
      wineryId,
      containerId,
      batchId,
    },
    params: { taskId },
  } = req

  try {
    const task = db.collection('tasks').doc(taskId)
    const currentData = (await task.get()).data() || {}
    const taskObject: Task = {
      id: currentData.id,
      authorUserId: currentData.authorUserId,
      createdAt: currentData.createdAt,
      title: title || currentData.title,
      description: description || currentData.description,
      status: status || currentData.status,
      dueDate: dueDate || currentData.dueDate,
      containerId: containerId || currentData.containerId,
      batchId: batchId || currentData.batchId,
      wineryId: wineryId || currentData.wineryId,
    }

    await task.set(taskObject).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: taskObject,
    })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------DELETE----------//
const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params

  try {
    const task = db.collection('tasks').doc(taskId)

    await task.delete().catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export {
  getMyTasks,
  getWineryTasks,
  getContainerTasks,
  getBatchTasks,
  addTask,
  editTask,
  deleteTask,
}
