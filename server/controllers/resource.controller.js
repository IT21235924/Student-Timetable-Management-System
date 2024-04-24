import Resource from "../models/resource.model.js";

//Create
export const addResource = async (req, res) => {
    try {

      //validate admin
      const userRole = req.user.role
      if(userRole != "Admin"){
        return res.status(500).json({error: 'Unauthorized'})
      }

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

      //validate admin
      const userRole = req.user.role
      if(userRole != "Admin"){
        return res.status(500).json({error: 'Unauthorized'})
      }

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

      //validate admin
      const userRole = req.user.role
      if(userRole != "Admin"){
        return res.status(500).json({error: 'Unauthorized'})
      }

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

  //update quantity
  export const updateResourceQuantity = async (req, res) => {
    try {
      const resourceId = req.params.id;
      const { amount } = req.body;
  
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
  
      resource.quantity = resource.quantity + amount;

      resource.available = resource.available + amount;
  
      await resource.save();
      res.status(200).json({ message: "Resource quantity updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };

  //book resource
  export const bookResource = async (req, res) => {
    try{
        const resourceId = req.params.id;
        const { amount } = req.body;

        const resource = await Resource.findById(resourceId);

        if(!resource) {
            return res.status(404).json({error: "Resource not found" });
        }

        if(amount > resource.available){
            return res.status(404).json({ message: "You can't book more than available you idiot!" });
        }

        resource.booked = resource.booked + amount;
        resource.available = resource.available - amount;

        await resource.save();
        res.status(200).json({ message: "Resource quantity updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
  }

  //Release resource
  export const releaseResource = async (req, res) => {
    try{
        const resourceId = req.params.id;
        const { amount } = req.body;

        const resource = await Resource.findById(resourceId);

        if(!resource) {
            return res.status(404).json({error: "Resource not found" });
        }

        if(amount > resource.booked){
            return res.status(404).json({ message: "invalid amount!!!" });
        }

        resource.booked = resource.booked - amount;
        resource.available = resource.available + amount;

        await resource.save();
        res.status(200).json({ message: "Resource quantity updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
  }