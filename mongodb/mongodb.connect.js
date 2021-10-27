const mongoose = require("mongoose");
require('dotenv').config();

async function connect (){
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("Error connect to mongoDB", error);
  }
}

async function disconnect (){
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.log("Error disconnect to mongoDB", error);
  }
}

module.exports = {
  connect, disconnect
}