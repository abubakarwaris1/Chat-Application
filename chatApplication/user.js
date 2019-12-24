const http=require('http')
const url='http://localhost:3000/'
const io=require('socket.io-client')
var bodyParser=require('body-parser')
let socket = io('http://localhost:3000');
//var readline = require('readline');
const readlineAsync=require('readline-async')
let userName=''
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Who are you?', name => {
    userName=name;
    startConversation()
    // readline.close();
});
function startConversation() {
    readline.close()
    console.log("You can start the conversation");

    async function call() {
        console.log(`[${userName}]:`);
        return readlineAsync().then(line => {


            data = {
                name: `"${userName}"`,
                message: `"${line}"`
            };
            if (!line == '' && !line.trim() == '') {
                socket.emit('message', data)
            }

            if (line == 'end conversation') {
                process.exit(1)
            }

            setTimeout(call, 500)
        });

    }

    call().then(line => {
        //call()
    });
    socket.emit('user', `"${userName}"`);
    socket.on('message', function (data) {
        if (JSON.parse(data.name) === userName) {

        } else if (JSON.parse(data.message) == 'end conversation') {
            console.log(`${data.name} ENDED THE CONVERSATION`)
        } else {
            console.log(`[${JSON.parse(data.name)}]:${JSON.parse(data.message)}`)
        }
    });
    socket.on('userConnected', (user) => {
        if (user!=`"${userName}"`) {

            console.log(`${user} has joined the conversation`)
        }
    });
}

