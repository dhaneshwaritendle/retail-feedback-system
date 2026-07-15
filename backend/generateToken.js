import jwt from 'jsonwebtoken';

const generateToken = (res, userId, userRole) => {
  const token = jwt.sign({ userId, role: userRole }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return token;
};

export default generateToken;