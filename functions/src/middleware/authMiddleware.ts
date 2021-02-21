import { admin, db } from '../config/firebase'

const firebaseAuth = (req: any, res: any, next: any) => {
  let idToken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else {
    console.error('No token found')
    return res.status(403).json({ error: 'Unauthorized' })
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken
      return db
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then((data) => {
      req.user.userProp = data.docs[0].data().userId
      return next()
    })
    .catch((error) => {
      console.error('Error while verifying token', error)
      return res.status(403).json(error)
    })
  return
}

export { firebaseAuth }
