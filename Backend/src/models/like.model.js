import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        index: true
    },

    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        index: true
    },

    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }


}, { timestamps: true })

likeSchema.plugin(mongooseAggregatePaginate)

export const Like = mongoose.model("Like", likeSchema)