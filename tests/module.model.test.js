const { Module, syncModels } = require('../src/models');

describe('Module Model', () => {
  beforeAll(async () => {
    await syncModels();
  });

  it('should create a module with valid fields', async () => {
    const module = await Module.create({ code: 'TEST101', name: 'Test Module' });
    expect(module.id).toBeDefined();
    expect(module.code).toBe('TEST101');
  });

  it('should not allow duplicate codes', async () => {
    expect.assertions(1);
    try {
      await Module.create({ code: 'TEST101', name: 'Duplicate Module' });
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
}); 