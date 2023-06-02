import { FwulfClient } from './modules/client'
import * as dotenv from 'dotenv'
dotenv.config()

const client = new FwulfClient()
client.init(process.env.token)