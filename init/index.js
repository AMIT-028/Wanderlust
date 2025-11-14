const mongoose=require('mongoose');
const initdata =require('./data.js');
const Listing=require('../models/listing.js');
main()
    .then(()=>{
        console.log('Connected to MongoDB');
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
   await mongoose.connect('mongodb://localhost:27017/mydatabase');
}
const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'68657145c99b3f5f0afd966e'}));
    await Listing.insertMany(initdata.data);
    console.log("Database was initialized");
}
initDB();