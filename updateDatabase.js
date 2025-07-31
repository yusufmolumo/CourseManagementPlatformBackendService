const sequelize = require('./src/config/database');
const { Class, Cohort, Facilitator, Manager, CourseOffering, ActivityTracker, Student, syncModels } = require('./src/models');

async function updateDatabase() {
  try {
    console.log('Starting database updates...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // 1. Update Classes table
    console.log('\n1. Updating Classes table...');
    
    // First, let's see current classes
    const currentClasses = await sequelize.query('SELECT * FROM classes');
    console.log('Current classes:', currentClasses[0]);

    // Update class names and add date fields
    await sequelize.query(`
      UPDATE classes 
      SET name = CASE 
        WHEN id = 1 THEN '2024J'
        WHEN id = 2 THEN '2024M' 
        WHEN id = 5 THEN '2024S'
        ELSE name
      END
    `);

    // Add startDate and graduationDate columns if they don't exist
    try {
      await sequelize.query('ALTER TABLE classes ADD COLUMN startDate DATE');
      console.log('Added startDate column');
    } catch (e) {
      console.log('startDate column already exists or error:', e.message);
    }

    try {
      await sequelize.query('ALTER TABLE classes ADD COLUMN graduationDate DATE');
      console.log('Added graduationDate column');
    } catch (e) {
      console.log('graduationDate column already exists or error:', e.message);
    }

    // Update dates for each class
    await sequelize.query(`
      UPDATE classes 
      SET startDate = CASE 
        WHEN name = '2024J' THEN '2024-01-15'
        WHEN name = '2024M' THEN '2024-05-15'
        WHEN name = '2024S' THEN '2024-09-15'
        ELSE startDate
      END,
      graduationDate = CASE 
        WHEN name = '2024J' THEN '2027-01-15'
        WHEN name = '2024M' THEN '2027-05-15'
        WHEN name = '2024S' THEN '2027-09-15'
        ELSE graduationDate
      END
    `);

    console.log('Classes updated successfully');

    // 2. Update Cohorts table
    console.log('\n2. Updating Cohorts table...');
    
    // Clear existing cohorts
    await sequelize.query('DELETE FROM cohorts');
    
    // Insert new cohorts
    const cohortData = [
      { name: 'cohort 1' },
      { name: 'cohort 2' },
      { name: 'cohort 3' },
      { name: 'cohort 4' },
      { name: 'cohort 5' }
    ];

    for (const cohort of cohortData) {
      await sequelize.query('INSERT INTO cohorts (id, name, createdAt, updatedAt) VALUES (UUID(), ?, NOW(), NOW())', {
        replacements: [cohort.name]
      });
    }

    console.log('Cohorts updated successfully');

    // 3. Create/Update Managers table
    console.log('\n3. Creating/Updating Managers table...');
    
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS managers (
          id CHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        )
      `);
      console.log('Managers table created/verified');
    } catch (e) {
      console.log('Managers table error:', e.message);
    }

    // Insert sample manager
    await sequelize.query('INSERT IGNORE INTO managers (id, name, createdAt, updatedAt) VALUES (UUID(), ?, NOW(), NOW())', {
      replacements: ['Binusha']
    });

    // 4. Create/Update Facilitators table
    console.log('\n4. Creating/Updating Facilitators table...');
    
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS facilitators (
          id CHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          qualification VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          managerID CHAR(36) NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (managerID) REFERENCES managers(id)
        )
      `);
      console.log('Facilitators table created/verified');
    } catch (e) {
      console.log('Facilitators table error:', e.message);
    }

    // Get manager ID for foreign key
    const [managers] = await sequelize.query('SELECT id FROM managers LIMIT 1');
    const managerId = managers[0]?.id;

    if (managerId) {
      // Insert sample facilitator
      await sequelize.query('INSERT IGNORE INTO facilitators (id, email, name, qualification, location, managerID, createdAt, updatedAt) VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())', {
        replacements: ['john@alu.com', 'John Doe', 'masters', 'Kigali', managerId]
      });
    }

    // 5. Create/Update Students table
    console.log('\n5. Creating/Updating Students table...');
    
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS students (
          id CHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          classID CHAR(36) NOT NULL,
          cohortID CHAR(36) NOT NULL,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (classID) REFERENCES classes(id),
          FOREIGN KEY (cohortID) REFERENCES cohorts(id)
        )
      `);
      console.log('Students table created/verified');
    } catch (e) {
      console.log('Students table error:', e.message);
    }

    // Get class and cohort IDs for foreign keys
    const [classes] = await sequelize.query('SELECT id FROM classes LIMIT 1');
    const [cohorts] = await sequelize.query('SELECT id FROM cohorts LIMIT 1');
    
    if (classes[0]?.id && cohorts[0]?.id) {
      // Insert sample student
      await sequelize.query('INSERT IGNORE INTO students (id, email, name, classID, cohortID, createdAt, updatedAt) VALUES (UUID(), ?, ?, ?, ?, NOW(), NOW())', {
        replacements: ['ben@alustudent.com', 'Ben', classes[0].id, cohorts[0].id]
      });
    }

    // 6. Update Course_Offerings table
    console.log('\n6. Updating Course_Offerings table...');
    
    // Update trimester and intake period
    await sequelize.query(`
      UPDATE course_offerings 
      SET trimester = '2025J', 
          intakePeriod = '2024S'
      WHERE trimester = '2026A'
    `);

    console.log('Course offerings updated successfully');

    // 7. Create/Update ActivityTracker table (Allocations)
    console.log('\n7. Creating/Updating ActivityTracker table...');
    
    try {
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
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (allocationId) REFERENCES course_offerings(id)
        )
      `);
      console.log('ActivityTracker table created/verified');
    } catch (e) {
      console.log('ActivityTracker table error:', e.message);
    }

    console.log('\n✅ Database update completed successfully!');
    
    // Display final results
    console.log('\n📊 Final Database Summary:');
    
    const [finalClasses] = await sequelize.query('SELECT * FROM classes');
    console.log('\nClasses:', finalClasses);
    
    const [finalCohorts] = await sequelize.query('SELECT * FROM cohorts');
    console.log('\nCohorts:', finalCohorts);
    
    const [finalManagers] = await sequelize.query('SELECT * FROM managers');
    console.log('\nManagers:', finalManagers);
    
    const [finalFacilitators] = await sequelize.query('SELECT * FROM facilitators');
    console.log('\nFacilitators:', finalFacilitators);
    
    const [finalStudents] = await sequelize.query('SELECT * FROM students');
    console.log('\nStudents:', finalStudents);
    
    const [finalCourseOfferings] = await sequelize.query('SELECT * FROM course_offerings');
    console.log('\nCourse Offerings:', finalCourseOfferings);

  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

updateDatabase(); 