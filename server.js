require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const cors = require('cors');
const fs = require('fs').promises;
const path = require("path")

// express app
const app = express();



// cors
app.use(cors({
  // origin:["http://localhost:3000"],
  // credentials:true
  // none in server render
}));


// middleware
app.use(express.json())


app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})


// Importing Schema
require("./models/audioModel");
const Audio = mongoose.model("AudioModel")

require("./models/userModel")
const User = mongoose.model("User")

// routes

app.use('/api/user', userRoutes)
// connect to db
mongoose.connect(process.env.MONGO_URI)

  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
      
    })
  })
  .catch((error) => {
    console.log(error)
  })


 
const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory instead of on disk

const upload = multer({ storage: storage });

app.post("/upload-audio", upload.single("audio"), async (req, res) => {
  res.send('You are in upload-page')
  try {
    const audioFile = req.file; // Get the uploaded audio file
     const user_id = req.body.userId;
     console.log(user_id)

    if (!audioFile) {
      return res.status(400).json({ status: "error", message: "No audio file uploaded" });
    }

    // Save the audio file data to MongoDB
    await Audio.create({
      audio: audioFile.buffer, // Store audio data as buffer
      mimetype: audioFile.mimetype ,// Store MIME type of the audio file
       userId: user_id // Associate audio file with the user who uploaded it
    });

    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});





app.get("/get-audio", async (req, res) => {
  res.send('You are in get audio-page')
  try {
    const userId = req.query.userId;
     //console.log(userId)
    // Retrieve all audio files from the database
    const audioFiles = await Audio.find({userId});

    // Send the array of audio files to the client
    res.json({ status: "ok", audioData: audioFiles });
  } catch (error) {
    // Handle errors properly
    console.error("Error fetching audio files:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch audio files" });
  }
});



app.delete('/file/:id', async (req, res) => {
  const fileId = req.params.id;
  

  // Retrieve file metadata from database
  const file = await Audio.findById(fileId);
  
  
  // Delete file metadata from database
  await file.remove();

  res.send('File deleted successfully');
});