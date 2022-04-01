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
    parentId: string
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
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------GET TASK BY ID----------//
const getTaskById = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const taskRef = db.collection('tasks').doc(req.params.taskId)
    const task = await taskRef.get()
    return res.status(200).json(task.data())
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY PARENT ID----------//
const getTasksByParentId = async (req: Request, res: Response) => {
  try {
    const parentTasks: Task[] = []
    const querySnapshot = await db
      .collection('tasks')
      .where('parentId', '==', req.params.parentId)
      .get()
    querySnapshot.forEach((doc: any) => {
      parentTasks.push(doc.data())
    })
    return res.status(200).json(parentTasks)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------CREATE NEW----------//
const addTask = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  const { title, description, status, dueDate, parentId } = req.body
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
      parentId,
    }

    task.set(taskObject)

    res.status(200).send({
      status: 'success',
      message: 'Task added successfully!',
      data: taskObject,
    })
  } catch (error: any) {
    res.status(500).json(error.message)
  }
  return
}

//-----------EDIT----------//
const editTask = async (req: Request, res: Response) => {
  const {
    body: { title, description, status, dueDate, parentId },
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
      parentId: parentId || currentData.parentId,
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
  } catch (error: any) {
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
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

export {
  getMyTasks,
  getTaskById,
  getTasksByParentId,
  addTask,
  editTask,
  deleteTask,
}
