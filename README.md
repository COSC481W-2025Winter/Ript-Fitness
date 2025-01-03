<h2 style="font-size:24px; font-weight:bold;">Ript Fitness</h2>
<hr style="border:1px solid #000; margin-top:10px;">

<h2 style="font-size:20px; font-weight:bold;">Table of Contents</h2>
<hr style="border:1px solid #000; margin-top:10px;">

    - App Description
    - Setting Up the Backend
    - Setting Up the Frontend
    - Working with Microsoft Azure
    - Security
    - Expo Go
    - Ideas For Future Teams

<hr style="border:1px solid #000; margin-top:10px;">

<h2 style="font-size:20px; font-weight:bold;">App Description</h2>
<p style="font-size:16px;">Ript Fitness is a full-stack application that uses Java Spring Boot as the backend, React Native as the frontend framework, TypeScript as the frontend language, Microsoft Azure for deployment, Docker for containerized devlopment, Maven as a build automation tool, and MySql for the database. Through the first semester of work on this app, features in the application include a social feed, a nutrition tracker, a workout tracker, a friend's list, a user profile with account settings, and pictures hosted through Microsoft Blog Storage. It uses a hashing algorithm to store usernames and passwords, and JWT tokens to authenticate users when backend endpoints are called. The ultimate goal for this app is to make it to the app store on iOS and Android.</p>

<hr style="border:1px solid #000; margin-top:10px;">

<h2 style="font-size:20px; font-weight:bold;">Setting Up the Backend</h2>
<hr style="border:1px solid #000; margin-top:10px;">

<p style="font-size:16px;">The first step in setting up the backend is getting everything installed. To do this, you'll want to start by downloading Spring Boot Suite. This is the IDE that will be used to code in. You can set it up to mirror Eclipse's interface or VS Code's interface. The link to download the IDE is: https://spring.io/tools. Click the download that corresponds to your operating system, and download the application. When complete, you should see a green circle icon in the downloaded package called "SpringToolSuite4". Click on that and the IDE will open mirroring Eclipse or VS Code's interface. Please note that this ReadMe will only go over how to setup the project in Eclipse's interface, although VS Code's should be similar. <br> <br>The next application to download is Docker Desktop, which can be downloaded at: https://www.docker.com/products/docker-desktop/. Download the correct version of Docker Desktop corresponding to your operating system. Once installed, open the application and make sure that the bar in the bottom left corner is green and says "Engine running". You can and should pause the engine when you are not working on the project. If it says "Resource saver mode" or "Engine paused", you'll need to click the right arrow to start the Docker engine. <br> <br>The next application to download is MySql WorkBench. Go to https://dev.mysql.com/downloads/windows/installer/8.0.html, select the newest version and your operating system, then follow the prompts to install it. Make sure you remember your root password during the install process as you'll need it for later. If it does not prompt you for a root password, it means you've already installed WorkBench in the past. If you have forgotton your root password, you'll need to uninstall and reinstall WorkBench to reset it. <br> <br>The final application to install is Postman. Go to https://www.postman.com/downloads to install it to your computer. You'll need to create an account to Postman, and you can just use your Emich account for this. There is a shared Postman account that already has the HTTP endpoints that already exist saved, so you'll need to get those credentials from the Professor. Note that it is a free account, so only 3 people can be using that account at once. <br> <br>You should already have Maven installed on your computer from previous semesters, but if you don't, you can go to https://maven.apache.org/download.cgi to install it. <br> <br>The next step in the setup process is importing the project onto your IDE. Note that this ReadMe will only go over how to do that in the Eclipse interface, but the process should be similar in VS Code's interface. Clone this repository and note what folder it exists in on your local machine. In Spring Boot Suite, click "File" in the upper left corner and select "Import". In the window that opens, click the ">" next to "Maven" and click on "Existing Maven Projects". Click "Next>", and on the next page, select "Browse" where you will select the folder that contains the repository's backend folder (there should be a file called Pom.xml in this directory). You should see something along the lines of "/backend/Ript-Fitness-Backend/pom.xml" in the projects section. Click the checkmark next to that project then "Finish". You should now see the project in the Project Explorer. The final setup step is creating a .env file that holds the passwords necessary to connect to your local MySql database. Open any text editor and copy/paste the following into the text file: <br> <br>MYSQL_DATABASE=riptfitness_database<br>MYSQL_ROOT_PASSWORD=<br>PORT=3308:3306<br>SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3308/riptfitness_database<br>SPRING_DATASOURCE_USERNAME=root<br>SPRING_DATASOURCE_PASSWORD=<br>JWT_SECRET=<br>BLOB_CONNECTION_STRING=<br>BLOB_CONTAINER_NAME=<br><br>On the lines that contain "MYSQL_ROOT_PASSWORD" and "SPRING_DATASOURCE_PASSWORD", put your MySql root password directly next to the equals sign. Note that if you do not use a root username for MySql, you'll also need to replace "root" in the 2 password lines with your MySql username. For the last 3 lines staring with "JWT_SECRET", you'll need to get those values from the Professor. To save this file, click "Save as" and save it in the same directory as the backend src folder (Pom.xml is also in the same directory). Under "Save as type" (on Windows), click "All types" and name the file ".env". The file type should be "ENV File" with the name ".env". IMPORTANT: To confirm that you've saved your .env file correctly, using Git Bash, cd into the folder containing the repository and call "git status". There should be no files in red. If your .env pops up when git status is called, go back and confirm you've saved it in the right place, that it's a .env file, and its name is ".env". The .gitignore should stop it from being pushed to GitHub, but if you saved it incorrectly, then you'll need to save it correctly before continuing to avoid pushing your passwords to the repository. <br><br> Finally, you'll want to attempt to run the server on Spring Boot Suite, this is the final step. Right click on the project in the Project Explorer, find "Run as", and select "Spring Boot App". You'll see the server begin to run, and the Docker container should be created automatically, as well as the local database tables. You'll know that the server started up successfully when you see the last line say "Completed initialization in 1 ms" (or 2 ms). If you get a null pointer exception that is about 100 lines long, it means you did not save the .env file correctly. Go back and confirm it's saved in the right place, its contents match the contents above exactly, and that the password for each password field are correct. If the error message says something about "Docker", make sure that Docker Desktop is open and that the engine is running in the lower left corner. Once successfully ran, you'll see the Docker container running on port "3308:3306". Every time you run the server, you'll need to make sure that Docker Desktop is open, and that the engine/container are running. To run the container, click the play button next to the "ript_fitness_backend" container name under "Actions". If everything else is correct but the server still isn't running correctly, make sure that "mysql" is defined in your path variables. You can confirm this by typing "mysql --version" in a CLI with your version of MySql popping up when called. Also confirm that Maven in defined in your System Variables by calling "mvn --version" with the version of Maven you are running popping up when called.</p>

