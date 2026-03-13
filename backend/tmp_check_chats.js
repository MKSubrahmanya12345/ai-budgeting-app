import mongoose from 'mongoose';
import Chat from './models/chat.js';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkChats() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    // Find a user (any user since we just want to see if data exists)
    const user = await User.findOne();
    if (!user) {
      console.log("No users found.");
      return;
    }
    
    const chats = await Chat.find({ userId: user._id });
    console.log(`Found ${chats.length} chats for user ${user.email}`);
    chats.forEach(c => console.log(` - ${c.title} (${c.messages.length} messages)`));
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkChats();
