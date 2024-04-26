import mongoose from "mongoose"

const todoSchema = new mongoose.Schema ({
  content: {
    type: String,
    required: true,
  },
  conplete: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // the name inside the user.model schema
  },
  subTodos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTodo"
    }
  ], // array of sub todos

}, {timestamps: true})

export const Todo = mongoose.model("Todo", todoSchema)