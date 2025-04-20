import { user_db } from "../Database/database.mjs";
import bcrypt from 'bcrypt';

export class UserClass {

    constructor(name, username, password, email){
        this.name = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.registration = 0;
    }

    static async register_user() {
        try {
            const collection = await user_db();
    
            // Check for existing username or email
            const existingUser = await collection.findOne({
                $or: [
                    { username: this.username },
                    { email: this.email }
                ]
            });
    
            if (existingUser) {
                console.log(`Registration failed: Username or email already registered.`);
                return { success: false, message: 'Username or email already exists.' };
            }
    
            // Hash the password before saving
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    
            // Insert the new user with hashed password
            await collection.insertOne({
                name: this.name,
                username: this.username,
                password: hashedPassword,
                email: this.email
            });
    
            console.log(`${this.username} (${this.email}) was registered successfully.`);
            return { success: true, message: 'User registered successfully.' };
    
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    
    static async update_password(email, prev_pass, new_pass) {
        const collection = await user_db();
        const user = await collection.findOne({ email });
        if (!user) {
            return 'Invalid credentials.';
        }
        // Compare the provided previous password with the stored hashed password
        const isMatch = await bcrypt.compare(prev_pass, user.password);
    
        if (!isMatch) {
            return 'Invalid credentials.';
        }
        // Hash the new password
        const saltRounds = 10;
        const hashedNewPass = await bcrypt.hash(new_pass, saltRounds);
        // Update the password in the database
        const result = await collection.updateOne(
            { email },
            { $set: { password: hashedNewPass } }
        );
        if (result.modifiedCount > 0) {
            return 'Password updated successfully.';
        } else {
            return 'Password update failed.';
        }
    }

    static async forgot_password(email, new_pass){
        const collection = await user_db();

        // Check if the user with given email exists
        const user = await collection.findOne({ email });
        if (!user) {
            return 'No user found with this email.';
        }
        // Hash the new password
        const saltRounds = 10;
        const hashedNewPass = await bcrypt.hash(new_pass, saltRounds);
        // Update the user's password
        const result = await collection.updateOne(
            { email },
            { $set: { password: hashedNewPass } }
        );

        if (result.modifiedCount > 0) {
            return 'Password has been reset successfully.';
        } else {
            return 'Password reset failed. Please try again.';
        }
    }

    static async find_user(identifier) {
        try {
            const collection = await user_db();
            // Try to find user by username or email
            const user = await collection.findOne({
                $or: [
                    { username: identifier },
                    { email: identifier }
                ]
            });
            if (!user) {
                return { success: false, message: 'User not found.' };
            }
            // Optionally exclude sensitive info like password
            const { password, ...userWithoutPassword } = user;
            return { success: true, user: userWithoutPassword };
    
        } catch (error) {
            console.error('Error finding user:', error);
            return { success: false, message: 'An error occurred while searching for the user.' };
        }
    }
    
}