import mongoose, { Schema } from "mongoose"

const likeSchema = (
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
        likedBY: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {timestamps: true}
)

export const Like = mongoose.model("Like", likeSchema);