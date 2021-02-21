import { Response } from 'express'
import { db } from '../config/firebase'

type WineryType = {
  name: string
  location: string
  ownerId: string
  createdAt: string
}

type RequestUser = {
  uid: string
}

type Request = {
  body: WineryType
  user?: RequestUser
  params: { wineryId: string }
}

//-----------GET ALL----------//
const getAllWineries = async (req: Request, res: Response) => {
  try {
    const allWineries: WineryType[] = []
    const querySnapshot = await db
      .collection('wineries')
      .orderBy('createdAt', 'desc')
      .get()
    querySnapshot.forEach((doc: any) => {
      doc.data().ownerId === req.user?.uid && allWineries.push(doc.data())
    })
    return res.status(200).json(allWineries)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//-----------CREATE NEW----------//
const addWinery = async (req: Request, res: Response) => {
  const { name, location } = req.body
  try {
    const winery = db.collection('wineries').doc()
    const wineryObject = {
      id: winery.id,
      name,
      location,
      ownerId: req.user?.uid,
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

export { addWinery, getAllWineries, editWinery, deleteWinery }
