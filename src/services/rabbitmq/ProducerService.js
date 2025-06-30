/* eslint-disable no-undef */
const amqp = require("amqplib");

const ProducerService = {
  sendMessage: async (queue, message) => {
    // membuat koneksi ke RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    // membuat channel
    const channel = await connection.createChannel();
    // membuat queue (antrian)
    await channel.assertQueue(queue, {
      durable: true,
    });

    // mengirim pesan dalam bentuk Buffer ke queue
    await channel.sendToQueue(queue, Buffer.from(message));

    // menutup koneksi setelah satu detik
    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
