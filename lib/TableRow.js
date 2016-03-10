'use strict';

//  ==================
//  = TableRow Class =
//  ==================
class TableRow
{
	constructor(node, cost, nextHop)
	{
		this.node = node;
		this.cost = cost;
		this.nextHop = nextHop;
	}
	getNode()
	{
		return this.node;
	}

	getCost()
	{
		return this.cost;
	}

	getNextHop()
	{
		return this.nextHop;
	}
	static equals(row1, row2)
	{
		if(row1.getNode()===row2.getNode() && row1.getCost()===row2.getCost() && row1.getNextHop()===row2.getNextHop()) return true; 
		return false;
	}
}

module.exports=TableRow;