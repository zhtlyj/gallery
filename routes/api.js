import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define NFT Schema
const nftSchema = new mongoose.Schema({
    image: String,
    id: Number,
    name: String,
    attributes: [{
        trait_type: String,
        value: String
    }],
    owner: String,
    price: String,
    description: String,
    CID: String,
    isListed: Boolean,
    createdAt: Date,
    updatedAt: Date
});

// 确保模型名称与集合名称匹配
const NFT = mongoose.model('NFTS', nftSchema, 'NFTS');

// GET /api/nfts - Get all NFTs
router.get('/nfts', async (req, res) => {
    console.log('NFTs endpoint called');
    try {
        // 检查数据库连接状态
        console.log('Database connection state:', mongoose.connection.readyState);
        
        // 列出所有集合
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        const count = await NFT.countDocuments();
        console.log(`Found ${count} NFTs in database`);

        // 尝试获取所有数据而不过滤字段
        const allNfts = await NFT.find().lean();
        console.log('All NFT data:', JSON.stringify(allNfts, null, 2));

        const nfts = await NFT.find()
            .sort({ id: 1 })
            .select('image name owner description')
            .lean();
        
        console.log('Retrieved NFTs:', JSON.stringify(nfts, null, 2));
        
        if (nfts.length === 0) {
            console.log('No NFTs found in database');
            // 返回更详细的信息
            return res.status(404).json({
                error: 'No NFTs found',
                collectionsAvailable: collections.map(c => c.name),
                databaseName: mongoose.connection.name,
                connectionState: mongoose.connection.readyState
            });
        }
        
        res.json(nfts);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ 
            error: 'Failed to fetch NFTs',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /api/test - Test database connection
router.get('/test', async (req, res) => {
    console.log('Test endpoint called');
    try {
        // 检查数据库连接状态
        const connectionState = mongoose.connection.readyState;
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        // 尝试查询 NFTS 集合
        const nftCount = await NFT.countDocuments();
        
        const response = {
            status: 'connected',
            connectionState,
            database: mongoose.connection.name,
            collections: collectionNames,
            nftCount,
            host: mongoose.connection.host,
            port: mongoose.connection.port
        };
        console.log('Test response:', response);
        res.json(response);
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router; 