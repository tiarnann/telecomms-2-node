'use strict';

const DatagramSocket = require('dgram');
let RoutingTable=require('./RoutingTable');
let Packet=require('./Packet');

class Server
{
	/*
	config = 
	{
		address:..., (address of socket to bind)
		port:...,	 (address of socket to bind)
		connected:[] (array of connected nodes)
	}
	*/
	constructor(config)
	{
		//NETWORK_GRAPH used for link state routing
		this.NETWORK_GRAPH= {	
			'5000':{connections:[{cost:2,node:5001},{cost:8,node:5003},{cost:9,node:5005}]},					/* A */ 
			'5001':{connections:[{cost:2,node:5000},{cost:4,node:5002},{cost:4,node:5003},{cost:6,node:5006}]},	/* B */ 
			'5002':{connections:[{cost:4,node:5001},{cost:2,node:5003},{cost:3,node:5007}]},					/* C */ 
			'5003':{connections:[{cost:8,node:5000},{cost:4,node:5001},{cost:2,node:5002},{cost:7,node:5008}]},	/* D */ 
			'5005':{connections:[{cost:9,node:5000}]},															/* E */ 
			'5006':{connections:[{cost:6,node:5001}]},															/* F */ 
			'5007':{connections:[{cost:3,node:5002}]},															/* G */ 
			'5008':{connections:[{cost:7,node:5003}]} 															/* H */ 
		};

		//Socket Binding
		this.socket=DatagramSocket.createSocket('udp4');
		this.socket.bind(config,()=>
		{
			//Routing Table Config
			this.forwardingTable=new RoutingTable(config.connected.length);
			this.connected=config.connected.slice();
			this.generateNetworkGraph();
		});

		//Socket event config
		this.socket.on('message', (msg, rinfo) => {
			//Convert from buffer to string
			msg=msg.toString('ascii');
			this.onReceivePacket(Packet.parse(msg));
		})
		.on('listening', () => {
			let address = this.socket.address();
			console.log(`Server listening ${address.address}:${address.port}`);
		})
		.on('error', (err) => {
			console.log(`Server error:\n${err.stack}`);
			this.socket.close();
		}); 
	}

	onReceivePacket(packet)
	{	
		let address=this.socket.address();
		let forHere=(address.port==packet.destination.port);
		if(!forHere) this.send(packet);
		else console.log(`Server on ${address.address}:${address.port} got packet:\n${packet.message} from ${packet.source.address}:${packet.source.port}. Its going nowhere :(`);
	}

	send(packet)
	{
		let buffer= packet.toBuffer();
		let node= packet.destination.port;
		let nextHop=this.forwardingTable.nextHop(node);

		if(nextHop!=-1) this.socket.send(buffer, 0, buffer.length,nextHop, 'localhost');		
		else
		{
			let address = this.socket.address();
			console.log(`Server listening ${address.address}:${address.port}, cannot deliver packet to localhost:${node}`);
		}
	}

	generateNetworkGraph()
	{
		let address= this.socket.address();
		//console.log(this.NETWORK_GRAPH);
		let graph=RoutingTable.Dijkstra(this.NETWORK_GRAPH, address.port);		
		this.forwardingTable=new RoutingTable(Object.keys(graph.dist).length);
		
		for(let key in graph.dist)
		{
			let node=parseInt(key);//5000
			let nextHop=node;
			while(graph.prev[nextHop] != address.port){
				nextHop=parseInt(graph.prev[nextHop]);//5002	
			}
			this.forwardingTable.addRouter(node, graph.dist[nextHop], nextHop);
		}
		//DEBUG
		//this.forwardingTable.print();
	}
}

module.exports=Server;