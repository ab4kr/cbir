# Setup required to run the project
### Check you have node installed on your system
- Open command prompt and type the command shown below.
```console
node -v
```
- If you receive an output like this
```console
v20.5.0
```
This shows the available version of node on your system. If node is not installed on your system, you will get the result shown below
```console
'node' is not recognised as an internal or external command,
operable program or batch file.
```
- If you haven't installed node follow the steps to download and setup the node path.
- Download [Node](https://nodejs.org/en)
- After downloading the msi file, double-click on the installer, agree the terms and click next, next, install and Finish.
- Setting up the node path to system environment variable.
   - Go inside and copy the file path
     ```console
     C:\Program Files\nodejs
     ```
   - Search `edit the system environment variables` in windows search bar
   - Click to open
   - Click on `Environment Variables...`
   - Navigate to `System variables` and click on `path` inside it.
   - Once you have selected the `path` option now click on `Edit`, now the list of system variables will open.
   - Click on `New` option and paste the copied file path here.
   - Click on `OK`, `OK` and `OK`
- We are using sql database so the tools required are:
  - Download and install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) - To run the sql server
  - Download and install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) - To Visualise the Data stored in the server
  - You can set the mysql server path to environment variables exactly like the nodejs, if you want to run mysql commands from anywhere in the terminal.
  - Create a database user and remember the password, it is required to connect the database.

## Downloading the code and setting up the packages.
  - Downloading and extracting the code files
    - Download the zip file of the code and extract it in your project folder on your local machine.
    - Open VS code or any IDE and open the project folder.
  - Open terminal inside the project folder and downloading required packages
    - Type the command shown below in terminal
      ```console
      npm install
      ```
    - Here `npm` is node package manager, this command will install all the dependencies of this project, now you will be able to see a `node_modules` folder inside your project.

## Starting the MySQL Server
- Open MySQL Workbench and login with the database username and password, by default the user is root.
- Start the server.

## Variables and Credentials required to change in the code
### Creation of pexels.com API Key and Connection  
- Go to [pexels.com/api/new](https://www.pexels.com/api/new/), signup and login to create an API Key.
- Copy the API Key and paste inside the `public/script.js` file, inside the `fetchingDataFromPexels` function, in place of `YOUR_PEXELS_API_KEY`.
### Setting MySQL Database credentials
- Go to `server.js` and setup the database credentials in the `Database Connection` code, change `user`, `password` and `database` with your data respectively.

---

### Running the command to run the server
```console
npm start
```
- Open [localhost:3000](http://localhost:3000/)

## 😀 Enjoy!
