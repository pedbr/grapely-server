import { Response } from 'express'
import * as firebase from 'firebase'
import { db, firebaseConfig } from '../config/firebase'
import { UserType } from '../models/userModel'
import { isEmpty, isEmail } from '../utils/helpers'

type Request = {
  body: UserType
  params: { wineryId: string }
}

type Errors = {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
}

firebase.default.initializeApp(firebaseConfig)

//==============SIGN UP==============//
const signUpUser = async (req: Request, res: Response) => {
  let token: string | undefined
  let userId: string | undefined
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    firstName: req.body.firstName,
  }

  //-----------VALIDATION-------------//
  let errors: Errors = {}

  if (isEmpty(newUser.email)) {
    errors.email = 'Must not be empty.'
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address.'
  }

  if (isEmpty(newUser.password)) errors.password = 'Must not be empty'

  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = 'Password must match'

  if (isEmpty(newUser.firstName)) errors.firstName = 'Must not be empty'

  if (Object.keys(errors).length > 0) return res.status(400).json(errors)
  //----------------------------------//

  firebase.default
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data?.user?.uid
      return data?.user?.getIdToken()
    })
    .then((idToken) => {
      token = idToken
      const userCredentials = {
        firstName: newUser.firstName,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      }
      return db.doc(`/users/${userId}`).set(userCredentials)
    })
    .then(() => {
      res.status(201).json({ token })
    })
    .catch((error) => {
      console.error(error)
      if (error.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email already in use' })
      } else {
        return res.status(500).json({ error: error.code })
      }
    })
  return
}

//=================LOG IN=================//

const loginUser = async (req: Request, res: Response) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  }

  //-----------VALIDATION-------------//
  let errors: Errors = {}

  if (isEmpty(user.email)) errors.email = 'Must not be empty'
  if (isEmpty(user.password)) errors.password = 'Must not be empty'

  if (Object.keys(errors).length > 0) return res.status(400).json(errors)
  //----------------------------------//

  firebase.default
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data?.user?.getIdToken()
    })
    .then((token) => {
      return res.json({ token })
    })
    .catch((error) => {
      console.error(error)
      if (error.code === 'auth/wrong-password') {
        return res
          .status(403)
          .json({ general: 'Wrong credentials, please try again' })
      }
      return res.status(500).json({ error: error.code })
    })
  return
}

export { signUpUser, loginUser }
