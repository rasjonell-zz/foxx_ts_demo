import { db } from "@arangodb";

const documents: [string] = ["users"];

documents.forEach((collection: string): void => {
  if (!db._collection(collection)) {
    db._createDocumentCollection(collection);
  } else if (module.context.isProduction) {
    console.debug(
      `collection ${collection} already exists. Leaving it untouched.`
    );
  }
});

const users: ArangoDB.Collection = db.users;

users.ensureIndex({
  unique: true,
  type: "hash",
  fields: ["username"]
});
