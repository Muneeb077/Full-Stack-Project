import { UserClass } from "./user.mjs";
import { EventsClass } from "./event.mjs";
import { registration_db } from "../Database/database.mjs";


export class RegistrationClass {

    constructor(user_email, event_id, status = 'active'){
        // Set registration properties
        this.user_email = user_email;
        this.event_id = event_id;
        this.status = status;
        this.registered_at = new Date(); // Timestamp of registration
    }

    // Method to register a user for an event
    async register_user(user_email, event_id){
        try{
            // Check if user and event exist
            const email_exists = await UserClass.find_user(user_email);
            const event_exists = await EventsClass.get_event_by_id(event_id);

            if (!email_exists || !event_exists) return {success: false, message: 'Email or Event does not exists'};

            const collection = await registration_db();
            // Check if user is already registered for this event
            const registration = await collection.findOne(
                {
                    $and: [
                        {user_email: user_email},
                        {event_id: event_id},
                        {status: 'active'}
                    ]
                });
            if (registration){
                console.log('Registration already exists.');
                return {success: false, message: 'User already registered.'}
            }    
            // Register the user for the event
            await collection.insertOne({
                user_email: this.user_email,
                event_id: this.event_id,
                status: this.status,
                registered_at: this.registered_at
            });
            // Update event's registration count
            await EventsClass.increment_registration_count(this.event_id);
            console.log('Successfully registered.')
            return{success: true, message: 'Successfully registered for the event.'}
        }catch (error){
            console.error('Error while registering: ', error);
            return {success: false, message: 'Failed to register for the event.'}
        }
    }

    // Method to cancel a user's registration for an event
    async cancel_registration(user_email,event_id){
        try{
            // Check if user and event exist
            const email_exists = await UserClass.find_user(user_email);
            const event_exists = await EventsClass.get_event_by_id(event_id);

            if (!email_exists || !event_exists) return {success: false, message: 'Email or Event does not exists'};

            const collection = await registration_db();
            // Check if an active registration exists
            const registration = await collection.findOne(
                {
                    $and: [
                        {user_email: user_email},
                        {event_id: event_id},
                        {status: 'active'}
                    ]
                });
            if (!registration){
                console.log('Registration does not exists.');
                return {success: false, message: 'Registration does not exists.'}
            }

            // Cancel the registration by updating its status
            const result = await collection.updateOne(
                {
                  user_email: user_email,
                  event_id: event_id,
                  status: 'active'
                },
                { $set: { 
                    status: 'cancelled',
                    cancelled_at: new Date()
                } }
              );              
            
            // If update was successful, decrement event registration count
            if (result.modifiedCount>0){
                await EventsClass.decrement_registration_count(event_id)
                console.log('Registration cancelled successfully.')
                return {success: true, message:'Registration cancelled successfully.'}
            }else{
                console.log('Registration not cancelled.')
                return {success: false, message:'Registration not cancelled.'}
            }

        }catch (error){
            console.error('Error while canceling registering: ', error);
            return {success: false, message: 'Failed to cancel the registeration for the event.'}
        }
    }

}