'use strict';

let Packet=require('./Packet');
let RoutingTable=require('./RoutingTable');
let TableRow=require('./TableRow');
let Server=require('./Server');
let Client=require('./Client');
/* ==================================
 		= Network Map =
 ==================================*/

 /*		      B------F
	 		/ | \
	 	   /  |  \
          /   |   \
   E-----A    |    C------G
          \   |   /
           \  |  /
            \ | /
              D-------H


 ==================================
 = Server and Client Config ports =
 ==================================*/

let ServerConfigObjects=[
	{port:5000,address:'localhost',connected:[5001,5003,5005]},			//A
	{port:5001,address:'localhost',connected:[5000,5002,5003,5006]},	//B
	{port:5002,address:'localhost',connected:[5001,5003,5007]},			//C
	{port:5003,address:'localhost',connected:[5000,5001,5002,5008]}		//D
];

let ClientConfigObjects=[
	{port:5005,address:'localhost',connected:[5006,5007,5008],server:{address:'localhost', port:5000}},	//E
	{port:5006,address:'localhost',connected:[5005,5007,5008],server:{address:'localhost', port:5001}},	//F
	{port:5007,address:'localhost',connected:[5005,5006,5008],server:{address:'localhost', port:5002}},	//G
	{port:5008,address:'localhost',connected:[5005,5006,5007],server:{address:'localhost', port:5003}}	//H
];



let Servers=new Array(ServerConfigObjects.length);

Array.from(ServerConfigObjects, (x, index)=> Servers[index]=new Server(x));

let Clients=new Array(ClientConfigObjects.length);
Array.from(ClientConfigObjects, (x, index)=> Clients[index]=new Client(x));

// let Client= new Server({'port': 5000+20, 'address':'localhost', 'connected':[]});
// let message="Hello";
setTimeout(function(){
	let address=Clients[0].socket.address();
	console.log(`Sending packet from client on ${address.address}:${address.port} to localhost:5008`)
	Clients[0].send('hello', 'localhost', 5008);
},5000);
