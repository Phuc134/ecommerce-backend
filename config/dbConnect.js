const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.connect(process.env.MONGO_URL)
      .then(() => {
        console.log("Database Connected Successfully");
      })
      .catch((err) => {
        console.log("Database error");
      })
  } catch (error) {
    console.log("DAtabase error");
  }
};
module.exports = dbConnect;
