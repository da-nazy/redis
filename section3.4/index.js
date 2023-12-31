import express from 'express';
import * as redis from './redis.js';

var app=express();

// setup redis data
// make sure the database is clean
redis.client.flushall();

redis.client.hmset('dog:1',['name','gizmo','age','5']);
redis.client.hmset('dog:2',['name','dexter','age','6']);
redis.client.hmset('dog:3',['name','fid','age','5']);


// we are using name like username, unique
redis.client.set('dog:name:gizmo','dog:1');
redis.client.set('dog:name:dexter','dog:2');
redis.client.set('dog:name:fido','dog:3');


app.use((req,res,next)=>{
    console.time('request');
    next();
})

app.get('/dog/name/:name',(req,res)=>{
    var now =Date.now();
    redis.client.zadd('dog:last-lookup',[now,'dog:name:'+req.params.name]);
     //first find the id
     redis.get('dog:name:'+req.params.name)
     .then((data)=>{
        redis.client.hset(data,'last-lookup',now);
        return data;
    })
    .then(redis.hgetall)
    .then((data)=>res.send(data));

     console.timeEnd('request');
});

app.get('/dog/any',(req,res)=>{
    // +infinity to -infinity  to look up every score from negative to positive
    // from name we get id from id we get hash

    redis.zrevrangebyscore('dog:last-lookup','+inf','-inf')
    .then((data)=>Promise.all(data.map(redis.get)))
    .then((data)=>Promise.all(data.map(redis.hgetall)))
    .then((data)=>res.send(data));
    console.timeEnd('request');
})

app.get('/dog/latest',(req,res)=>{
    var now=Date.now();
    var minuteAgo=now-60000;
    // this returns all the dogs in the last 60 seconds
    //zreversrangebyscore
    // to take items that are between now and 1 minute ago

    redis.zrevrangebyscore('dog:last-lookup',now,minuteAgo)
    .then((data)=>Promise.all(data.map(redis.get)))
    .then((data)=>Promise.all(data.map(redis.hgetall)))
    .then((data)=>res.send(data));
    console.timeEnd('request');
})




app.listen(process.argv[2]);