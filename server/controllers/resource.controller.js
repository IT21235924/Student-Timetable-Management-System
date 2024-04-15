import Resource from "../models/resource.model.js";

//Create
export const addResource = async (req, res) => {
    try {
      const { type, quantity } = req.body;
  
      const newResource = new Resource({ type, quantity });
  
      await newResource.save();
      res.status(201).json({ message: "Resource added successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };

  //get all
  export const getAllResources = async (req, res) => {
    try {
      const resources = await Resource.find();
      res.status(200).json(resources);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };

  //get by type
  export const getResourcesByType = async (req, res) => {
    try {
      const resourceType = req.params.type;
  
      const resources = await Resource.find({ type: resourceType });
      if (!resources.length) {
        return res.status(404).json({ error: "No resources found for this type" });
      }
      res.status(200).json(resources);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };

  //delete
  export const deleteResource = async (req, res) => {
    try {
      const resourceId = req.params.id;
  
      const resource = await Resource.findByIdAndDelete(resourceId);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.status(200).json({ message: "Resource deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };