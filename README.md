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

<h2 style="font-size:20px; font-weight:bold;">Working with Microsoft Azure</h2>
<hr style="border:1px solid #000; margin-top:10px;">

<h2 style="font-size:20px; font-weight:bold;">Security</h2>
<hr style="border:1px solid #000; margin-top:10px;">

<h2 style="font-size:20px; font-weight:bold;">Expo Go</h2>
<hr style="border:1px solid #000; margin-top:10px;">

<h2 style="font-size:20px; font-weight:bold;">Ideas For Future Teams</h2>
<hr style="border:1px solid #000; margin-top:10px;">