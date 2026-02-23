export const MONGO_URI = process.env.MONGO_URI || "mongodb://0.0.0.0:27017/freely";
export const RELAY_URLS = process.env.RELAY_URLS ? process.env.RELAY_URLS.split(",") : ["wss://relay.damus.io"];