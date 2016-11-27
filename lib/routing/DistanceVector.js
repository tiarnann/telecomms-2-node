'use strict';

const DatagramSocket = require('dgram');
let RoutingTable=require('../RoutingTable');
let Packet=require('../Packet');

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
		//Socket Binding
		this.socket=DatagramSocket.createSocket('udp4');
		this.socket.bind(config,()=>
		{
			//Routing Table Config
			this.forwardingTable=new RoutingTable(config.connected.length+1);
			this.connected=config.connected.slice();
			this.generateRoutingTable()
		});

		//Socket event config
		this.socket.on('message', (msg, rinfo) => {
			//Convert from buffer to string
			msg=msg.toString('ascii');
			let isRoutingTable=(msg.charAt(0).localeCompare(String.fromCharCode(7))===0);


			if(isRoutingTable) this.onReceiveRoutingTable(msg,rinfo);
			else this.onReceivePacket(Packet.parse(msg));
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

	onReceiveRoutingTable(routingTableString, sender)
	{
		routingTableString=routingTableString.substring(1);
		let routingTableCopy=RoutingTable.parseToRoutingTable(routingTableString);
		let receivedTable=RoutingTable.fromPartial(routingTableString,sender.port, this.forwardingTable.nodeCost(sender.port));

		this.forwardingTable=RoutingTable.distanceVector(this.forwardingTable, receivedTable);
		if(RoutingTable.equals(routingTableCopy, this.forwardingTable))
		{
			console.log(`Sending routing table to ${sender.address}:${sender.port}`);
			this.distributeRoutingTableToNeighbours();
		}

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

	distributeRoutingTableToNeighbours()
	{
		let routingTableString=String.fromCharCode(7)+this.forwardingTable.toString();
		let buff=new Buffer(routingTableString,'ascii');
		Array.from(this.connected, (node,index)=>
			{
				this.socket.send(buff, 0, buff.length,node,'localhost');
			});
	}

	generateRoutingTable()
	{
		let address=this.socket.address();
		this.forwardingTable.addRouter(address.port, 0, address.port);
		for(let node of this.connected)
		{
			let randomCost=parseInt((Math.random()*46)%10)+3;
			this.forwardingTable.addRouter(node, randomCost, node);
		}
		this.distributeRoutingTableToNeighbours();

	}
}

module.exports=Server;