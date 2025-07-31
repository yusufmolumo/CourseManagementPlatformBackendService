const sequelize = require('./src/config/database');

async function updateDatabase() {
  try {
    console.log('Starting database updates...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // 1. Update Classes
    console.log('\n1. Updating Classes...');
    await sequelize.query(`
      UPDATE classes 
      SET name = CASE 
        WHEN id = 1 THEN '2024J'
        WHEN id = 2 THEN '2024M' 
        WHEN id = 5 THEN '2024S'
        ELSE name
      END
    `);

    // Add date columns
    try {
      await sequelize.query('ALTER TABLE classes ADD COLUMN startDate DATE');
      await sequelize.query('ALTER TABLE classes ADD COLUMN graduationDate DATE');
    } catch (e) {
      console.log('Date columns may already exist');
    }

    // Update dates
    await sequelize.query(`
      UPDATE classes 
      SET startDate = CASE 
        WHEN name = '2024J' THEN '2024-01-15'
        WHEN name = '2024M' THEN '2024-05-15'
        WHEN name = '2024S' THEN '2024-09-15'
      END,
      graduationDate = CASE 
        WHEN name = '2024J' THEN '2027-01-15'
        WHEN name = '2024M' THEN '2027-05-15'
        WHEN name = '2024S' THEN '2027-09-15'
      END
    `);

    // 2. Update Cohorts
    console.log('\n2. Updating Cohorts...');
    await sequelize.query('DELETE FROM cohorts');
    const cohorts = ['cohort 1', 'cohort 2', 'cohort 3', 'cohort 4', 'cohort 5'];
    for (const cohort of cohorts) {
      await sequelize.query('INSERT INTO cohorts (id, name, createdAt, updatedAt) VALUES (UUID(), ?, NOW(), NOW())', {
        replacements: [cohort]
      });
    }

    // 3. Create Managers table
    console.log('\n3. Creating Managers table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS managers (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);
    await sequelize.query('INSERT IGNORE INTO managers (id, name, createdAt, updatedAt) VALUES (UUID(), ?, NOW(), NOW())', {
      replacements: ['Binusha']
    });

    // 4. Create Facilitators table
    console.log('\n4. Creating Facilitators table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS facilitators (
        id CHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        qualification VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        managerID CHAR(36) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);

    // 5. Create Students table
    console.log('\n5. Creating Students table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS students (
        id CHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        classID CHAR(36) NOT NULL,
        cohortID CHAR(36) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);

    // 6. Update Course Offerings
    console.log('\n6. Updating Course Offerings...');
    await sequelize.query(`
      UPDATE course_offerings 
      SET trimester = '2025J', 
          intakePeriod = '2024S'
      WHERE trimester = '2026A'
    `);

    // 7. Create ActivityTracker table
    console.log('\n7. Creating ActivityTracker table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS activity_trackers (
        id CHAR(36) PRIMARY KEY,
        allocationId CHAR(36) NOT NULL,
        week INT,
        attendance JSON,
        formativeOneGrading ENUM('Done', 'Pending', 'Not Started') NOT NULL,
        formativeTwoGrading ENUM('Done', 'Pending', 'Not Started') NOT NULL,
        SummativeGrading ENUM('Done', 'Pending', 'Not Started') NOT NULL,
        courseModeration ENUM('Done', 'Pending', 'Not Started') NOT NULL,
        intranetSync ENUM('Done', 'Pending', 'Not Started') NOT NULL,
        gradeBookStatus ENUM('Done', 'Pending', 'Not Started') NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);

    console.log('\n✅ Database updated successfully!');

    // Show results
    const [classes] = await sequelize.query('SELECT * FROM classes');
    console.log('\nClasses:', classes);
    
    const [cohorts] = await sequelize.query('SELECT * FROM cohorts');
    console.log('\nCohorts:', cohorts);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

updateDatabase(); 