import { events_db } from "../Database/database.mjs";
import { AdminClass } from "./admin.mjs";
import { ObjectId } from "mongodb";

export class EventsClass{
    // Constructor to initialize a new event
    constructor(title, description, date, location, capacity){
        this.title = title;
        this.description = description;
        this.date = date;
        this.location = location;
        this.capacity = capacity;
        this.status = 'active'; // Event status (active, completed, etc.)
        this.registered = 0; // Number of registered users
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    // Method to create a new event and save to the DB
    async create_event(){
        try{
            const collection = await events_db();
            await collection.insertOne({ ...this}); // Insert the event object
            return { success: true, message: 'Event created successfully'};
        }catch(error){
            console.error('Error ehile creating event: ', error);
            return { success: false, message: "Failed to create event." };
        }
    }

    // Static method to update an existing event by its ID
    static async update_event(eventId, updates) {
        try {
            const collection = await events_db();
            updates.updated_at = new Date();
            const result = await collection.updateOne(
                { _id: new ObjectId(eventId) },
                { $set: updates }
            );
            if (result.modifiedCount > 0) {
                return { success: true, message: "Event updated." };
            }
            return { success: false, message: "Event not found or no changes made." };
        } catch (err) {
            console.error("Error in update_event:", err);
            return { success: false, message: "Failed to update event." };
        }
    }

    // Static method to delete an event by its ID
    static async delete_event(eventId) {
        try {
            const collection = await events_db();
            const result = await collection.deleteOne({ _id: new ObjectId(eventId) });
            if (result.deletedCount > 0) {
                return { success: true, message: "Event deleted." };
            }
            return { success: false, message: "Event not found." };
        } catch (err) {
            console.error("Error in delete_event:", err);
            return { success: false, message: "Failed to delete event." };
        }
    }

    // Static method to fetch a single event by ID
    static async get_event_by_id(eventId) {
        try {
            const collection = await events_db();
            const event = await collection.findOne({ _id: new ObjectId(eventId) });
            if (!event) return { success: false, message: "Event not found." };
            return { success: true, event };
        } catch (err) {
            console.error("Error in get_event_by_id:", err);
            return { success: false, message: "Failed to fetch event." };
        }
    }

    // Static method to get all events, with optional filters
    static async get_all_events(filters = {}) {
        try {
            const collection = await events_db();
            const events = await collection.find(filters).toArray();
            return { success: true, events };
        } catch (err) {
            console.error("Error in get_all_events:", err);
            return { success: false, message: "Failed to fetch events." };
        }
    }

    // Increment the number of registered users for an event
    static async increment_registration_count(eventId) {
        try {
            const collection = await events_db();
            const result = await collection.updateOne(
                { _id: new ObjectId(eventId) },
                { $inc: { registered: 1 } }
            );
            return result.modifiedCount > 0;
        } catch (err) {
            console.error("Error incrementing registration count:", err);
            return false;
        }
    }

    // Decrement the number of registered users for an event
    static async decrement_registration_count(eventId) {
        try {
            const collection = await events_db();
            const result = await collection.updateOne(
                { _id: new ObjectId(eventId) },
                { $inc: { registered: -1 } }
            );
            return result.modifiedCount > 0;
        } catch (err) {
            console.error("Error decrementing registration count:", err);
            return false;
        }
    }

    // Automatically archive past events (mark as completed)
    static async archive_past_events() {
        try {
            const collection = await events_db();
            const now = new Date();
            const result = await collection.updateMany(
                { date: { $lt: now }, status: "active" },
                { $set: { status: "completed", updated_at: new Date() } }
            );
            return { success: true, updated: result.modifiedCount };
        } catch (err) {
            console.error("Error archiving past events:", err);
            return { success: false, message: "Failed to archive events." };
        }
    }
}