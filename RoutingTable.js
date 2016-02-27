'use strict';

let TableRow= require('./TableRow');

//  ======================
//  = RoutingTable Class =
//  ======================
class RoutingTable
{
	/*
		constructor(n)
		Definition: constructs RoutingTable of n rows 
		@params
			n : Number (capacity)  
		@return  
			table : RoutingTable
	*/
	constructor(n)
	{
		this.routingTable=[];
		this.filled=0;
		this.capacity=n;
	}

	/*
		addRouter(node, cost, nextHop)
		Definition: adds row to routing table with passed variables
			node : Number (Node)
			cost : Number
			nextHop : Number (Node)
	*/
	addRouter(node, cost, nextHop)
	{
		let row = new TableRow(node, cost, nextHop);
		if(this.filled < this.capacity)
		{
			this.routingTable[this.filled++] = row;
		}
	}

	/*
		hasNext()
		Definition: returns whether the routing table has another row to fill 
		@return  
			hasNext : Boolean
	*/
	hasNext()
	{
		return this.filled < this.capacity;
	}

	/*
		next()
		Definition: returns current row
		@return  
			row : TableRow
	*/
	next()
	{
		if(this.hasNext())
		{
			return this.routingTable[this.filled++];
		}
		return null;
	}

	/*
		getCapacity()
		Definition: returns routing table's capacity
		@return  
			capacity : Number
	*/
	getCapacity()
	{
		return this.capacity;
	}

	/*
		nextHop(node)
		Definition: returns nextHop when sending to passed node
		@params
			node : Number (Node)
		@return  
			capacity : Number
	*/
	nextHop(node)
	{
		for(let row of this.routingTable)
		{
			if(row.getNode() ==  node)
			{
				return row.getNextHop();
			}
		}
		return -1;
	}


	/*
		nodeCost(node)
		Definition: returns cost when sending to passed node
		@params
			node : Number (Node)
		@return  
			cost : Number
	*/
	nodeCost(node)
	{
		for(let row of this.routingTable)
		{
			if(row.getNode() ==  node)
			{
				return row.getCost();
			}
		}
		return -1;
	}

	/*
		static equals(table1, table2)
		Definition: returns whether two passed routing tables are equal or not
		@params
			table1 : RoutingTable
			table2 : RoutingTable 
		@return  
			equals : Boolean
	*/
	static equals(table1, table2)
	{
		if(table1.getCapacity()!= table2.getCapacity()) return false;
		for(let row of table1.routingTable)
		{
    		let node=row.getNode();
    		let cost=row.getCost();
    		let nextHop=row.getNextHop();

			for(let i=0; i<table2.routingTable; i++)
			{
				let nodeCmp=table2.routingTable[i].getNode();
	    		let costCmp=table2.routingTable[i].getCost();
	    		let nextHopCmp=table2.routingTable[i].getNextHop();
				if(node !=nodeCmp || cost!=costCmp || nextHop!=nextHopCmp) return false;
			}
		}
		return true;
	}

	/*
		static fromPartial(partial, sender, costToSender)
		Definition: returns new table from partial with resultant cost and new next hop
		@params
			partial : String (RoutingTable as String)
			sender : Number (Node)
			costToSender : Number
		@return  
			equals : Boolean
	*/
	static fromPartial(partial, sender, costToSender)
	{
		let newTable=this.parseToRoutingTable(partial);
	    for(let row of newTable.routingTable)
	    {
	    	row.cost+=costToSender;
	    	row.nextHop=sender;
	    }
	    return newTable;
	}

