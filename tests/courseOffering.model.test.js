const { CourseOffering, Module, Cohort, Class, Mode, User, syncModels } = require('../src/models');

describe('CourseOffering Model', () => {
  let module, cohort, klass, mode, facilitator;
  beforeAll(async () => {
    await syncModels();
    module = await Module.create({ code: 'OFFER101', name: 'Offering Module' });
    cohort = await Cohort.create({ name: 'Test Cohort' });
    klass = await Class.create({ name: '2026A' });
    mode = await Mode.create({ type: 'Online' });
    facilitator = await User.create({ name: 'Facilitator', email: 'facilitator2@example.com', password: 'pass', role: 'facilitator' });
  });

  it('should create a course offering with valid fields', async () => {
    const offering = await CourseOffering.create({
      ModuleId: module.id,
      CohortId: cohort.id,
      ClassId: klass.id,
      ModeId: mode.id,
      facilitatorId: facilitator.id,
      intakePeriod: 'HT1',
      trimester: '2026A',
    });
    expect(offering.id).toBeDefined();
    expect(offering.ModuleId).toBe(module.id);
  });
}); 