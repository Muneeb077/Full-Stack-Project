import express from 'express';
import { connectToDB, closeDBConnection } from './Database/database.mjs';
import { UserClass } from './Dashboard Methods/user-login.mjs';
import dotenv from 'dotenv';

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
            console.error('/admin/register error:', error); // Log actual error
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

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    // Optional: Handle graceful shutdown
    process.on('SIGINT', async () => {
        await closeDBConnection();
        process.exit();
    });
}).catch(err => {
    console.error('Failed to start server due to DB error:', err);
});