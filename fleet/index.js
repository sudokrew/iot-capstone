const fetch = require("node-fetch");
const faker = require("faker");

require('dotenv').config()

const { MESSAGE_QUEUE_POST_ENDPOINT } = process.env;

class Device {
  constructor(ipAddress) {
    this.ipAddress = ipAddress;
  }
  sendStatus() {
    

    const data = { ipAddress: this.ipAddress, deviceStatus: Math.floor(Math.random() * 3) };

    fetch(MESSAGE_QUEUE_POST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

const deviceOne = new Device(faker.internet.ip());
const deviceTwo = new Device(faker.internet.ip());
const deviceThree = new Device(faker.internet.ip());

setInterval(() => {
  deviceOne.sendStatus();
}, 1500);

setInterval(() => {
  deviceTwo.sendStatus();
}, 2000);

setInterval(() => {
  deviceThree.sendStatus();
}, 1000);
