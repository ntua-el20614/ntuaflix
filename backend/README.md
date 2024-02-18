# **NtuaFlix Backend**
This directory contains the backend code for NtuaFlix, a platform designed to provide information related to movies and series. It provides a RESTful APIs for data management and user authentication.

## **Getting Started**
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### **Prerequisites**
- Node.js
- npm
- MySQL Workbench

### **Installing**
- Navigate to backend directory and run the command:
  * npm i dotenv express cors multer mysql2 papaparse bcryptjs jsonwebtoken
- Navigate in the utils directory and rename the testConnection.js to database.js
- In the database.js change the port to match the port of your database.
  - port: 3306 (here change the 3306 to the actual port of your database)

 ## **Running**
 Navigate to backend directory and run the command:
   - node server.js

## **Testing**
In order to test backend you can use [Postman](https://www.postman.com/) 
### **Examples of a get and a post request using Postman**
- Get Request
![](https://github.com/ntua/softeng23-30/blob/main/assets/getRequest.png)
- Post Request
![](https://github.com/ntua/softeng23-30/blob/main/assets/postRequest.png)
