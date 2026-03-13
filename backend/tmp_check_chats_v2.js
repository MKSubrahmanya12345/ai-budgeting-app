import mongoose from 'mongoose';
import Chat from './models/chat.js';
import User from './models/user.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function checkChats() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not found in .env");
      return;
    }
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");
    
    const users = await User.find().limit(5);
    console.log(`Found ${users.length} users.`);
    for (const u of users) {
      const chats = await Chat.find({ userId: u._id });
      console.log(`User: ${u.email} (${u._id}) - Chats: ${chats.length}`);
      chats.forEach(c => console.log(`  - [${c._id}] ${c.title} (${c.messages.length} msgs)`));
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkChats();
