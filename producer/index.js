const express = require("express");
const bodyParser = require("body-parser");
const amqp = require('amqplib/callback_api');
const cors = require("cors");

const { PORT, RABBIT_MQ } = process.env;

const app = express();
const port = PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json({ sanity: "check" });
});

app.post("/transaction", async (req, res, next) => {
  try {
    const { ethAddress, ethAmount } = req.body;
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const queue = RABBIT_MQ;

            const data = {
              ethAddress,
              ethAmount,
            }

            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
    res.json({ ethAddress, ethAmount });
  } catch (err) {
    console.log('ERROR: ', err)
    next(err);
  }
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Server Error')
})

app.listen(port, () => {
  console.log(`Message producer listening at http://localhost:${port}`);
});