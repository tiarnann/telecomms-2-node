'use strict';

//  ==================
//  = Packet Class =
//  ==================
class Packet
{
	/*
	constructor(msg,dstAddr,dstPort,srcAddr,srcPort)
	@params
		msg (message to send),
		dstAddr (destination address),
		dstPort (destination port),
		srcAddr (source address),
		srcPort (source port)

	*/
	constructor(msg,dstAddr,dstPort,srcAddr,srcPort)
	{
		this.destination={}, this.source={};
		this.message=msg;
		this.destination.address=dstAddr;
		this.destination.port=dstPort;
		this.source.address=srcAddr;
		this.source.port=srcPort;
	}
	toBuffer()
	{
		if(typeof this !=='Packet')
		{
			
			return new Buffer(this.toString(),'ascii');
		}
		else
		{
			throw Error('Failed to parse packet as it was');
			return null;
		}
	}
	static parse(packetString)
	{
		if(typeof packetString ==='string')
		{
			let obj=JSON.parse(packetString); 
			return new Packet(obj.message,obj.destination.address,obj.destination.port,obj.source.port,obj.source.port);
		}
		else
		{
			throw Error('Failed to parse packet as it was');
			return null;
		}
	}

	toString()
	{
		return JSON.stringify(packetString);
	}
}

module.exports=Packet;