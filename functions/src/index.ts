import * as functions from 'firebase-functions'
import * as express from 'express'
import { signUpUser, loginUser } from './controllers/authController'
import {
  addWinery,
  getMyWineries,
  editWinery,
  deleteWinery,
} from './controllers/wineryController'
import {
  editUser,
  getUser,
  getUserWithWineries,
} from './controllers/userController'
import {
  getWineryContainers,
  addContainer,
  editContainer,
  deleteContainer,
} from './controllers/containerController'
import {
  getContainerBatches,
  addBatch,
  editBatch,
  deleteBatch,
} from './controllers/batchController'
import {
  addTask,
  editTask,
  deleteTask,
  getMyTasks,
  getWineryTasks,
  getContainerTasks,
  getBatchTasks,
} from './controllers/taskController'
import {
  getWineryNotes,
  getContainerNotes,
  getBatchNotes,
  getTaskNotes,
  addNote,
  editNote,
  deleteNote,
} from './controllers/noteController'
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
app.get('/winery', firebaseAuth, getMyWineries)
app.post('/winery', firebaseAuth, addWinery)
app.patch('/winery/:wineryId', editWinery)
app.delete('/winery/:wineryId', deleteWinery)

//--------------CONTAINER ROUTES-------------//
app.get('/container/winery/:wineryId', getWineryContainers)
app.post('/container', firebaseAuth, addContainer)
app.patch('/container/:containerId', editContainer)
app.delete('/container/:containerId', deleteContainer)

//--------------BATCH ROUTES-------------//
app.get('/batch/container/:containerId', getContainerBatches)
app.post('/batch', firebaseAuth, addBatch)
app.patch('/batch/:batchId', editBatch)
app.delete('/batch/:batchId', deleteBatch)

//--------------TASK ROUTES-------------//
app.get('/task', firebaseAuth, getMyTasks)
app.get('/task/winery/:wineryId', getWineryTasks)
app.get('/task/container/:containerId', getContainerTasks)
app.get('/task/batch/:batchId', getBatchTasks)
app.post('/task', firebaseAuth, addTask)
app.patch('/task/:taskId', editTask)
app.delete('/task/:taskId', deleteTask)

//--------------NOTE ROUTES-------------//
app.get('/note/winery/:wineryId', getWineryNotes)
app.get('/note/container:containerId', getContainerNotes)
app.get('/note/batch/:batchId', getBatchNotes)
app.get('/note/task/:taskId', getTaskNotes)
app.post('/note', firebaseAuth, addNote)
app.patch('/note/:noteId', editNote)
app.delete('/note/:noteId', deleteNote)

exports.api = functions.region('europe-west1').https.onRequest(app)
