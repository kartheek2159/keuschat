import mongoose from 'mongoose'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import authroute from './routes/authroute.js'
import chatroute from './routes/chatroute.js'
import msgroute from './routes/msgroute.js'
import userroute from './routes/userroute.js'

// import fs from 'fs'
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));

const app=express()
app.use(bodyParser.json({limit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
app.use(cors())
dotenv.config()

mongoose.connect(process.env.mongo_db_url,{dbName:'ChatKeus'}).then(
    
    () => {
        app.listen(process.env.port, () => { console.log("connected to MongoDB"+process.env.port) })
    }
).catch((error) => {
    console.log(error)
})

app.use('/auth',authroute)
app.use('/chat',chatroute)
app.use('/msg',msgroute)
app.use('/user',userroute)