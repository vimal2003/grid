const mongoose=require('mongoose');

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("connected to database")
    }).catch((err)=>{
        console.log(err,'err');
    })
}

module.exports=connectDatabase