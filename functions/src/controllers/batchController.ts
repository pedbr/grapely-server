import { Response } from 'express'
import { db } from '../config/firebase'
import { Batch } from '../models/batchModel'

type RequestUser = {
  uid: string
}

type Request = {
  body: Batch
  user?: RequestUser
  params: {
    batchId: string
    currentContainerId: string
  }
}

//-----------GET MY BATCHES----------//
const getMyBatches = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const myBatches: Batch[] = []
    const querySnapshot = await db
      .collection('batches')
      .where('ownerId', '==', req.user.uid)
      .get()
    querySnapshot.forEach((doc: any) => {
      myBatches.push(doc.data())
    })
    return res.status(200).json(myBatches)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BATCH BY ID----------//
const getBatchById = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const batchRef = db.collection('batches').doc(req.params.batchId)
    const batch = await batchRef.get()
    return res.status(200).json(batch.data())
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------GET BY CONTAINER ID----------//
const getContainerBatches = async (req: Request, res: Response) => {
  try {
    const containerBatches: Batch[] = []
    const querySnapshot = await db
      .collection('batches')
      .where('currentContainerId', '==', req.params.currentContainerId)
      .get()
    querySnapshot.forEach((doc: any) => {
      containerBatches.push(doc.data())
    })
    return res.status(200).json(containerBatches)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------CREATE NEW----------//
const addBatch = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  const {
    name,
    amount,
    type,
    year,
    product,
    targetTemperature,
    startDate,
    estimatedEndDate,
    endDate,
    currentContainerId,
  } = req.body
  try {
    const batch = db.collection('batches').doc()
    const batchObject: Batch = {
      id: batch.id,
      name,
      amount,
      type,
      year,
      product,
      targetTemperature,
      startDate,
      estimatedEndDate,
      endDate,
      currentContainerId,
      ownerId: req.user.uid,
      createdAt: new Date().toISOString(),
    }

    batch.set(batchObject)

    res.status(200).send({
      status: 'success',
      message: 'Batch added successfully!',
      data: batchObject,
    })
  } catch (error: any) {
    res.status(500).json(error.message)
  }
  return
}

//-----------EDIT----------//
const editBatch = async (req: Request, res: Response) => {
  const {
    body: {
      name,
      amount,
      type,
      year,
      product,
      targetTemperature,
      startDate,
      estimatedEndDate,
      endDate,
      currentContainerId,
    },
    params: { batchId },
  } = req

  try {
    const batch = db.collection('batches').doc(batchId)
    const currentData = (await batch.get()).data() || {}
    const batchObject: Batch = {
      id: currentData.id,
      name: name || currentData.name,
      amount: amount || currentData.amount,
      createdAt: currentData.createdAt,
      ownerId: currentData.ownerId,
      type: type || currentData.type,
      year: year || currentData.year,
      product: product || currentData.product,
      targetTemperature: targetTemperature || currentData.targetTemperature,
      startDate: startDate || currentData.startDate,
      estimatedEndDate: estimatedEndDate || currentData.estimatedEndDate,
      endDate: endDate || currentData.endDate,
      currentContainerId: currentContainerId || currentData.currentContainerId,
    }

    await batch.set(batchObject).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Batch updated successfully',
      data: batchObject,
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

//-----------DELETE----------//
const deleteBatch = async (req: Request, res: Response) => {
  const { batchId } = req.params

  try {
    const batch = db.collection('batches').doc(batchId)

    await batch.delete().catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Batch deleted successfully',
    })
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

export {
  getMyBatches,
  getBatchById,
  getContainerBatches,
  addBatch,
  editBatch,
  deleteBatch,
}
