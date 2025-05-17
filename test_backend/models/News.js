import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    en: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: String,
    },
    ta: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: String,
    },
    createdAt: { type: Date, default: Date.now },
  }, { collection: 'news' })

const News = mongoose.model('News', newsSchema);
newsSchema.index({ 'en.title': 'text', 'ta.title': 'text' });
newsSchema.index({ createdAt: -1 }); // For sorting by date

export default News; 