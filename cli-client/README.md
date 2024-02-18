# NtuaFlix CLI
The NtuaFlix CLI is a command-line tool designed to interact with the NtuaFlix platform. It allows the use of some of NtuaFlix's features through command line interface. This tool is intended for administrators.

## **Getting Started**
These instructions will guide you through installing and using the NtuaFlix CLI on your local machine for development, management, and operational tasks.

### **Installing**
Navigate at cli-client directory
1. ``` npm i axios commander ```
2. ``` npm init -y ```
3. add below main in package.json
```
"bin": {
    "se2330": "./cli.js"
  },
```
5. ``` npm install ```
6. ``` npm link ```

 ## **Basic Usage**
 Open your CLI and type a command from the table using the format below:
   - ``` se2330 scope --param1 value1 [--param2 value2 ...] --format fff ```

| Scope         | Authorization Needed | Parameters                                | REST API Endpoint                     |
|---------------|:--------------:|-------------------------------------------|---------------------------------------|
| login         |             | `--username`, `--passw`                   | `/login`                              |
| logout        | Yes            | None                                      | `/logout`                             |
| adduser       | Yes            | `--username`, `--passw`                   | `/admin/usermod/:username/:password`  |
| user          | Yes            | `--username`                              | `/admin/users/:username`              |
| healthcheck   | Yes            | None                                      | `/admin/healthcheck`                  |
| resetall      | Yes            | None                                      | `/admin/resetall`                     |
| newtitles     | Yes            | `--filename`                              | `/admin/upload/titlebasics`           |
| newakas       | Yes            | `--filename`                              | `/admin/upload/titleakas`             |
| newnames      | Yes            | `--filename`                              | `/admin/upload/namebasics`            |
| newcrew       | Yes            | `--filename`                              | `/admin/upload/titlecrew`             |
| newepisode    | Yes            | `--filename`                              | `/admin/upload/titleepisode`          |
| newprincipals | Yes            | `--filename`                              | `/admin/upload/titleprincipals`       |
| newratings    | Yes            | `--filename`                              | `/admin/upload/titleratings`          |
| title         | Yes            | `--titleID`                               | `/title/:titleID`                     |
| searchtitle   | Yes            | `--titlepart`                             | `/searchtitle`                        |
| bygenre       | Yes            | `--genre`, `--min`, optionally `(--from, --to)` | `/bygenre`                   |
| name          | Yes            | `--nameid`                                | `/name/:nameID`                       |
| searchname    | Yes            | `--name`                                  | `/searchname`                         |
