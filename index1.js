
import express from 'express';
import { createClient } from 'redis';
import { config } from './config.js';
//process=require('process');
const redisConnect=async()=>{
    await client.connect();
}
var app=express();
// if using locally make sure that the docker container is running
// connect to redis


const client = createClient(config.redis_host,config.redis_port);

client.on('error', err => console.log('Redis Client Error', err));

redisConnect()
const setRed=async()=>{
  //  await client.set('REDIS_KEY','0');
}

setRed();

app.get('/',(req,res)=>{
  redKey(res);
});

const redKey=async(res)=>{ 
    try{
        
        await client.incr('REDIS_KEY');
        let value=await client.get('REDIS_KEY');
        if(value){
            res.send(
                "<html><head><title>Page</title></head><body><h1>Our Redis and Express Web Application</h1>" +
                "Redis count: " + value +
                "</body></html>"
            );
            res.end();
        }
    }catch(err){
        throw new Error(`Error in REDIS ${err}`);
    }
    
};

const getRed=async(res)=>{
    await client.set('key', '2pvaoel');
    const value = await client.get('key');
    
    res.send('Good to go Charlie'+value);
    await client.disconnect();

}
app.get('/test',(req,res)=>{
  getRed(res);
    
});
//app.listen(8000);
app.listen(process.argv[2]);