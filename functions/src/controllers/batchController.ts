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
  } catch (error) {
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
      createdAt: new Date().toISOString(),
    }

    batch.set(batchObject)

    res.status(200).send({
      status: 'success',
      message: 'Batch added successfully!',
      data: batchObject,
    })
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export { getContainerBatches, addBatch, editBatch, deleteBatch }
