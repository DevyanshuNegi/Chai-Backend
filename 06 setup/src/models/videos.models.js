import mongoose, {Schema} from "mongoose"
import mongooseAggregatePaginate from  "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true,
        
    },
    thumbnail : {
        type: String,
        required: true,
    },
    owner : {
        type: Schema.Types.ObjectId,
        ref : "Users",
        required : true,
    },
    title : {
        type : String,
        requierd: true,
        trim : true,
    },
    description: {
        type: String,
        // requierd: true,
        trim: true,
    },
    duration: {
        type: Number,
        default: 0
    },
    views : {
        type: Number,
    },
    isPublished : {
        type : Boolean,
        required: true,
        default : false,
    },


}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.Schema("Video", videoSchema)
