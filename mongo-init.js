db.auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);

db = db.getSiblingDB("kort");

const mongo_kort_username = process.env.MONGO_KORT_USERNAME
const mongo_kort_password = process.env.MONGO_KORT_PASSWORD

if ((mongo_kort_username && !mongo_kort_password) || (!mongo_kort_username && mongo_kort_password)   ) {
    var err =
      "Missing 'MONGO_KORT_USERNAME' or 'MONGO_KORT_PASSWORD' environment variable. "+
      "Both must be specified to create a kort db user";
    console.warn(err);
    throw new Error(err);
  }
else if (mongo_kort_username && mongo_kort_password) {
  db.createUser({
    user: process.env.MONGO_KORT_USERNAME,
    pwd: process.env.MONGO_KORT_PASSWORD,
    roles: [
      {
        role: "dbOwner",
        db: "kort",
      },
    ],
  });
}
