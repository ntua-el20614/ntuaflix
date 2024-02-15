# Software Engineering CLI

## Introduction
CLI implementation

## First time
1. npm i axios commander
2. npm init -y
3. add below main in package.json
"bin": {
    "se2330": "./cli.js"
  },
4. npm install
5. npm link

## How to
1. Remove-Item -Path .\node_modules -Recurse -Force
2. Remove-Item -Path .\package-lock.json -Force
3. run the command npm install
4. run the command npm link