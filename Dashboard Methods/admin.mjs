import { admin_db } from "../Database/database.mjs";
import bcrypt from 'bcrypt';

export class AdminClass {

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.adminid = null; // will be generated
    }

    // Generate random ID like 25xxx
    static generateAdminID() {
        const random = Math.floor(100 + Math.random() * 900); // 100–999
        return parseInt(`25${random}`); // e.g., 25123
    }

    // Register the admin
    async register_admin() {
        try {
            const collection = await admin_db();
    
            // Check if admin already exists by email
            const existing = await collection.findOne({ email: this.email });
            if (existing) {
                return { success: false, message: 'Admin already exists with this email.' };
            }
    
            // Generate a unique admin ID
            let newID;
            let idExists = true;
            while (idExists) {
                newID = AdminClass.generateAdminID();
                const existingID = await collection.findOne({ adminid: newID });
                idExists = !!existingID;
            }
    
            this.adminid = newID;
    
            // Hash password
            const hashedPassword = await bcrypt.hash(this.password, 10);
    
            await collection.insertOne({
                name: this.name,
                email: this.email,
                password: hashedPassword,
                adminid: this.adminid
            });
    
            return {
                success: true,
                message: 'Admin registered successfully.',
                adminid: this.adminid,
                email: this.email 
            };
    
        } catch (error) {
            console.error('Error in register_admin():', error);
            throw err; // re-throw to make the route return 500
        }
    }
    

    static async update_password(email, new_password) {
        const collection = await admin_db();
    
        const admin = await collection.findOne({ email });
        if (!admin) {
            return { success: false, message: 'Admin not found.' };
        }
    
        const hashedPassword = await bcrypt.hash(new_password, 10);
    
        const result = await collection.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );
    
        if (result.modifiedCount > 0) {
            return { success: true, message: 'Password updated successfully.' };
        } else {
            return { success: false, message: 'Password update failed.' };
        }
    }
    
    static async forgot_password(email, adminid, new_password) {
        const collection = await admin_db();
    
        const admin = await collection.findOne({ email, adminid });
        if (!admin) {
            return { success: false, message: 'Invalid email or admin ID.' };
        }
    
        const hashedPassword = await bcrypt.hash(new_password, 10);
    
        const result = await collection.updateOne(
            { email, adminid },
            { $set: { password: hashedPassword } }
        );
    
        if (result.modifiedCount > 0) {
            return { success: true, message: 'Password reset successfully.' };
        } else {
            return { success: false, message: 'Password reset failed.' };
        }
    }

    static async login_admin(email, password) {
        try {
            const collection = await admin_db();
            const admin = await collection.findOne({ email });

            if (!admin) {
                return { success: false, message: 'Invalid email or password.' };
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return { success: false, message: 'Invalid email or password.' };
            }

            // Optionally exclude the password from the returned admin info
            const { password: pw, ...adminInfo } = admin;

            return {
                success: true,
                message: 'Login successful.',
                admin: adminInfo
            };

        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, message: 'An error occurred during login.' };
        }
    }
    
}
