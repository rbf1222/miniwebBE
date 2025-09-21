// src/middlewares/authMiddleware.js
import { verifyToken } from '../utils/jwt.js';

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: true, message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: true, message: 'Token missing' });

    try {
        const payload = verifyToken(token);
        req.user = payload; // payload should include id, username, role
        return next();
    } catch (err) {
        return res.status(401).json({ error: true, message: 'Invalid or expired token' });
    }
}
 
export function authorizeRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: true, message: 'Authentication required' });
        if (req.user.role !== requiredRole) return res.status(403).json({ error: true, message: 'Access denied' });
        next();
    };
}