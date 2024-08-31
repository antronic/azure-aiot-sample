import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGO_DB_CONNECTION_STRING || ''

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})


const db = client.db('aiot-todo')
export default db