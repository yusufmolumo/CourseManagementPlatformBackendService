const { Manager, syncModels } = require('../src/models');

describe('Manager Model', () => {
  beforeAll(async () => {
    await syncModels();
  });

  afterEach(async () => {
    await Manager.destroy({ where: {} });
  });

  it('should create a manager with valid fields', async () => {
    const manager = await Manager.create({
      name: 'John Manager'
    });
    
    expect(manager.id).toBeDefined();
    expect(manager.name).toBe('John Manager');
    expect(typeof manager.id).toBe('string'); // UUID should be string
  });

  it('should not allow null name', async () => {
    expect.assertions(1);
    try {
      await Manager.create({});
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not allow empty name', async () => {
    expect.assertions(1);
    try {
      await Manager.create({ name: '' });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should allow multiple managers with different names', async () => {
    const manager1 = await Manager.create({ name: 'Manager One' });
    const manager2 = await Manager.create({ name: 'Manager Two' });
    
    expect(manager1.id).not.toBe(manager2.id);
    expect(manager1.name).toBe('Manager One');
    expect(manager2.name).toBe('Manager Two');
  });

  it('should generate unique UUIDs for each manager', async () => {
    const manager1 = await Manager.create({ name: 'Manager One' });
    const manager2 = await Manager.create({ name: 'Manager Two' });
    
    expect(manager1.id).not.toBe(manager2.id);
    expect(manager1.id.length).toBeGreaterThan(20); // UUID length check
  });
}); 