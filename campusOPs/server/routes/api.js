const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');
const noticeController = require('../controllers/noticeController');
const upvoteController = require('../controllers/upvoteController');
const commentController = require('../controllers/commentController');
const rbac = require('../middleware/rbac');

// Auth Routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/role', rbac.verifyToken, authController.getRole);
router.get('/me', rbac.verifyToken, authController.getMe);

// Tickets Routes
router.get('/tickets', ticketController.getTickets);
router.get('/tickets/:id', rbac.verifyToken, ticketController.getTicketById);
router.post('/tickets', rbac.verifyToken, rbac.checkRole(['Student', 'Teacher', 'Faculty', 'Estate Admin', 'Admin']), ticketController.createTicket);
router.patch('/tickets/:id', rbac.verifyToken, rbac.checkRole(['Student', 'Teacher', 'Faculty', 'Facility Worker', 'Worker', 'Estate Admin', 'Admin']), ticketController.updateTicket);

// Comments Routes
router.get('/tickets/:ticketId/comments', rbac.verifyToken, commentController.getComments);
router.post('/tickets/:ticketId/comments', rbac.verifyToken, commentController.addComment);

// Upvotes Routes
router.post('/tickets/:id/upvote', rbac.verifyToken, upvoteController.upvoteTicket);

// Notices Routes
router.get('/notices', noticeController.getNotices);
router.post('/notices', rbac.verifyToken, rbac.checkRole(['Estate Admin', 'Admin']), noticeController.createNotice);

module.exports = router;
