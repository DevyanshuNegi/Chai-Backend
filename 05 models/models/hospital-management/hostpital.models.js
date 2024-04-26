import mongoose from "mongoose"

const hospitalSchema  = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String,
  },
  specializedIn: [
    {
      type: String
    }
  ]
}, {timestamps: true})

export const Hospital = mongoose.model("MedicalRecord", hospitalSchema)