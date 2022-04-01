import { Response } from 'express'
import { db } from '../config/firebase'
import { Winery } from '../models/wineryModel'

type RequestUser = {
  uid: string
}

type Request = {
  body: Winery
  user?: RequestUser
  params: { wineryId: string }
}

//-----------GET MY WINERIES----------//
const getMyWineries = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const myWineries: Winery[] = []
    const querySnapshot = await db
      .collection('wineries')
      .where('ownerId', '==', req.user.uid)
      .get()
    querySnapshot.forEach((doc: any) => {
      myWineries.push(doc.data())
    })
    return res.status(200).json(myWineries)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------GET WINERY BY ID----------//
const getWineryById = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const wineryRef = db.collection('wineries').doc(req.params.wineryId)
    const winery = await wineryRef.get()
    return res.status(200).json(winery.data())
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------CREATE NEW----------//
const addWinery = async (req: Request, res: Response) => {
  const { name, location } = req.body
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })
  try {
    const winery = db.collection('wineries').doc()
    const wineryObject: Winery = {
      id: winery.id,
      name,
      location,
      ownerId: req.user.uid,
      createdAt: new Date().toISOString(),
    }

    winery.set(wineryObject)

    res.status(200).send({
      status: 'success',
      message: 'Winery added successfully!',
      data: wineryObject,
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
  return
}

//-----------EDIT----------//
const editWinery = async (req: Request, res: Response) => {
  const {
    body: { name, location, ownerId },
    params: { wineryId },
  } = req

  try {
    const winery = db.collection('wineries').doc(wineryId)
    const currentData = (await winery.get()).data() || {}
    const wineryObject = {
      id: currentData.id,
      name: name || currentData.name,
      location: location || currentData.location,
      createdAt: currentData.createdAt,
      ownerId: ownerId || currentData.ownerId,
    }

    await winery.set(wineryObject).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Winery updated successfully',
      data: wineryObject,
    })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------DELETE----------//
const deleteWinery = async (req: Request, res: Response) => {
  const { wineryId } = req.params

  try {
    const winery = db.collection('wineries').doc(wineryId)

    await winery.delete().catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'Winery deleted successfully',
    })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export { addWinery, getWineryById, getMyWineries, editWinery, deleteWinery }
