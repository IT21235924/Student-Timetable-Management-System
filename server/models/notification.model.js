import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    message: {
        type: String,
    }
})

const Notification = mongoose.model("notification", NotificationSchema);

export default Notification;