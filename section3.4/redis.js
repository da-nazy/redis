import { Redis } from "ioredis";
import { config } from "../config.js";

var client = new Redis({
    host: config.redis_host,
    port: config.redis_port,
  });

  var promiser=(resolve,reject)=>{
    return(err,data)=>{
      if(err) reject(err);
      resolve(data);
    }
  }

  var get =(key)=>{
    return new Promise((resolve,reject)=>{
        client.get(key,promiser(resolve,reject));
    })
  }

  var hgetall=(key)=>{
    console.log(key,'should be the dog id, used to get dog value from hmset');
    return new Promise((resolve,reject)=>{
        if(key===null) reject();
        client.hgetall(key,promiser(resolve,reject))
    })
  }

  var lrange=(key)=>{
    return new Promise((resolve,reject)=>{
        client.lrange(key,[0,-1],promiser(resolve,reject))
    })
  }

  // a sorted set command
  var zrevrangebyscore=(key,max,min)=>{
    return new Promise((resolve,reject)=>{
      client.zrevrangebyscore(key,max,min,promiser(resolve,reject));
    })
  }

  export {get,hgetall,lrange,client,zrevrangebyscore};