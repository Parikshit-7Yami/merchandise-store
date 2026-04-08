const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';

export function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'] || req.body?.adminKey || req.query?.adminKey;
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
