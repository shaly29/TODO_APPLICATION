//Require mongoose
const mongoose = require('mongoose'); 


const todoSchema = new mongoose.Schema({
     item:{
        type:String,
        require:true
     }
    }); 


module.exports = mongoose.model('Todo', todoSchema);

