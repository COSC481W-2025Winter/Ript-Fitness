const fs = require('fs');
const path = require('path');
const os = require('os'); // Use os module to get network interfaces

// Path to your .env file
const envPath = path.resolve(__dirname, '.env');

// Function to detect and set local IP if USE_LOCAL is true
function resetEnv() {
  const envFileContent = fs.readFileSync(envPath, { encoding: 'utf8' });

  let updatedEnvFile = envFileContent;

  // Check if USE_LOCAL is set to true
  const useLocal = true;///USE_LOCAL=true/i.test(envFileContent);
  if (useLocal) {
    console.log("Resetting .env connection to Azure")
    try {
      // Replace or set the LOCAL_IP variable in the .env file
      updatedEnvFile = envFileContent.replace(/USE_LOCAL=.*/, `USE_LOCAL=${false}`);
      updatedEnvFile = updatedEnvFile.replace(/LOCAL_IP=.*/, `LOCAL_IP=undefined`);

      // Write the updated .env file
      fs.writeFileSync(envPath, updatedEnvFile);
    } catch (error) {
      console.error('Error fetching local IP address:', error);
    }
  } else {
    console.log("Using Azure")
  }
}

// Run the setup function
resetEnv();
