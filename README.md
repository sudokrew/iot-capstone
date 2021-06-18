# IoT Capstone

This repo will servce as the capstone for a series of IoT related content marketing articles we have written in early 2021.

The idea is to illustrate how some of the technologies we have been describing fit together in a relatively simple demo.

In this example, we are virtualizing a "fleet" of devices, that emit mock device status from mock IP addresses.

## Local Development

To bring up the producer, consumer, and message queue: `docker-compose up`

To initialize virtualized device fleet:
    - `cd fleet`
    - `npm install`
    - `node index.js`
