const fetch = require("node-fetch");
const faker = require("faker");

require('dotenv').config()

const { MESSAGE_QUEUE_POST_ENDPOINT } = process.env;

class Device {
  constructor(ethAddress) {
    this.ethAddress = ethAddress;
  }
  sendTransaction() {
    const ethAmount = faker.finance.amount(0, 10, 5);

    const data = { ethAddress: this.ethAddress, ethAmount };

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

const deviceOne = new Device(faker.finance.ethereumAddress());
const deviceTwo = new Device(faker.finance.ethereumAddress());
const deviceThree = new Device(faker.finance.ethereumAddress());

setInterval(() => {
  deviceOne.sendTransaction();
}, 1500);

setInterval(() => {
  deviceTwo.sendTransaction();
}, 2000);

setInterval(() => {
  deviceThree.sendTransaction();
}, 1000);