	/*
		distanceVector(oldTable, receivedTable)
		Definition: Uses Distance Vector Algorithm to create new table 
		@params 
			oldTable : RoutingTable
			receivedTable : RoutingTable
		@return  
			newTable : RoutingTable
	*/
	static distanceVector(oldTable, receivedTable)
	{
		let routers=[];
	    oldTable.routingTable=oldTable.routingTable.concat(receivedTable.routingTable);
	    for(let i=0; i < oldTable.routingTable.length; i++)
	    {
	    	let row=oldTable.routingTable[i];
	    	let node=row.node;
	    	let cost=row.cost
	    	let nextHop=row.nextHop;
	    	for(let j=i+1; j < oldTable.routingTable.length; j++)
	    	{
	    		if(oldTable.routingTable[j].getNode() == node)
	    		{
	    			if(oldTable.routingTable[j].getCost() < cost)
	    			{
						oldTable.routingTable[i].cost=oldTable.routingTable[j].cost;
						oldTable.routingTable[i].nextHop=oldTable.routingTable[j].nextHop;
	    			}
	    			oldTable.routingTable.splice(j, 1);
	    		}
	    	}
	    	routers.push(new TableRow(oldTable.routingTable[i].node, oldTable.routingTable[i].cost, oldTable.routingTable[i].nextHop));
	    }

	    let newTable = new RoutingTable(routers.length);
	    newTable.filled=routers.length;
	    newTable.routingTable=routers.slice();

	    return newTable;
	}

	/*
		distanceVector(oldTable, receivedTable)
		Definition: Uses Distance Vector Algorithm to create new table 
		@params 
			oldTable : RoutingTable
			receivedTable : RoutingTable
		@return  
			newTable : RoutingTable
	*/
	static distanceVectorAddRows(oldRow, receivedRow)
	{
		console.log(`receivedRow: ${receivedRow}`)
		console.log(`oldRow: ${oldRow}`)
		if(receivedRow.getNextHop() != oldRow.getNextHop())
		{
			if(receivedRow.getCost() < receivedRow.getCost())
				return receivedRow;
			else
				return oldRow;
		}
		return receivedRow;
	}



	/*
		parseToRoutingTable(string) 
		Definition: Parses routingtable from string
		@params 
			routingTableString : String
		@return  
			table : RoutingTable
	*/
	static parseToRoutingTable(routingTableString)
	{
		let table = JSON.parse(routingTableString);
	    let newTable=new RoutingTable(table.capacity);
	    for(let row of table.routingTable)
	    {
	    	newTable.addRouter(row.node, row.cost, row.nextHop);
	    }
	    return newTable;
	}
	/*
		function Dijkstra(Graph, node)
		Description: Dijkstra's algorithm of finding shortest paths
		@params
			Graph: Graph 
			source : Number (Node)
		@return
			{dist:dist.slice(), prev:prev.slice}


	*/
	static Dijkstra(graph, source)
	{
		let Q= [];
		let dist={};
		let prev={};

		for(let key in graph)
		{
			  dist[key] = Infinity;                  // Unknown distance from source to v
	          prev[key] = null;
	          Q.push(parseInt(key));
		}
		dist[source]=0;
		prev[source]=source;

		while(Q.length != 0)
		{
			let current;
			let min=Infinity;

			for(let key in dist) 
			{
				if(dist[key] < min && Q.indexOf(parseInt(key))!=-1)
				{
					min=dist[key];
					current=parseInt(key);
				}
			}
			Q.splice(Q.indexOf(current), 1);

			let connections=graph[current].connections.filter((val)=> {
			 	return (Q.indexOf(val.node)!=-1);
			});
			//console.log(connections);
			for(let vertex of connections)
			{	
				let length= dist[current] + vertex.cost;
				//console.log(`Length: ${length}	dist[current]${dist[current]}	dist[vertex.node]${dist[vertex.node]} vertex.cost${vertex.cost}`);
				if(length < dist[vertex.node])
				{
					dist[vertex.node]=length;
					prev[vertex.node]=current;
					//console.log(`Length: ${dist[vertex.node]}, Current: ${prev[vertex.node]}`);
				}
			}
		}
		return {dist:dist, prev:prev};
	}

	/*
		print()
		Definition: Pretty prints RoutingTable to console
	*/
	print()
	{
		console.log(`|	node	cost	nextHop	|`);
		//console.log(this);
		for(let i of this.routingTable)
		{
			console.log(`|	${i.node}	${i.cost}	${i.nextHop}	|`);
		}
		console.log(`\n\n`);
	}

	/*
		parseToRoutingTable(string) 
		Definition: Parses RoutingTable to string
		@return  
			table : String
	*/
	toString()
	{
		return JSON.stringify(this);
	}
}

module.exports=RoutingTable;


