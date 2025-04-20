import { MongoClient} from "mongodb";

const uri = "mongodb://localhost:27017";
const mongoClient = new MongoClient(uri);
let databaseInstance;

export async function connectToDB() {
    try{
        await mongoClient.connect();
        databaseInstance = mongoClient.db('Event-db');
        console.log('Connectd to MongoDB successfully');

        const collections = ['users', 'events', 'registration', 'admin'];

        await create_collection(collections);
    } catch (error){
        console.log('Database connection Failed:', error);
        throw error;
    }
}

// Function to create collections if they do not exist
async function create_collection(collections_name) {
    const existingCollections = await databaseInstance.listCollections().toArray();
    const namesOfExistingCollections = existingCollections.map(collection => collection.name);

    for (const name of collections_name) {
        if (!namesOfExistingCollections.includes(name)) {
            await databaseInstance.createCollection(name);
            console.log(`Collection ${name} created.`);
        } else {
            console.log(`Collection ${name} already exists.`);
        }
    }
}

// Retrieves the 'users' collection from the database
export async function user_db() {
    return db_instance().collection('users');
}

// Retrieves the 'events' collection from the database
export async function events_db() {
    return db_instance().collection('events');
}

// Retrieves the 'registration' collection from the database
export async function registration_db() {
    return db_instance().collection('registration');
}

// Retrieves the 'admin' collection from the database
export async function admin_db() {
    return db_instance().collection('admin');
}

export function db_instance() {
    return databaseInstance;
}

// Function to close the database connection
export async function closeDBConnection() {

    await mongoClient.close();
    console.log('Database connection closed.');

}

export default {db_instance, closeDBConnection}