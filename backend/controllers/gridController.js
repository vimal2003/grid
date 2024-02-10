const Grid=require('../modals/gridModal');
const Job=require('../modals/jobModal');

exports.getGrid = async (req, res) => {
    const { page = 1, pageSize = 2 } = req.query;
  
    try {
      const totalItems = await Grid.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);
  
      const gridData = await Grid.find().sort({_id:-1})
        .skip((page - 1) * pageSize)
        .limit(pageSize);
        const jobData = await Job.find().sort({_id:-1})
        .skip((page - 1) * pageSize)
        .limit(pageSize);
  
      return res.status(200).json({
        message: 'success',
        data1: gridData,
        data2:jobData,
        page: {
          currentPage: parseInt(page),
          totalPages: totalPages,
          pageSize: parseInt(pageSize),
          totalItems: totalItems,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'server error' });
    }
  };

exports.addGrid = async (req, res) => {
    try {
        const { name, email,age,role,degree,uniqueId} = req.body;
     if(!name||!email||!age||!role)
     return res.status(400).json({message:"required field missing"})
        
            const newChat = await Grid.create({
               name,email,age,uniqueId
            });
            const newJob=await Job.create({
              role,degree,uniqueId
           });
            
            return res.status(200).json({ ch:{ ...newChat,...newJob} });
        
    } catch (error) {
        console.error(error, 'hh');
        return res.status(500).send({ message: "server error" });
    }
  }

  exports.updateGrid = async (req, res) => {
 
    try {
        const { name, email, age, role,degree } = req.body;
        const { id } = req.params; 
        const uniqueId=id
        if (!name && !email && !age && !role && !degree) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        const existingGrid = await Grid.findOne({uniqueId});
        const existingJob = await Job.findOne({uniqueId});
        //console.log(existingGrid)
        if (!existingGrid||!existingJob) {
            return res.status(404).json({ message: "Grid not found" });
        }

        if (name) existingGrid.name = name;
        if (email) existingGrid.email = email;
        if (age) existingGrid.age = age;
        if (role) existingJob.role = role;
       if(degree) existingJob.degree=degree;                   
        await existingGrid.save();
        await existingJob.save();
        return res.status(200).json({ ch:{ ...existingGrid,...existingJob} });

    } catch (error) {
        console.error(error, 'hh');
        return res.status(500).send({ message: "Server error" });
    }
}

exports.deleteGrid = async (req, res) => {
  // console.log(req.params)
  try {
      const { id } = req.params;

      if (!id) {
          return res.status(400).json({ message: "ID parameter is missing" });
      }
      const uniqueId=id;
      const data=await Grid.findOne({uniqueId})
      const job=await Job.findOne({uniqueId})
      const deletedGrid = await Grid.findByIdAndDelete(data._id);
      const deletedJob = await Job.findByIdAndDelete(job._id);

      if (!deletedGrid||!deletedJob) {
          return res.status(404).json({ message: "Grid not found" });
      }

      return res.status(200).json({ message: "Grid deleted successfully" });

  } catch (error) {
      console.error(error, 'hh');
      return res.status(500).send({ message: "Server error" });
  }
}
