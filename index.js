import express from 'express';
import Redis from 'ioredis';
import { config } from './config.js';

const redisClient = new Redis({
  host: config.redis_host,
  port: config.redis_port,
});
const publishClient = new Redis({
  host: config.redis_host,
  port: config.redis_port,
});

const app = express();
redisClient.subscribe('REQUEST');

redisClient.on("message",(channel,message)=>{
  console.log(message);
})

app.get('/', async (req, res) => {
  try {
    publishClient.publish('REQUEST', `REQUEST on ${req.socket.localPort} for ${req.url}`);
    console.log(`Local log for ${req.url}`);
    res.send('Request published');
  } catch (error) {
    console.error('Error publishing request:', error);
    res.status(500).send('Error publishing request');
  }
});

const port = process.argv[2] || 8000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


