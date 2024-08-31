require('dotenv').config()

import express, { Router } from 'express'
import { ObjectId } from 'mongodb'

import db from './utils/db'

const app = express()
const port = 9001

const router = Router()

router.get('/item/:id', async (req, res) => {
  const id = req.params.id

  // TODO: Fetch item from MongoDB
  const item = await db.collection('items')
    .findOne({ _id: ObjectId.createFromHexString(id) })

  res.json({ item })
})

router.get('/item', async (req, res) => {
  // TODO: Fetch items from MongoDB
  const items = await db.collection('items')
    .find({}).toArray()

  res.json({ items })
})

router.post('/item/create', async (req, res) => {
  const body = req.body

  if (!body.todo || !body.time) {
    res.status(400).json({ message: 'Invalid request' })
    return
  }

  const data = {
    todo: body.todo,
    time: new Date(body.time),
  }

  // TODO: Insert data to MongoDB
  await db.collection('items')
    .insertOne(data)

  res.json({ data })
})

router.delete('/item/:id', async (req, res) => {
  const id = req.params.id

  // TODO: Delete item from MongoDB
  await db.collection('items')
    .deleteOne({ _id: ObjectId.createFromHexString(id) })

  res.json({ message: 'Item deleted' })
})

app.use(express.json())
app.use('/', router)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})