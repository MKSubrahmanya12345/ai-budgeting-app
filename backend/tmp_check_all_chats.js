import mongoose from 'mongoose';
import Chat from './models/chat.js';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkAllChats() {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log("Connected.");
    
    const chats = await Chat.find().populate('userId', 'email name');
    console.log(`Total chats in DB: ${chats.length}`);
    chats.forEach(c => {
      console.log(`ID: ${c._id} | User: ${c.userId?.email || 'N/A'} | Title: ${c.title} | Msgs: ${c.messages.length}`);
    });
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkAllChats();
