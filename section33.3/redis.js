import { Redis } from "ioredis";
import { config } from "../config.js";

var client = new Redis({
    host: config.redis_host,
    port: config.redis_port,
  });

  var get =(key)=>{
    return new Promise((resolve,reject)=>{
        client.get(key,(err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
  }

  var hgetall=(key)=>{
    console.log(key,'should be the dog id, used to get dog value from hmset');
    return new Promise((resolve,reject)=>{
        if(key===null) reject();
        client.hgetall(key,(err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
  }

  var lrange=(key)=>{
    return new Promise((resolve,reject)=>{
        client.lrange(key,[0,-1],(err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
  }

  export {get,hgetall,lrange,client};