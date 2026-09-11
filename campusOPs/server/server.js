const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// Serve static files from the React/Client app
app.use(express.static(path.join(__dirname, '../client')));

// Middleware
app.use(cors({
    origin: '*', // Allows Vercel frontend, localhost, and custom domains
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Root status endpoint for easy verification on Render
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: 'CampusOps API Backend',
        health: '/health',
        api: '/api'
    });
});

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'CampusOps API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[CampusOps] Server is running on port ${PORT}`);
    console.log(`[CampusOps] Health check: /health`);
    console.log(`[CampusOps] Intelligence microservice target: ${process.env.INTELLIGENCE_URL || 'http://localhost:8000'}`);
});
