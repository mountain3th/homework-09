/*		Global Variables
 * ------------------------------------*/
var array = [];
var length;
var moves = [];
var currMove=-1;
var timer = null;

/*		DOM operations
 * --------------------------------------*/
// Initialize the sums
function init(){
	reset("index");
	reset("sums");
	for(var i=0; i<length; i++){
		pushNode("index","th", i);
		pushNode("sums","td", array[i]);
	}
}

// Add the node to the parentNode
function pushNode(table, type, num){
	var node = document.createTextNode(num);
	var insert = (type=="td")?document.createElement("td"):document.createElement("th");
	insert.appendChild(node);
	var tr = $(table).children(0).children(0);
	tr.appendChild(insert);
}

// Add comment to the parentNode
function addComment(table, comment){
	var node = document.createTextNode(comment);
	var insert = document.createElement("td");
	insert.appendChild(node);
	insert.id = "comment";
	var tr = $(table).children(0).children(0);
	tr.appendChild(insert);
}

// Remove comment to show another comment
function removeComment(){
	var node = $("sums").firstChild.nextSibling.firstChild.lastChild;
	node.parentNode.removeChild(node);
}

// Reset the elements in a table
function reset(table){
	while(td = $(table).children(0).children(0).children(1)){
		td.parentNode.removeChild(td);
	}
}

// Clear the backgroundColor in the sums table
function clear(){
	var i=1;
		while(td = $("sums").children(0).children(0).children(i)){
			td.style.backgroundColor = "white";
			i++;
		}
}

/*		Algorithms
 * -------------------------------------*/
// Store the every condition
function condition(maxStart, maxEnd, sumStart, sumEnd, maxChanged, comment){
	this.maxStart = maxStart;
	this.maxEnd = maxEnd;
	this.sumStart = sumStart;
	this.sumEnd = sumEnd;
	this.maxChanged = maxChanged;
	this.comment = comment;
}



// The algorithm to calculate the max
function max1(start){
	var max = -10000; 
	var sum = 0;
	var i=start, count=0;
	var maxStart=0, maxEnd=-1, sumStart=0, sumEnd=-1, maxChanged=false, comment;
	while(count < length){
		comment = "";
		if(i == length)
			i = 0;
		if((sum+array[i]) >= array[i]){
			sum = sum+array[i];
			sumEnd++;
			comment = "收入囊中";
		}
		else{
			sum = array[i];
			sumStart=i;
			sumEnd=i;
			comment = "另起炉灶";
		}
		moves.push(new condition(maxStart, maxEnd, sumStart, sumEnd, maxChanged, comment));
		maxChanged = true;
		if(sum >= max){
			max = sum;
			maxStart = sumStart;
			maxEnd = sumEnd;
			maxChanged = false;
			comment = "更新换面";
		}
		else{
			comment = "坐定江山";
		}
		// Genenerate the moves
		moves.push(new condition(maxStart, maxEnd, sumStart, sumEnd, maxChanged, comment));
		i++;
		count++;
		maxChanged = false;
	}
	return max;
}

/*		Helpers
 * -------------------------------------*/
// Fast way to find the dom
function $(id){
	return document.getElementById(id);
}


/*		EventHandlers
 * ------------------------------------*/
// EventHandler when the input is changed
function inputChange(){
	if($("input").value.length != 0){
		array = $("input").value.split(" ");	
		length = array.length;
		for(var i=0; i<length; i++){
			array[i] = parseInt(array[i]);
		}	
		$("result").innerHTML = "最终结果: "+max1(0);
		init();
	}
}

// Show the procedure
function play(move){
	if(currMove%2 !=0)
		removeComment();
	clear();
	for(var j=move.sumStart; j<=move.sumEnd; j++){
		$("sums").children(0).children(0).children(1+j).style.backgroundColor="lightGray";
	}
	reset("maxes");
	var i=move.maxStart;
	while(i<=move.maxEnd){
		pushNode("maxes", "td", array[i]);
		i++;
	}
	if(currMove%2 == 0){
		addComment("sums", move.comment);
	}
	else{
		addComment("maxes", move.comment);
	}
}

// Play the next move
function next(){
	clearTimeout(timer);
	currMove++;
	if(currMove == length*2){
		currMove = 0;	
	}
	play(moves[currMove]);
}

// Play the previous move
function previous(){
	clearTimeout(timer);
	if(currMove == 0){
		currMove = -1;
		clear();
		reset("maxes");
	}
	else if(currMove > 0){
	/*	if(currMove%2 != 0){
			if(currMove == 1)
				currMove = 0;
			else
				currMove -= 1;
		}
		else
			currMove -= 2;
		removeComment();
		play(moves[currMove+1]);
	*/
		currMove--;
		play(moves[currMove]);
	}	
}

// Play the procedure automatically
function auto(){
	next();
	timer = window.setTimeout("auto()", 1000);
}

/*		Binders
 * -------------------------------------*/

$("input").onfocus = function(){$("input").value="";};
$("input").onblur = inputChange;
$("autoplay").onclick = auto;
$("next").onclick = next;
$("previous").onclick = previous;
