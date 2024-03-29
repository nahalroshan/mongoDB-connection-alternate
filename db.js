const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectDb: (callback) => {
    MongoClient.connect("mongodb://localhost:27017/bookstrore")
      .then((client) => {
        dbConnection = client.db();
        return callback();
      })
      .catch((err) => {
        console.log(err);
        return callback(err);
      });
  },
  getDb: () => dbConnection, // Corrected the function name to getDb
};
