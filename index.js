var ProtoBuf = require("protobufjs");

var root = ProtoBuf.loadSync("./proto/p.proto");

var textMessage = root.lookupType("tutorial.Person");

var payload = {id: 13, email: 'aaa' };

var errMsg = textMessage.verify(payload);
if (errMsg) throw Error(errMsg);

var message = textMessage.create(payload); // or use .fromObject if conversion is necessary
console.log(message)

var buffer = textMessage.encode(message).finish();

var WebSocket = require('ws');
const client = new WebSocket('ws://localhost:10101');
client.binaryType = "arraybuffer";
client.onopen = function () {
    console.log(buffer);
    client.send(buffer);
}
client.onmessage = function(evt) {
    var buf = new Uint8Array(evt.data);
    console.log(textMessage.decode(buf))
    // const data = root.deserializeBinary(e.data);
    // console.log(data)
    // var reader = new FileReader();
    // reader.readAsArrayBuffer(evt.data);
    // reader.onload = function (e) {
    //     var buf = new Uint8Array(reader.result);
    //     console.log('<span style="color: blue;">RESPONSE: ' + WSMessage.decode(buf).content + '</span>');
    // }
}
client.onclose=function(evt) {
    console.log("DISCONNECTED++++++++++++");
}

client.onerror =function(evt) {
    console.log("error+++++++++");
}

