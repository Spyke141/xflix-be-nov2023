const mongoose = require('mongoose');
const config = require("./config/config");
const app = require("./app");

const startMongo = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options)
         .then(() => console.log("connected to mongo DB"))
         .catch(err => console.log(err));

    app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}!`)
    });
  } catch (err) {
    throw err;
  }
}

startMongo();
