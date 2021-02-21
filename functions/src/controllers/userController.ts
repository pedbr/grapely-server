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
}

//================GET USER================//
const getUser = async (req: Request, res: Response) => {
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  try {
    const user = (await db.doc(`users/${req.user.uid}`).get()).data()
    if (!user)
      return res
        .status(403)
        .json({ general: 'User not found, please try again' })
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//=============EDIT USER===============//
const editUser = async (req: Request, res: Response) => {
  const {
    body: { firstName, lastName, company, role },
  } = req
  if (!req.user)
    return res
      .status(403)
      .json({ general: 'Authentication error, please try again' })

  try {
    const user = db.collection('users').doc(req.user.uid)
    const currentData = (await user.get()).data() || {}
    const userObject: User = {
      userId: currentData.userId,
      email: currentData.email,
      firstName: firstName || currentData.firstName,
      lastName: lastName || currentData.lastName,
      createdAt: currentData.createdAt,
      company: company || currentData.company,
      role: role || currentData.role,
    }

    await user.set(userObject).catch((error) => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: userObject,
    })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

//=============GET USER W/ WINERIES===============//
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

export { getUserWithWineries, getUser, editUser }
