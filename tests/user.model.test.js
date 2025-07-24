const { User, syncModels } = require('../src/models');
const bcrypt = require('bcrypt');

describe('User Model', () => {
  beforeAll(async () => {
    await syncModels();
  });

  it('should create a user with valid fields', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: await bcrypt.hash('testpass', 10),
      role: 'student',
    });
    expect(user.id).toBeDefined();
    expect(user.email).toBe('testuser@example.com');
  });

  it('should not allow duplicate emails', async () => {
    expect.assertions(1);
    try {
      await User.create({
        name: 'Another',
        email: 'testuser@example.com',
        password: await bcrypt.hash('testpass', 10),
        role: 'student',
      });
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
}); 