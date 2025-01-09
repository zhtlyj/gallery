import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();

// 更新 CORS 配置
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// 添加一些基本的中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to test if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// MongoDB connection
try {
    await mongoose.connect('mongodb://127.0.0.1:27017/NFTS');
    console.log('Successfully connected to MongoDB.');
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
}

// Use API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`NFTs endpoint: http://localhost:${PORT}/api/nfts`);
}); 