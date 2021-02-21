import { Response } from 'express'
import { db } from '../config/firebase'
import { UserType } from '../models/userModel'
import { WineryType } from '../models/wineryModel'

type RequestUser = {
  uid: string
}

type Request = {
  body: UserType
  user?: RequestUser
  params: { userId: string }
}

const getUserWithWineries = async (req: Request, res: Response) => {
  try {
    let userWineries: WineryType[] = []
    const querySnapshot = await db
      .collection('wineries')
      .where('ownerId', '==', req.user?.uid)
      .get()
    querySnapshot.forEach((doc: any) => {
      userWineries.push(doc.data())
    })
    const user = await (await db.doc(`users/${req.user?.uid}`).get()).data()
    const userObject = {
      userId: user?.userId,
      firstName: user?.firstName,
      email: user?.email,
      wineries: userWineries,
    }
    return res.status(200).json(userObject)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

export { getUserWithWineries }
