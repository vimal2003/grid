const mongoose=require('mongoose')

const gridSchema=new mongoose.Schema({
    name:{
        type:String,
       
    },
    email:{
        type:String,
       
    },
    age:{
        type:String
    },
    role:{
       type:String
    },
    uniqueId:{
        type:String
    }
})

module.exports=mongoose.model('grid',gridSchema);