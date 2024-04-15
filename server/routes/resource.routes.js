import express from 'express'
import protectRoute from '../utils/protectRoute.js'
import {addResource, getAllResources, getResourcesByType, deleteResource, updateResourceQuantity, bookResource} from '../controllers/resource.controller.js'

const router = express.Router()

//create
router.post("/", addResource);

//get all
router.get("/", getAllResources);

//get by type
router.get("/:type", getResourcesByType);

//delete
router.delete("/:id", deleteResource);

//update quantity
router.put("/:id/quantity", updateResourceQuantity);

//book
router.put("/:id/book", bookResource);

export default router