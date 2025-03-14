const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://mongo:mongo@cluster2030.9fajz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2030";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        // await listDatabases(client);
        // await createListings(client, {name: "Nam1", password: "Nam1"})
        await createMultipleListings(client, [{name: "Nam2", password: "Nam2"}, {name: "Nam3", password: "Nam3"}]);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    
}
async function createMultipleListings(client, newListings) {
    const result = await client.db("Database").collection("Users").insertMany(newListings);

    console.log(`${result.insertedCount} New Listing created with the following id(s): `);
    console.log(result.insertedIds)
}   

async function createListings(client, newListing) {
    const result = await client.db("Database").collection("Users").insertOne(newListing);

    console.log(`New Listing created with the following id: ${result.insertedId}`);
}   

main().catch(console.error);

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
} 