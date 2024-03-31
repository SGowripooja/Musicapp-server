
const mongoose = require("mongoose");
const AudioSchema = new mongoose.Schema(
    {
      audio: Buffer, // Field to store audio data as a buffer
      mimetype: String, // Field to store the MIME type of the audio file
      userId: {
        type: String, // Assuming user ID is stored as ObjectId
        ref: 'User' // Reference to the User model
      }
    },
    {
      collection: "AudioDetails",
    }
  );

  mongoose.model("AudioModel", AudioSchema);