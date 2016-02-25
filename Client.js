'use strict';
const DatagramSocket= require('dgram');
const Packet=require('./Packet');

class Client
{
	/*
	@params
	config = 
	{
		address:..., (address of socket to bind)
		port:...,	 (address of socket to bind)
		connected:[] (array of connected nodes)
	}
	*/
	constructor(config){}
	onReceive(){}
	send(){}
}