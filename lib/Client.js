'use strict';
const DatagramSocket = require('dgram');
const Packet=require('./Packet');

class Client
{
	/*
	@params
	config = 
	{
		server:{address:, port:}
		address:..., (address of socket to bind)
		port:...,	 (address of socket to bind)
		connected:[] (array of connected nodes to contact)
	}
	*/
	constructor(config)
	{
		this.connected=config.connected.slice();
		this.server={address:config.server.address,port:config.server.port};
		this.socket=DatagramSocket.createSocket('udp4');
		this.socket.bind({address:config.address,port:config.port});
		this.config();	
	}
	config()
	{
		//Socket event config
		this.socket.on('message', (msg, rinfo) => {
			//Convert from buffer to string
			msg=msg.toString('ascii');
			let isRoutingTable=(msg.charAt(0).localeCompare(String.fromCharCode(7))===0);
			if(!isRoutingTable) this.onReceive(Packet.parse(msg));
		})
		.on('listening', () => {
			let address = this.socket.address();
			console.log(`Client listening ${address.address}:${address.port}`);
		})
		.on('error', (err) => {
			console.log(`Client error:\n${err.stack}`);
			this.socket.close();
		}); 
	}
	send(msg, dstAddr, dstPort)
	{
		let address= this.socket.address();
		let buffer=new Packet(msg, dstAddr, dstPort, address.address, address.port ).toBuffer();
		this.socket.send(buffer, 0, buffer.length, this.server.port, this.server.address);
	}
	onReceive(packet)
	{
		let address= this.socket.address();
		console.log(`Client on ${address.address}:${address.port} got message from ${packet.source.address}:${packet.source.port}. \nMessage: ${packet.message}`);
	}
}

module.exports=Client;


