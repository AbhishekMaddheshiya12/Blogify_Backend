import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    
})

export const Content = mongoose.models.Content||mongoose.model("Content", contentSchema);