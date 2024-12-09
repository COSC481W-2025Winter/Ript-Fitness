const fs = require('fs');
const path = require('path');
const os = require('os'); // Use os module to get network interfaces

// Path to your .env file
const envPath = path.resolve(__dirname, '.env');

// Function to get the local machine's IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Find the first non-internal IPv4 address
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  throw new Error('Unable to find local IP address');
}

// Function to detect and set local IP if USE_LOCAL is true
function setupEnv() {
  const envFileContent = fs.readFileSync(envPath, { encoding: 'utf8' });

  let updatedEnvFile = envFileContent;

  // Check if USE_LOCAL is set to true
  const useLocal = /USE_LOCAL=true/.test(envFileContent);
  if (useLocal) {
    console.log("Using Local")
    try {
      // Get the local IP address using Node.js os module
      const localIp = getLocalIpAddress();

      // Replace or set the LOCAL_IP variable in the .env file
      if (/LOCAL_IP=/.test(envFileContent)) {
        updatedEnvFile = envFileContent.replace(/LOCAL_IP=.*/, `LOCAL_IP=${localIp}`);
      } else {
        updatedEnvFile += `\nLOCAL_IP=${localIp}`;
      }

      // Write the updated .env file
      fs.writeFileSync(envPath, updatedEnvFile);
      console.log(`LOCAL_IP set to: ${localIp}`);
    } catch (error) {
      console.error('Error fetching local IP address:', error);
    }
  } else {
    console.log("Using Azure")
  }
}

// Run the setup function
console.log("Setting up env")
setupEnv();
