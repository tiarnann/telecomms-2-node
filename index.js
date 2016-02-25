'use strict';

let RoutingTable=require('./RoutingTable');
let TableRow=require('./TableRow');
let Server=require('./Server');
let Packet=require('./Packet');

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
	{port:5000,address:'localhost',connected:[5001,5003,5005]},		//A
	{port:5001,address:'localhost',connected:[5000,5002,5003,5006]},	//B
	{port:5002,address:'localhost',connected:[5001,5003,5007]},		//C
	{port:5003,address:'localhost',connected:[5000,5001,5002,5008]}	//D
];

let ClientConfigObjects=[
	{port:5005,address:'localhost',connected:[5000]},	//E
	{port:5006,address:'localhost',connected:[5001]},	//F
	{port:5007,address:'localhost',connected:[5002]},	//G
	{port:5008,address:'localhost',connected:[5003]}	//H
];


let Servers=new Array(ServerConfigObjects.length);

Array.from(ServerConfigObjects, (x, index)=> Servers[index]=new Server(x));

// let Clients=new Array(ClientConfigObjects.length);
// Array.from(ClientConfigObjects, (x, index)=> Clients[index]=new Client(x));

// let Client= new Server({'port': 5000+20, 'address':'localhost', 'connected':[]});
// let message="Hello";

setTimeout(function(){
	let buff=new Packet('hello','localhost',5003,'localhost',5000).toBuffer();
	Servers[0].socket.send(buff, 0, buff.length, 5002, 'localhost', (err) => {
		Servers[0].socket.close();
	});
},5000);
