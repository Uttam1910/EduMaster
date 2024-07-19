const fs = require('fs');
const path = require('path');


// Define the directory and file structure
const structure = {
  config: ['db.js'],
  models: ['user.js'],
  controllers: ['userController.js'],
  routes: ['userRoutes.js'],
  middleware: ['authMiddleware.js']
};

// Function to create directories and files
const createStructure = (baseDir, structure) => {
  for (const dir in structure) {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
    
    structure[dir].forEach(file => {
      const filePath = path.join(dirPath, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        console.log(`Created file: ${filePath}`);
      }
    });
  }
};

// Run the function
const baseDir = __dirname; // Current directory
createStructure(baseDir, structure);
