const bcrypt = require('bcrypt');
const { User, Module, Cohort, Class, Mode, syncModels } = require('./models');

async function seed() {
  await syncModels();

  // Modules
  await Module.bulkCreate([
    { code: 'CS101', name: 'Introduction to Computer Science' },
    { code: 'MATH201', name: 'Calculus I' },
    { code: 'PHY301', name: 'Physics Basics' },
  ], { ignoreDuplicates: true });

  // Cohorts
  await Cohort.bulkCreate([
    { name: 'Cohort 2024' },
    { name: 'Cohort 2025' },
  ], { ignoreDuplicates: true });

  // Classes
  await Class.bulkCreate([
    { name: '2024S' },
    { name: '2025J' },
  ], { ignoreDuplicates: true });

  // Modes
  await Mode.bulkCreate([
    { type: 'Online' },
    { type: 'In-person' },
    { type: 'Hybrid' },
  ], { ignoreDuplicates: true });

  // Users
  const password = await bcrypt.hash('password123', 10);
  await User.bulkCreate([
    { name: 'Facilitator One', email: 'facilitator1@example.com', password, role: 'facilitator' },
    { name: 'Student One', email: 'student1@example.com', password, role: 'student' },
    { name: 'Manager One', email: 'manager1@example.com', password, role: 'manager' },
  ], { ignoreDuplicates: true });

  console.log('Seeding complete!');
  process.exit();
}

seed(); 