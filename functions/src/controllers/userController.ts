import { Response } from 'express'
import { db } from '../config/firebase'
import { User } from '../models/userModel'
import { Winery } from '../models/wineryModel'

type RequestUser = {
  uid: string
}

type Request = {
  body: User
  user?: RequestUser
  params: { userId: string }
}

const getUser = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  try {
    const user = await (await db.doc(`users/${req.user.uid}`).get()).data()
    if (!user)
      return res
        .status(403)
        .json({ general: 'User not found, please try again' })
    const {
      userId,
      firstName,
      lastName,
      email,
      createdAt,
      company,
      role,
    } = user
    const userObject: User = {
      userId,
      firstName,
      lastName,
      email,
      createdAt,
      company,
      role,
    }
    return res.status(200).json(userObject)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const getUserWithWineries = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  try {
    let userWineries: Winery[] = []
    const querySnapshot = await db
      .collection('wineries')
      .where('ownerId', '==', req.user.uid)
      .get()
    querySnapshot.forEach((doc: any) => {
      userWineries.push(doc.data())
    })
    const user = await (await db.doc(`users/${req.user?.uid}`).get()).data()

    if (!user)
      return res
        .status(403)
        .json({ general: 'User not found, please try again' })

    const { userId, firstName, lastName, email, createdAt } = user
    const userObject: User = {
      userId,
      firstName,
      lastName,
      email,
      createdAt,
      wineries: userWineries,
    }
    return res.status(200).json(userObject)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export { getUserWithWineries, getUser }
