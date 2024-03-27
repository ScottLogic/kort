
//--------------------Initialize Treeview Object---------------------
function bindNextButton(){
	$("#nextTaskButton" ).click(function() {
		if (!$('#nextTaskButton').hasClass('disabled')){
			tasks.next();
		}
	});
}
function bindCloseSiblingsOnOpen(){
	$('#tree').on("before_open.jstree", function (e, data) {
		var siblings = $("#tree").jstree("get_node", data.node.parent).children;
		siblings.forEach(function(element){
			if(element != data.node.id) $("#tree").jstree("close_all", element);
		})
	});
}
function initializeTreeViewObject(treeStructure){
	$('#tree').jstree({
		"core" : {
			"animation" : 0,
			"check_callback" : true,
			"themes" : { "stripes" : true, "variant": "large" },
			"data": JSON.parse(treeStructure)
		},
		"plugins" : [
	    "wholerow"
	  ]
	});

	$("#tree").on('ready.jstree', function() {
		$("#tree").jstree('close_all');
	});
}
function enableButton(buttonID){
	$(buttonID).removeClass('disabled');
	$(buttonID).addClass('btn-amber');
}
function disableButton(buttonID){
	$(buttonID).removeClass('btn-amber');
	$(buttonID).addClass('disabled');
}
function bindNodeSelection(){
	//When node is selected (clicked), write full path of node ids
	$('#tree').on("select_node.jstree", function (e, data) {
	  tasks.results[tasks.idx].answer = setHistory(data.node)
	  	enableButton('#nextTaskButton');
	});
	$('#tree').on("deselect_node.jstree", function (e, data) {
	  disableButton('#nextTaskButton');
	});
}
function resetTree(){
	$('#tree').jstree('close_all');
	disableButton('#nextTaskButton');
}
function setHistory(node){
	var path = $('#tree').jstree('get_path',node);
	return path;
}
function singleClickExpand(parents) {
	$('#tree').on("changed.jstree", function (e, data) {
		$("#tree").jstree("toggle_node", data.selected);
		if (parents) {
			var node = $('#tree').jstree(true).get_node(data.selected);
			if(node.children && node.children.length > 0){
				$("#tree").jstree("deselect_node", data.selected);
			}
		}
	});
}
function updateProgressBar(){
	var status = ((tasks.idx/tasks.list.length)*100)+'%';
	$('#progressbar').css("width", status);
	$('#progressbar').html('');
}
//--------------------------Task JS Object---------------------------
//tasks js object to store task related functions and data
var tasks = {
	list: [], //task descriptions
	results: [], // objects containing answer and time spent in milliseconds
	timerStart: null,
	idx: 0,
	add: function (taskStr) {
		this.list.push(taskStr);
		this.results.push({ answer: false, timeSpent: 0 });
	},
	next:function() {
		if (!(this.idx == this.list.length-1)){
			this.recordTimeSpent();
			this.idx = this.idx + 1;
			this.set(this.idx);
			updateProgressBar();
			this.resetTimer();
		} else {
			this.recordTimeSpent();
			$('#hiddenResults').val(JSON.stringify(this.results))
			$('#submitForm').click();
		}
		if (this.idx == this.list.length-1){
			$('#nextTaskButton').html('Finish')
		}

	},
	prev:function() {
		this.recordTimeSpent();
		if (this.idx === 0) {
			this.idx = this.list.length;
		}
		this.idx = this.idx - 1;
		this.set(this.idx);
		this.resetTimer();
	},
	set:function(number){
		this.idx = number;
		$('#taskDesc').html(this.list[number]);
		$('#taskNum').html("Task "+(number+1)+" of "+this.list.length);
		resetTree();
		if(this.results[this.idx].answer.length > 0){
			//need to pass a copy of node path to expandToNode (or else it alters tasks.results[].answer)
			var copyOfHistory = $.extend(true, [], this.results[this.idx].answer);
			expandToNode(copyOfHistory);
		}
	},
	resetTimer:function(){
		this.timerStart = Date.now();
	},
	recordTimeSpent:function(){
		const timerEnd = Date.now();
		const timerStart = this.timerStart;

		// Otherwise, calling this function twice in a row will double the recorded time spent
		this.resetTimer();

		// Total time will be added up, since the user could have started on this
		// task, moved to the next one, then come back to this one
		this.results[this.idx].timeSpent += timerEnd - timerStart;
	}
}
//---------------------Task List Initialization----------------------
function setup(input_tasks,input_tree,input_selectableParents,input_closeSiblings){
	var tasksDB = input_tasks.split(";").map(function(item) {
		  return item.trim();
	});
	for (var i = 0; i < tasksDB.length; i++) {
		if (tasksDB[i] != ''){
			tasks.add(tasksDB[i]);
		}
	}
	//create treeview structure from database information
	initializeTreeViewObject(input_tree);
	bindNodeSelection();
	if(input_closeSiblings){
		bindCloseSiblingsOnOpen();
	}
	//this parameter is whether or not parents can be selected when clicked
	singleClickExpand(!input_selectableParents);
	$('#hiddenTree').remove();
	$('#treedata').remove();
	tasks.set(0);
	disableButton('#nextTaskButton');
	bindNextButton();
	tasks.resetTimer();
}
