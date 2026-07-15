import bcrypt from 'bcryptjs';
import generateToken from '../generateToken.js';
import prisma from '../prisma/db.js';

export const registerUser = async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
  }

  if (address && address.length > 400) {
    return res.status(400).json({ message: 'Address cannot exceed 400 characters.' });
  }

  if (password.length < 8 || password.length > 16) {
    return res.status(400).json({ message: 'Password must be between 8 and 16 characters.' });
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasSpecialChar) {
    return res.status(400).json({ message: 'Password must include at least one uppercase letter and one special character.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
      },
    });

    res.status(201).json({
      id: newUser.id,
      name: newUser.name
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during user registration.' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(res, user.id, user.role);

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};