const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const verifyData = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!");

        const userCount = await User.countDocuments();
        console.log(`Total Users found: ${userCount}`);

        if (userCount > 0) {
            const users = await User.find().limit(5);
            console.log("Sample Users:");
            users.forEach(u => {
                console.log(`- UID: ${u.uid}, Name: ${u.name}`);
                if (u.lastPlan) {
                    console.log("  Last Plan:", JSON.stringify(u.lastPlan, null, 2));
                }
                if (u.savedPlans && u.savedPlans.length > 0) {
                    console.log("  Saved Plans (latest):", JSON.stringify(u.savedPlans[u.savedPlans.length - 1], null, 2));
                }
            });
        } else {
            console.log("No users found in the database yet.");
        }

        mongoose.connection.close();
    } catch (err) {
        console.error("Verification failed:", err);
    }
};

verifyData();
