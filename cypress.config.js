const { defineConfig } = require("cypress");
const fs = require('fs');

module.exports = defineConfig({
  //Due to CORS limitation, the chromeWebSecurity has been set to false in order to test the iFrame
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      //the task created for reading a text file
      on('task',{
        readFile(filename) {
          return new Promise((resolve, reject) => {
          fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
        });
      });
    }
    });
  },
    //the localhost is saved in the baseUrl
    baseUrl:"http://localhost:3000/task.html",
    }
    });