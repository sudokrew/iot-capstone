const amqp = require("amqplib/callback_api");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { hostname } = require("os");

const { INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET, RABBIT_MQ } =
  process.env;

const url = INFLUX_URL;
const token = INFLUX_TOKEN;
const org = INFLUX_ORG;
const bucket = INFLUX_BUCKET;

const influx = new InfluxDB({ url, token })
  .getWriteApi(org, bucket, "ns")
  .useDefaultTags({ location: hostname() });

amqp.connect("amqp://rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = RABBIT_MQ;

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.consume(
      queue,
      function (msg) {
        try {
          const payload = JSON.parse(msg.content);
          const dataPoint = new Point("transactions")
            .tag("address", payload.ipAddress)
            .floatField("value", parseInt(payload.deviceStatus))
            .timestamp(new Date());

          influx.writePoint(dataPoint);
        } catch (err) {
          console.error("Error sending transaction to influx: ", err);
        }
      },
      {
        noAck: true,
      }
    );
  });
});
