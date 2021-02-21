import { Response } from 'express'
import { db } from '../config/firebase'
import { Container } from '../models/containerModel'

type RequestUser = {
  uid: string
}

type Request = {
  body: Container
  user?: RequestUser
  params: { containerId: string }
}

//-----------CREATE NEW----------//
const addContainer = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  const { name, capacity, type, wineryId } = req.body
  try {
    const container = db.collection('containers').doc()
    const containerObject: Container = {
      id: container.id,
      name,
      capacity,
      type,
      wineryId,
      createdAt: new Date().toISOString(),
    }

    container.set(containerObject)

    res.status(200).send({
      status: 'success',
      message: 'Container added successfully!',
      data: containerObject,
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
  return
}

//-----------EDIT----------//
const editContainer = async (req: Request, res: Response) => {
  const {
    body: { name, capacity, type, wineryId },
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
      type: type || currentData.type,
      wineryId: wineryId || currentData.wineryId,
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
  } catch (error) {
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
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export { addContainer, editContainer, deleteContainer }
