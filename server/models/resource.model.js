import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    booked: {
        type: Number,
        default: 0,
    },
    available: {
        type: Number,
        default: function(){
            return this.quantity;
        },
    }

});

const Resource = mongoose.model("Resource", ResourceSchema);

export default Resource;