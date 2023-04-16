import express from 'express';
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Path to the current file
const __filename = fileURLToPath(import.meta.url);
// Path to the current directory
const __dirname = path.dirname(__filename);

// Libraries
import { loadSocket } from './libraries/socket.terminal.js';

// Autehntication
import { isAuthenticated } from './middleware/auth.js';

// Controllers
import { insertUser, getAllUsers, getOneUser, editUser, removeUser } from './controllers/user.controller.js';
import { insertAsset, getAllAssets, getAllAssetsByUserId, getOneAsset, deleteOneAsset, updateOneAsset } from './controllers/asset.controller.js';
import { serverController } from './controllers/server.controller.js';
import { signin } from './controllers/signin.controller.js';

// Static files routes
router.use(express.static(path.join(__dirname, "..", "public")));
router.use(express.static(path.join(__dirname, "..", "node_modules")));


// Login route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

// Dashboard route
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/dashboard.html"));
});

// Network Assets route.
router.get('/network-assets', (req, res) => {

    res.sendFile(path.join(__dirname, "..", "public", "networkAssets.html"));
});

// Managements routes
router.get('/management', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "management.html"));
});

// Users route.
router.get('/users-list', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "users-list.html"));
});


// Terminal route
router.post('/terminal', isAuthenticated, async (req, res) => {
    const io = req.app.get('io');
    const host = req.body;
    const channel = `data${host.id}`;

    await loadSocket(io, host, channel);

    res.json({ message: 'terminal opened', channel });
});


// User routes
router.post('/users', insertUser);
router.get('/users', isAuthenticated, getAllUsers);
router.get('/users/:userId', isAuthenticated, getOneUser);
router.put('/users/:userId', isAuthenticated, editUser);
router.delete('/users/:userId', isAuthenticated, removeUser);

// Asset routes
router.post('/assets', isAuthenticated, insertAsset);
router.get('/assets', isAuthenticated, getAllAssets);
router.get('/assets/one/:assetId', isAuthenticated, getOneAsset);
router.get('/assets/user/:userId', isAuthenticated, getAllAssetsByUserId);
router.delete('/assets/:assetId', isAuthenticated, deleteOneAsset);
router.put('/assets/:assetId', isAuthenticated, updateOneAsset);

// Server routes
router.get('/server', isAuthenticated, serverController);

// Sign in route
router.post('/signin', signin);


export default router;