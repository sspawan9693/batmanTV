import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //The one who is subscribing
        ref: "User"
    },

    channel: {
        type: Schema.Types.ObjectId, //to whom user is subscribing
        ref: "User"
    }

},{timestamps: true})

subscriptionSchema.plugin(mongooseAggregatePaginate)

subscriptionSchema.index(
    {
        subscriber: 1,
        channel: 1
    },
    {
        unique: true
    }
)

export const Subscription = mongoose.model("Subscription",subscriptionSchema)