<h2 style="font-size:20px; font-weight:bold;">Setting Up the Frontend</h2>
<hr style="border:1px solid #000; margin-top:10px;">
<p style="font-size:16px;">For the front end, it's recommended you use Visual Studio Code. This allows you to easily access the terminal and run your server, or handle your branches using git. You can download Visual Studio Code here: https://code.visualstudio.com/<br>

Download Node.js. React Native projects have some NodeJS scripts, You'll see a checkbox asking you to install chocolatey, you can uncheck it. Download NodeJS here: https://nodejs.org/en

restart All VSCode windows or command prompts if any were open<br>
Click File, Open Folder, and locate the Ript-Fitness project folder.<br>
Change in the terminal, cd the frontend folder<br>

Run the below command. It installs all the app's dependencies using package-lock.json and package-lock.json<br>npm install<br><br>

Run the below command. It checks the dependencies, and you version of the EXPO CLI, installing versions known to work with your EXPO CLI<br>
npx expo install --check<br><br>

Run the below command. It scans installed dependencies for known security vulnerabilities. At the time of writing, there are none, however if any issues are found in the future, it will attempt to automatically update or patch the dependencies to safer versions.<br>
npm audit fix<br><br>

To run the app, you have two choices, use one of the below commands.<br>The first, will run connected to the Azure server. This is recommended for anyone developing the front-end, so they don't also have to.<br>
The second, will run a NodeJS script that sets up a .env file in the frontend to use your current local IPV4 address (127.0.0.1 or localhost does not work if connecting using your phone), and set USE_LOCAL to true, then revert it to normal when you close the server. This will allow anyone wanting to run both the backend and the frontend on their computer to connect with minimal intervention.<br>
npx expo start<br>
npm start
</p>

<h2 style="font-size:20px; font-weight:bold;">Working with Microsoft Azure</h2>
<hr style="border:1px solid #000; margin-top:10px;">
<p style="font-size:16px;">
Azure has connection details that your professor will have.

Azure hosts Ript-Fitness in the form of a Docker Container App, a MySQL database, as well as Azure Blob Service used for the private photos<br><br>

There's a github action that automatically builds the backend and creates a docker container, and pushes it to Azure, which should allow for minimal manual intervention, and allow anyone working on the frontend to develop without running Java SpringBoot or Docker.
</p>

<h2 style="font-size:20px; font-weight:bold;">Security</h2>
<hr style="border:1px solid #000; margin-top:10px;">
<p style="font-size:16px;">
Private Photos use an SaS token. This is appended to the URL inside of the backend code. It is used as verification so that only the user who added the private photo to the Ript-Fitness app can view it. Not to be confused with User Profile Pictures, which are public, and stored as a Base64 image inside the database.

Tech Stack and Security Implementation
The backend of this application is built with Java Spring Boot, leveraging its robust ecosystem for scalable and maintainable development. For security, the application integrates Spring Security to handle authentication and authorization processes seamlessly. To ensure data integrity and safeguard sensitive user information, the application uses JWT (JSON Web Tokens) for stateless authentication and Argon2 hashing for encrypting passwords and email addresses during account creation.

