const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, syncModels } = require('../src/models');

// Mock the auth service functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '24h' }
  );
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

describe('Authentication Service', () => {
  beforeAll(async () => {
    await syncModels();
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should verify password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate valid JWT token', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await hashPassword('password123'),
        role: 'student'
      });

      const token = generateToken(user);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate token with correct payload', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await hashPassword('password123'),
        role: 'facilitator'
      });

      const token = generateToken(user);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      
      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });

    it('should generate different tokens for different users', async () => {
      const user1 = await User.create({
        name: 'User 1',
        email: 'user1@example.com',
        password: await hashPassword('password123'),
        role: 'student'
      });

      const user2 = await User.create({
        name: 'User 2',
        email: 'user2@example.com',
        password: await hashPassword('password123'),
        role: 'facilitator'
      });

      const token1 = generateToken(user1);
      const token2 = generateToken(user2);
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('User Authentication Flow', () => {
    it('should complete full authentication flow', async () => {
      // 1. Create user with hashed password
      const password = 'securePassword123';
      const hashedPassword = await hashPassword(password);
      
      const user = await User.create({
        name: 'Auth Test User',
        email: 'auth@example.com',
        password: hashedPassword,
        role: 'manager'
      });

      // 2. Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      expect(isPasswordValid).toBe(true);

      // 3. Generate token
      const token = generateToken(user);
      expect(token).toBeDefined();

      // 4. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });
  });
}); 