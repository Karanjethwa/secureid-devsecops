import { Request, Response, NextFunction } from 'express';

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { name, email, username, password, confirmPassword } = req.body;

  if (!name || !email || !username || !password || !confirmPassword) {
    res.status(400).json({
      success: false,
      message: 'All fields (name, email, username, password, confirmPassword) are required.',
    });
    return;
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanUsername = String(username).trim().toLowerCase();
  const pass = String(password);
  const confirmPass = String(confirmPassword);

  if (cleanName.length < 2 || cleanName.length > 80) {
    res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 80 characters.',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
    return;
  }

  if (cleanUsername.length < 3 || cleanUsername.length > 30) {
    res.status(400).json({
      success: false,
      message: 'Username must be between 3 and 30 characters.',
    });
    return;
  }

  if (!/^[a-zA-Z0-9_\-\.]+$/.test(cleanUsername)) {
    res.status(400).json({
      success: false,
      message: 'Username may only contain letters, numbers, underscores, and hyphens.',
    });
    return;
  }

  if (pass.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Password must contain at least 6 characters.',
    });
    return;
  }

  if (pass !== confirmPass) {
    res.status(400).json({
      success: false,
      message: 'Passwords do not match.',
    });
    return;
  }

  // Pass sanitized values
  req.body.name = cleanName;
  req.body.email = cleanEmail;
  req.body.username = cleanUsername;
  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({
      success: false,
      message: 'Both username/email and password are required.',
    });
    return;
  }

  req.body.identifier = String(identifier).trim().toLowerCase();
  next();
}

export function validateProfileUpdate(req: Request, res: Response, next: NextFunction): void {
  const { name, bio, department, phone } = req.body;

  if (name !== undefined) {
    const cleanName = String(name).trim();
    if (cleanName.length < 2 || cleanName.length > 80) {
      res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 80 characters.',
      });
      return;
    }
    req.body.name = cleanName;
  }

  if (bio !== undefined) {
    req.body.bio = String(bio).trim().slice(0, 300);
  }
  if (department !== undefined) {
    req.body.department = String(department).trim().slice(0, 100);
  }
  if (phone !== undefined) {
    req.body.phone = String(phone).trim().slice(0, 30);
  }

  next();
}
