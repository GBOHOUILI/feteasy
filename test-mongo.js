const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://eldomoreogbohouili_db_user:IPBhqylC3mUOZg24@cluster0.o71mjfe.mongodb.net/feteasy?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);

  await client.connect();

  console.log("CONNECTED");

  await client.close();
}

run().catch(console.error);
