const { Facilitator, Manager, syncModels } = require('../src/models');

describe('Facilitator Model', () => {
  let manager;

  beforeAll(async () => {
    await syncModels();
    manager = await Manager.create({ name: 'Test Manager' });
  });

  afterEach(async () => {
    await Facilitator.destroy({ where: {} });
  });

  afterAll(async () => {
    await Manager.destroy({ where: {} });
  });

  it('should create a facilitator with valid fields', async () => {
    const facilitator = await Facilitator.create({
      email: 'facilitator@test.com',
      name: 'John Facilitator',
      qualification: 'PhD',
      location: 'Kigali',
      managerID: manager.id
    });
    
    expect(facilitator.id).toBeDefined();
    expect(facilitator.email).toBe('facilitator@test.com');
    expect(facilitator.name).toBe('John Facilitator');
    expect(facilitator.qualification).toBe('PhD');
    expect(facilitator.location).toBe('Kigali');
    expect(facilitator.managerID).toBe(manager.id);
  });

  it('should not allow duplicate emails', async () => {
    await Facilitator.create({
      email: 'duplicate@test.com',
      name: 'First Facilitator',
      qualification: 'Masters',
      location: 'Kigali',
      managerID: manager.id
    });

    expect.assertions(1);
    try {
      await Facilitator.create({
        email: 'duplicate@test.com',
        name: 'Second Facilitator',
        qualification: 'PhD',
        location: 'Nairobi',
        managerID: manager.id
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not allow null required fields', async () => {
    expect.assertions(1);
    try {
      await Facilitator.create({
        email: 'test@test.com',
        // missing other required fields
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should validate email format', async () => {
    expect.assertions(1);
    try {
      await Facilitator.create({
        email: 'invalid-email',
        name: 'Test Facilitator',
        qualification: 'Masters',
        location: 'Kigali',
        managerID: manager.id
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should associate with manager correctly', async () => {
    const facilitator = await Facilitator.create({
      email: 'associate@test.com',
      name: 'Associated Facilitator',
      qualification: 'Masters',
      location: 'Kigali',
      managerID: manager.id
    });

    const facilitatorWithManager = await Facilitator.findByPk(facilitator.id, {
      include: [{ model: Manager, as: 'Manager' }]
    });

    expect(facilitatorWithManager.Manager).toBeDefined();
    expect(facilitatorWithManager.Manager.name).toBe('Test Manager');
  });
}); 