The use of JWT tokens provides a secure and efficient way to manage user sessions without server-side storage. When a user logs in or creates an account, the backend validates the credentials, generates a token, and returns it to the client. This token is then used to authenticate subsequent requests, ensuring the user's identity and permissions are verified. The token structure includes a payload that is signed using a secret key, making it tamper-resistant and suitable for distributed systems.

For account creation, the application employs Argon2, a memory-intensive and secure password-hashing algorithm. This method is recognized for its resistance to brute-force attacks and hardware-accelerated cracking attempts. During registration, both the email and password are hashed using Argon2 before being stored in the database. This ensures that even in the unlikely event of a database breach, sensitive user information remains protected.

Methods for Account Creation and Security
Account Creation:
When a user signs up, their email and password are hashed using the Argon2PasswordEncoder, ensuring that plaintext credentials are never stored. The hashed values are securely stored in the database along with other user details.

Login and JWT Token Generation:
During login, the users credentials are authenticated against the hashed values in the database. Upon successful authentication, a JWT token is generated, embedding the users unique identifier and roles. This token is signed using a secret key and sent to the client for use in subsequent requests.

Authorization:
The application includes a custom JwtRequestFilter that intercepts incoming HTTP requests. This filter validates the provided JWT token, extracts the users details, and sets the authentication context. This ensures that only authorized users can access protected endpoints.

Secure Communication:
All sensitive operations, including account creation, login, and data retrieval, occur over HTTPS to prevent interception of data in transit.

This combination of modern frameworks, secure algorithms, and best practices ensures a high level of security and performance, making the application both user-friendly and robust against security threats.
</p>

<h2 style="font-size:20px; font-weight:bold;">Expo Go</h2>
<hr style="border:1px solid #000; margin-top:10px;">
<p style="font-size:16px;">
Expo Go is where RIPT is hosted. Expo Go is free to download on the App Store. Once downlaoded you mujst create an account. Once the account is created, you can use a stable version of our app such as this one as of 1/3/2025: exp://u.expo.dev/ea20e0cb-de85-4497-8c69-2a529bb4a3a4/group/15ab57b4-690a-43cc-9529-729a1e999870

The link that I provided will open the App; where you can create a RIPT account. 

Now you may ask how did I generate that link? Well that link is generated with an "EAS" build. An EAS build requires a few steps. I will provide documentation from Expo Go that shows how to set it up (PART 1): https://docs.expo.dev/build/setup/
The next step iun the setup process is to look at our 'app.json' file which you will see a Project ID. If you want to create a new build (maybe after creationg a feature) you must clear that ID and use 'eas update' in thge command line to generate a new build + ID.
</p>

<h2 style="font-size:20px; font-weight:bold;">Ideas For Future Teams</h2>
<hr style="border:1px solid #000; margin-top:10px;">

<p style="font-size:16px;">Front end features: <br>Implement graphs (backend already setup for this)<br>Add body diagram page (backend would also need to be setup for this)<br>Add "Dark Mode" button or color themes in settings<br>Add a timer to "Start Workout" and "Live Workout" modals<br>Allow for in-all cropping and positioning when selecting a profile picture<br>Implement seeing multiple Days in nutrition tracker (backend already setup for this through getDayOfLoggedInUser/index endpoint)<br>Make it easier on the UI side to create a new day, preferably one day gets its own Day object<br>Automatically save notes when pressing back button<br>Delete not trash can in header of note screen<br>Add hover to notes with a small menu to delete it on the "My Notes" screen<br>Add share icon to posts<br>Pinned notes - these notes will appear at the top even if other notes are added or edited<br>Make nutrition tracker feature faster. It is slower than other features and this is likely on the frontend side.<br>Add your headshots to the team page!<br><br>Workouts backend: <br>Add weight plates calculator (135 = 45lb bar + (2 * 45lb plates))<br>PR Celebrations - Automatic detection and animation for frontend<br>Add ability to add where you're currently working out, and give the user the option to make it public so others can know where you're working out<br><br>Social Post backend:<br>Add the ability to see everyone's posts (on top of just seeing your friends' posts)<br>Add hashtags and searches based on hashtags<br>Add ability to add photos to posts<br><br>User Profile backend:<br>Hide posts on profile screen unless they're on your friend's list<br><br>Nutrition tracker backend:<br>Add more variables such as sugar, sodium, potassium, etc. to Food.java and Day.java total variables<br>Add ability to take a picture of a nutrition label and fill those values when adding a Food<br><br>Other:<br>Add moderation system for spam (admin vs. user accounts)<br>Block/report account feature<br>Private messaging feature<br>Users shouldn't be able to add themselves as a friend<br>Add offline mode<br>Ript Stories<br>Ript Reels<br></p>