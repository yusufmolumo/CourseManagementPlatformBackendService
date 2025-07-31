const { ActivityTracker, CourseOffering, Module, Class, Facilitator, Manager, Mode, syncModels } = require('../src/models');

describe('ActivityTracker Model', () => {
  let courseOffering, facilitator, manager, module, classInstance, mode;

  beforeAll(async () => {
    await syncModels();
    
    // Create required dependencies
    manager = await Manager.create({ name: 'Test Manager' });
    facilitator = await Facilitator.create({
      email: 'facilitator@test.com',
      name: 'Test Facilitator',
      qualification: 'PhD',
      location: 'Kigali',
      managerID: manager.id
    });
    module = await Module.create({ name: 'Test Module', half: 'H1' });
    classInstance = await Class.create({ 
      name: '2024A', 
      startDate: new Date('2024-01-01'), 
      graduationDate: new Date('2024-12-31') 
    });
    mode = await Mode.create({ name: 'Online' });
    
    courseOffering = await CourseOffering.create({
      moduleID: module.id,
      classID: classInstance.id,
      facilitatorID: facilitator.id,
      trimester: '1',
      modeID: mode.id,
      year: 2024,
      createdAt: new Date()
    });
  });

  afterEach(async () => {
    await ActivityTracker.destroy({ where: {} });
  });

  afterAll(async () => {
    await CourseOffering.destroy({ where: {} });
    await Facilitator.destroy({ where: {} });
    await Manager.destroy({ where: {} });
    await Module.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await Mode.destroy({ where: {} });
  });

  it('should create an activity tracker with valid fields', async () => {
    const activityTracker = await ActivityTracker.create({
      allocationId: courseOffering.id,
      attendance: [{ week1: true }, { week2: false }],
      formativeOneGrading: 'Done',
      formativeTwoGrading: 'Pending',
      SummativeGrading: 'Not Started',
      courseModeration: 'Done',
      intranetSync: 'Pending',
      gradeBookStatus: 'Not Started'
    });
    
    expect(activityTracker.id).toBeDefined();
    expect(activityTracker.allocationId).toBe(courseOffering.id);
    expect(activityTracker.attendance).toEqual([{ week1: true }, { week2: false }]);
    expect(activityTracker.formativeOneGrading).toBe('Done');
    expect(activityTracker.formativeTwoGrading).toBe('Pending');
    expect(activityTracker.SummativeGrading).toBe('Not Started');
    expect(activityTracker.courseModeration).toBe('Done');
    expect(activityTracker.intranetSync).toBe('Pending');
    expect(activityTracker.gradeBookStatus).toBe('Not Started');
  });

  it('should validate status enum values', async () => {
    const activityTracker = await ActivityTracker.create({
      allocationId: courseOffering.id,
      attendance: [{ week1: true }],
      formativeOneGrading: 'Done',
      formativeTwoGrading: 'Pending',
      SummativeGrading: 'Not Started',
      courseModeration: 'Done',
      intranetSync: 'Pending',
      gradeBookStatus: 'Done'
    });
    
    expect(['Done', 'Pending', 'Not Started']).toContain(activityTracker.formativeOneGrading);
    expect(['Done', 'Pending', 'Not Started']).toContain(activityTracker.formativeTwoGrading);
    expect(['Done', 'Pending', 'Not Started']).toContain(activityTracker.SummativeGrading);
    expect(['Done', 'Pending', 'Not Started']).toContain(activityTracker.courseModeration);
    expect(['Done', 'Pending', 'Not Started']).toContain(activityTracker.intranetSync);
    expect(['Done', 'Pending', 'Not Started']).toContain(activityTracker.gradeBookStatus);
  });

  it('should not allow invalid status values', async () => {
    expect.assertions(1);
    try {
      await ActivityTracker.create({
        allocationId: courseOffering.id,
        attendance: [{ week1: true }],
        formativeOneGrading: 'InvalidStatus',
        formativeTwoGrading: 'Done',
        SummativeGrading: 'Done',
        courseModeration: 'Done',
        intranetSync: 'Done',
        gradeBookStatus: 'Done'
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should store attendance as JSON array', async () => {
    const attendanceData = [
      { week1: true, present: 15, absent: 2 },
      { week2: false, present: 12, absent: 5 },
      { week3: true, present: 18, absent: 0 }
    ];
    
    const activityTracker = await ActivityTracker.create({
      allocationId: courseOffering.id,
      attendance: attendanceData,
      formativeOneGrading: 'Done',
      formativeTwoGrading: 'Done',
      SummativeGrading: 'Done',
      courseModeration: 'Done',
      intranetSync: 'Done',
      gradeBookStatus: 'Done'
    });
    
    expect(activityTracker.attendance).toEqual(attendanceData);
    expect(Array.isArray(activityTracker.attendance)).toBe(true);
  });

  it('should associate with course offering correctly', async () => {
    const activityTracker = await ActivityTracker.create({
      allocationId: courseOffering.id,
      attendance: [{ week1: true }],
      formativeOneGrading: 'Done',
      formativeTwoGrading: 'Done',
      SummativeGrading: 'Done',
      courseModeration: 'Done',
      intranetSync: 'Done',
      gradeBookStatus: 'Done'
    });

    const trackerWithOffering = await ActivityTracker.findByPk(activityTracker.id, {
      include: [{ model: CourseOffering, as: 'CourseOffering' }]
    });

    expect(trackerWithOffering.CourseOffering).toBeDefined();
    expect(trackerWithOffering.CourseOffering.id).toBe(courseOffering.id);
  });
}); 