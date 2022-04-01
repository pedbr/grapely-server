import { Response } from 'express'
import { db } from '../config/firebase'
import { Container } from '../models/containerModel'

type RequestUser = {
  uid: string
}

type Request = {
  body: Container
  user?: RequestUser
  params: {
    containerId: string
    currentWineryId: string
  }
}

//-----------GET MY CONTAINERS----------//
const getMyContainers = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const myContainers: Container[] = []
    const querySnapshot = await db
      .collection('containers')
      .where('ownerId', '==', req.user.uid)
      .get()
    querySnapshot.forEach((doc: any) => {
      myContainers.push(doc.data())
    })
    return res.status(200).json(myContainers)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------GET CONTAINER BY ID----------//
const getContainerById = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const containerRef = db.collection('containers').doc(req.params.containerId)
    const container = await containerRef.get()
    return res.status(200).json(container.data())
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY WINERY ID----------//
const getWineryContainers = async (req: Request, res: Response) => {
  try {
    const wineryContainers: Container[] = []
    const querySnapshot = await db
      .collection('containers')
      .where('currentWineryId', '==', req.params.currentWineryId)
      .get()
    querySnapshot.forEach((doc: any) => {
      wineryContainers.push(doc.data())
    })
    return res.status(200).json(wineryContainers)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------CREATE NEW----------//
const addContainer = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  const { name, capacity, type, currentWineryId } = req.body
  try {
    const container = db.collection('containers').doc()
    const containerObject: Container = {
      id: container.id,
      name,
      capacity,
      type,
      currentWineryId,
      ownerId: req.user.uid,
      createdAt: new Date().toISOString(),
    }

    container.set(containerObject)

    res.status(200).send({
      status: 'success',
      message: 'Container added successfully!',
      data: containerObject,
    })
  } catch (error: any) {
    res.status(500).json(error.message)
  }
  return
}

//-----------EDIT----------//
const editContainer = async (req: Request, res: Response) => {
  const {
    body: { name, capacity, type, currentWineryId },
    params: { containerId },
  } = req

  try {
    const container = db.collection('containers').doc(containerId)
    const currentData = (await container.get()).data() || {}
    const containerObject = {
      id: currentData.id,
      name: name || currentData.name,
      capacity: capacity || currentData.capacity,
      createdAt: currentData.createdAt,
      ownerId: currentData.ownerId,
      type: type || currentData.type,
      currentWineryId: currentWineryId || currentData.currentWineryId,
    }

    await container.set(containerObject).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Container updated successfully',
      data: containerObject,
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------DELETE----------//
const deleteContainer = async (req: Request, res: Response) => {
  const { containerId } = req.params

  try {
    const container = db.collection('containers').doc(containerId)

    await container.delete().catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Container deleted successfully',
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

export {
  getMyContainers,
  getContainerById,
  getWineryContainers,
  addContainer,
  editContainer,
  deleteContainer,
}
