
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
		bindEvents();
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
		tasks.answers[tasks.idx] = setHistory(data.node);
		enableButton('#nextTaskButton');
	});
	$('#tree').on("deselect_node.jstree", function (e, data) {
	  disableButton('#nextTaskButton');
	});
}

function resetTree(){
	const { emitCloseNodeEvent } = socket;
	socket.emitCloseNodeEvent = () => {};
	$('#tree').jstree('close_all');
	disableButton('#nextTaskButton');
	socket.emitCloseNodeEvent = emitCloseNodeEvent;
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
	answers: [], //full path of nodeIds when answer is selected
	idx: 0,
	add: function (taskStr) {
		this.list.push(taskStr);
		this.answers.push(false);
	},
	next:function() {
		if (!(this.idx == this.list.length-1)){
			this.idx = this.idx + 1;
			this.set(this.idx);
			updateProgressBar();
		} else {
			$('#hiddenResults').val(JSON.stringify(tasks.answers));
			this.onSubmit.forEach(callback => callback(tasks.answers));
			$('#submitForm').click();
		}
		if (this.idx == this.list.length-1){
			$('#nextTaskButton').html('Finish')
		}

	},
	prev:function() {
	    if (this.idx === 0) {
    		this.idx = this.list.length;
	    }
	    this.idx = this.idx - 1;
	    this.set(this.idx);
	},
	set:function(number){
		this.idx = number;
		$('#taskDesc').html(this.list[number]);
		$('#taskNum').html("Task "+(number+1)+" of "+this.list.length);
		resetTree();
		if(this.answers[this.idx].length > 0){
			//need to pass a copy of node path to expandToNode (or else it alters tasks.answers)
			var copyOfHistory = $.extend(true, [], this.answers[this.idx]);
			expandToNode(copyOfHistory);
		}
		this.onSet.forEach(callback => callback(number));
	},
	onSet: [],
	onSubmit: [],
}

const responseId = document.baseURI.split('/').pop();

var socket = {
	_socket: null,

	connect: function() {
		this._socket = io();
		this._socket.on('connect', () => {
			console.debug('Socket connected');
		});
		this._socket.on('disconnect', (reason) => {
			console.debug(`Socket disconnected. Reason: ${reason}`);
		});
	},

	emitPageLoadEvent: function() {
		this._emitEvent({}, 'page load');
	},

	emitActivateNodeEvent: function(node) {
		const data = {
			node: $('#tree').jstree().get_path(node),
			current_task_index: tasks.idx,
		};
		this._emitEvent(data, 'activate node');
	},

	emitOpenNodeEvent: function(node) {
		const data = {
			node: $('#tree').jstree().get_path(node),
			current_task_index: tasks.idx,
		};
		this._emitEvent(data, 'open node');
	},

	emitCloseNodeEvent: function(node) {
		const data = {
			node: $('#tree').jstree().get_path(node),
			current_task_index: tasks.idx,
		};
		this._emitEvent(data, 'close node');
	},

	emitTaskChangedEvent: function(newTaskIndex) {
		this._emitEvent({ new_task_index: newTaskIndex }, 'task changed');
	},

	emitSubmitResponseEvent: function(answers) {
		this._emitEvent({ answers }, 'submit response');
	},

	emitWindowVisibilityChangedEvent: function(newVisibilityState) {
		const data = { new_visibility_state: newVisibilityState };
		this._emitEvent(data, 'window visibility changed');
	},

	_emitEvent: function(data, eventType) {
		const json = JSON.stringify({
			id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			response_id: responseId,
			...data,
		});
		const emitUntilAcknowledged = () => this._socket
			.timeout(2000)
			.emit(eventType, json, (err) => err && emitUntilAcknowledged());
		emitUntilAcknowledged();
	},
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

	socket.connect();
	socket.emitPageLoadEvent();
}

function bindEvents() {
	bindEmitOnActivateNode();
	bindEmitOnOpenNode();
	bindEmitOnCloseNode();
	bindEmitOnTaskChanged();
	bindEmitOnSubmitResponse();
	bindEmitOnWindowVisibilityChanged();
}

function bindEmitOnActivateNode() {
	// Fires when the user activates a node (by clicking on it)
	$('#tree').on('activate_node.jstree', function (_, { node }) {
		socket.emitActivateNodeEvent(node);
	});
}

function bindEmitOnOpenNode() {
	// Fires when the user opens a parent node to expose its children, either by
	// activating the parent node itself, or by activating the button next to it
	$('#tree').on('open_node.jstree', function (_, { node }) {
		socket.emitOpenNodeEvent(node);
	});
}

function bindEmitOnCloseNode() {
	// Fires when the user close a parent node to hideits children, either by
	// activating the parent node itself, or by activating the button next to it
	$('#tree').on('close_node.jstree', function (_, { node }) {
		socket.emitCloseNodeEvent(node);
	});
}

function bindEmitOnTaskChanged() {
	tasks.onSet.push(number => socket.emitTaskChangedEvent(number));
}

function bindEmitOnSubmitResponse() {
	tasks.onSubmit.push(answers => socket.emitSubmitResponseEvent(answers));
}

function bindEmitOnWindowVisibilityChanged() {
	document.addEventListener('visibilitychange', () => {
		socket.emitWindowVisibilityChangedEvent(document.visibilityState);
	});
}
