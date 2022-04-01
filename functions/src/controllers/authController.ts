import { Response } from 'express'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import { db, firebaseConfig } from '../config/firebase'
import { User } from '../models/userModel'
import { isEmpty, isEmail } from '../utils/helpers'

interface AuthUser {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  company?: string
  role?: string
}

type Request = {
  body: AuthUser
  params: { wineryId: string }
}

type Errors = {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
}

firebase.default.initializeApp(firebaseConfig)

//==============SIGN UP==============//
const signUpUser = async (req: Request, res: Response) => {
  let token: string | undefined
  let userId: string | undefined
  const userCredentials: AuthUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    company: req.body.company,
    role: req.body.role,
  }

  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    company,
    role,
  } = userCredentials
  //-----------VALIDATION-------------//
  let errors: Errors = {}

  if (isEmpty(email)) {
    errors.email = 'Must not be empty.'
  } else if (!isEmail(email)) {
    errors.email = 'Must be a valid email address.'
  }

  if (isEmpty(password)) errors.password = 'Must not be empty'

  if (password !== confirmPassword)
    errors.confirmPassword = 'Password must match'

  if (isEmpty(firstName)) errors.firstName = 'Must not be empty'
  if (isEmpty(lastName)) errors.lastName = 'Must not be empty'

  if (Object.keys(errors).length > 0) return res.status(400).json(errors)
  //----------------------------------//

  firebase.default
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
      userId = data?.user?.uid

      if (userId) {
        admin.auth().setCustomUserClaims(userId, { role: 'default' })
      }

      return data?.user?.getIdToken()
    })
    .then((idToken): any => {
      if (!userId)
        return res
          .status(403)
          .json({ general: 'Authentication error, please try again' })

      token = idToken
      const newUser: User = {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
        userId,
        company,
        role,
      }
      return db.doc(`/users/${userId}`).set(newUser)
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
