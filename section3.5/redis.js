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

 var aroundLoc=(long,lat,miles)=>{
  // around location function . this will return everything around a location 
  return new Promise((resolve,reject)=>{
    client.georadius('places',long,lat,miles,'mi','WITHDIST',promiser(resolve,reject));
  })
 }

 var aroundSB=(miles)=>{
  // this will look around a south bend
  // takes south bend and check everything within a certain amount of miles
  return new Promise((resolve,reject)=>{
    client.georadiusbymember('places',"South Bend",miles,'mi','WITHDIST',promiser(resolve,reject));
  })
 }

  export {client,aroundLoc,aroundSB};