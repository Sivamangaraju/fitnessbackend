const express=require('express')
const app=express()
const connectDB=require('./database/connect')
const tasks=require('./routes/tasks')
const cors = require('cors');

require('dotenv').config()

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//middleware
//const cors = require('cors');
// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// OR, Enable CORS for specific origin (your frontend)

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If you need to send cookies or authorization headers
}));

app.use('/api/v1/users',tasks)

const port=process.env.PORT || 3000;

const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log("Server is Running"))
    } catch (error) {
        console.log(error)
    }
}

start()
















console.log("Hello Welcome to Node Backend")