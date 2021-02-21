import * as functions from 'firebase-functions'
import * as express from 'express'
import { signUpUser, loginUser } from './controllers/authController'
import {
  addWinery,
  getAllWineries,
  editWinery,
  deleteWinery,
} from './controllers/wineryController'
import {
  editUser,
  getUser,
  getUserWithWineries,
} from './controllers/userController'
import {
  addContainer,
  editContainer,
  deleteContainer,
} from './controllers/containerController'
import { addBatch, editBatch, deleteBatch } from './controllers/batchController'
import { firebaseAuth } from './middleware/authMiddleware'

const app = express()

//--------------AUTH ROUTES-------------//
app.post('/signup', signUpUser)
app.post('/login', loginUser)

//--------------USER ROUTES-------------//
app.get('/user', firebaseAuth, getUser)
app.patch('/user', firebaseAuth, editUser)
app.get('/userWithWineries', firebaseAuth, getUserWithWineries)

//--------------WINERY ROUTES-------------//
app.get('/wineries', firebaseAuth, getAllWineries)
app.post('/winery', firebaseAuth, addWinery)
app.patch('/winery/:wineryId', editWinery)
app.delete('/winery/:wineryId', deleteWinery)

//--------------CONTAINER ROUTES-------------//
app.post('/container', firebaseAuth, addContainer)
app.patch('/container/:containerId', editContainer)
app.delete('/container/:containerId', deleteContainer)

//--------------BATCH ROUTES-------------//
app.post('/batch', firebaseAuth, addBatch)
app.patch('/batch/:batchId', editBatch)
app.delete('/batch/:batchId', deleteBatch)

exports.api = functions.region('europe-west1').https.onRequest(app)
