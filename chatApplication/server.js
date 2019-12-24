var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const mongo=require('mongodb').MongoClient

const url = 'mongodb://localhost:27017/'
mongo.connect(url, (error, client) => {
    db = client.db('chat-app')
    if (error) return process.exit(1)
    console.log('server is running')

    io.on('connection',function (socket) {
        console.log('a user connected')
        socket.on('message',function (data) {
            var collection = db.collection('message')
            collection.insertOne(data,(error,result)=>{
                if(error) return console.log(error)
                console.log('data written')
            })
            io.emit('message',data);
        })
        socket.on('user',(name)=>{
            io.emit('userConnected',name)
        })
    });
    //app.use(errorhandler())
    server.listen(3000)
});
