import mongoose from "mongoose";

const ClassRoomSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
        unique: true,
    },
    Capacity: {
        type: Number,
        required: true,
    },
    Availability: {
        type: Boolean,
        default: true,
    }
});


const ClassRoom = mongoose.model("ClassRoom", ClassRoomSchema);

export default ClassRoom;