import express from 'express';
import dotenv from 'dotenv';

import { connectToDB, closeDBConnection } from './Database/database.mjs';
import { UserClass } from './Dashboard Methods/user.mjs';
import { AdminClass } from './Dashboard Methods/admin.mjs';
import { EventsClass } from './Dashboard Methods/event.mjs';
import { RegistrationClass } from './Dashboard Methods/registration.mjs';

dotenv.config()

const app = express();
const port = 2800;

app.use(express.json());

// Connect to MongoDB before starting the server
connectToDB().then(() => {
    console.log('Server is starting...');

    // Routes
    app.post('/register', async (req, res) => {
        const { name, username, password, email } = req.body;

        if (!name || !username || !password || !email) {
            return res.status(400).json({ success: false, message: 'Missing fields.' });
        }
        const user = new UserClass(name, username, password, email);
        try {
            const result = await user.constructor.register_user.call(user);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    });

    app.put('/update-password', async (req, res) => {
        const { email, prev_pass, new_pass } = req.body;

        if (!email || !prev_pass || !new_pass) {
            return res.status(400).json({ success: false, message: 'Missing fields.' });
        }
        try {
            const message = await UserClass.update_password(email, prev_pass, new_pass);
            res.json({ message });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    app.put('/forgot-password', async (req, res) => {
        const { email, new_pass } = req.body;

        if (!email || !new_pass) {
            return res.status(400).json({ success: false, message: 'Missing fields.' });
        }
        try {
            const message = await UserClass.forgot_password(email, new_pass);
            res.json({ message });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    app.post('/admin/register', async (req, res) => {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing fields.' });
        }
    
        try {
            const admin = new AdminClass(name, email, password);
            const result = await admin.register_admin();
            res.json(result);
        } catch (error) {
            console.error('/admin/register error:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    });
    

    app.put('/admin/update-password', async (req, res) => {
        const { email, new_pass } = req.body;

        if (!email || !new_pass) {
            return res.status(400).json({ success: false, message: 'Missing fields.' });
        }

        try {
            const result = await AdminClass.update_password(email, new_pass);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    });

    app.put('/admin/forgot-password', async (req, res) => {
        const { email, adminid, new_pass } = req.body;

        if (!email || !adminid || !new_pass) {
            return res.status(400).json({ success: false, message: 'Missing fields.' });
        }
        try {
            const result = await AdminClass.forgot_password(email, parseInt(adminid), new_pass);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    });

    app.put('/event/create-event', async (req,res) => {
        const {title, description, date, location, capacity} = req.body;

        if (!title || !description || !date || !location || !capacity){
            return res.status(400).json({success: false, message: 'Missing fields.'});
        }
        try{
            const event = new EventsClass(title, description, date, location, capacity);
            const result = await event.create_event();
            res.status(201).json(result);
        }catch (error){
            res.status(500).json({success: false, message: 'Internal server error.'})
        }

    });

    app.get('/events', async (req, res) => {
        try {
            const result = await EventsClass.get_all_events();
            res.json(result);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to get events.' });
        }
    });

    app.get('/events/:id', async (req, res) => {
        try {
            const result = await EventsClass.get_event_by_id(req.params.id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to get event.' });
        }
    });

    app.put('/events/:id', async (req, res) => {
        const updates = req.body;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: 'No updates provided.' });
        }

        try {
            const result = await EventsClass.update_event(req.params.id, updates);
            res.json(result);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to update event.' });
        }
    });

    app.delete('/events/:id', async (req, res) => {
        try {
            const result = await EventsClass.delete_event(req.params.id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to delete event.' });
        }
    });

    app.patch('/events/:id/register', async (req, res) => {
        try {
            const success = await EventsClass.increment_registration_count(req.params.id);
            if (success) {
                res.json({ success: true, message: 'Registered successfully.' });
            } else {
                res.status(404).json({ success: false, message: 'Event not found.' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to register.' });
        }
    });

    app.patch('/events/:id/unregister', async (req, res) => {
        try {
            const success = await EventsClass.decrement_registration_count(req.params.id);
            if (success) {
                res.json({ success: true, message: 'Unregistered successfully.' });
            } else {
                res.status(404).json({ success: false, message: 'Event not found.' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to unregister.' });
        }
    });

    app.patch('/events/archive', async (req, res) => {
        try {
            const result = await EventsClass.archive_past_events();
            res.json(result);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to archive events.' });
        }
    });

    app.post('/register-to-event', async (req, res) => {
        const { user_email, event_id } = req.body;
    
        if (!user_email || !event_id) {
            return res.status(400).json({ success: false, message: 'Missing email or event ID.' });
        }
    
        const registration = new RegistrationClass(user_email, event_id);
        try {
            const result = await registration.register_user(user_email, event_id);
            res.json(result);
        } catch (error) {
            console.error('Error in /register-to-event:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    });
    
    app.patch('/cancel-registration', async (req, res) => {
        const { user_email, event_id } = req.body;
    
        if (!user_email || !event_id) {
            return res.status(400).json({ success: false, message: 'Missing email or event ID.' });
        }
    
        const registration = new RegistrationClass(user_email, event_id);
        try {
            const result = await registration.cancel_registration(user_email, event_id);
            res.json(result);
        } catch (error) {
            console.error('Error in /cancel-registration:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    });
    

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    process.on('SIGINT', async () => {
        await closeDBConnection();
        process.exit();
    });
}).catch(err => {
    console.error('Failed to start server due to DB error:', err);
});