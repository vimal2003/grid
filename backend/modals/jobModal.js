const mongoose=require('mongoose')

const jobSchema=new mongoose.Schema({
   
    role:{
       type:String
    },
    degree:{
      type:String
    },
    userId:{
        type:String
    }
})

module.exports=mongoose.model('job',jobSchema);