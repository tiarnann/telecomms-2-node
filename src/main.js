'use strict';

//Set Routing type here!!
let LSR=true;
let ROUTING_TYPE=(LSR)?'LinkState':'DistanceVector';
let Server=require(`../lib/routing/${ROUTING_TYPE}`);
let Client=require('../lib/Client');

/* ==================================
 		= Network Map =
 ==================================*/

 /*	      B------F
            / | \
	   /  |  \
          /   |   \
   E-----A    |    C-----G
          \   |   /
           \  |  /
            \ | /
              D------H
*/

console.log(`\n/*==================================/
	\nTelecommunications Assignment #2\nConfig: ${ROUTING_TYPE} Routing
	\n ==================================*/\n`);


/* ==================================
 	= Define Server and Client Configuration =
 ==================================*/
let ServerConfigObjects=[
	{port:5000,address:'localhost',connected:[5001,5003,5005]},		/* A */
	{port:5001,address:'localhost',connected:[5000,5002,5003,5006]},	/* B */
	{port:5002,address:'localhost',connected:[5001,5003,5007]},		/* C */
	{port:5003,address:'localhost',connected:[5000,5001,5002,5008]}		/* D */
],
	ClientConfigObjects=[
	{port:5005,address:'localhost',connected:[5006,5007,5008],server:{address:'localhost', port:5000}},	/* E */
	{port:5006,address:'localhost',connected:[5005,5007,5008],server:{address:'localhost', port:5001}},	/* F */
	{port:5007,address:'localhost',connected:[5005,5006,5008],server:{address:'localhost', port:5002}},	/* G */
	{port:5008,address:'localhost',connected:[5005,5006,5007],server:{address:'localhost', port:5003}}	/* H */
];

let Servers=ServerConfigObjects.map((config)=> new Server(config));
let Clients=ClientConfigObjects.map((config)=> new Client(config));

//Send test message
setTimeout(function(){
	let address=Clients[0].socket.address();
	console.log(`Sending packet from client on ${address.address}:${address.port} to localhost:5008`)

	Clients[0].send('hello', 'localhost', 5008);
},5000);
