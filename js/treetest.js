//--------------------Initialize Treeview Object---------------------
function bindNextButton(){
	$("#nextTaskButton").on("click", function() {
		var modelBodyElement = '<p>Are you sure you want to submit the tree test?</p>';
		if (tasks.idx < tasks.list.length-1) {
			modelBodyElement = '<p>Are you sure you want to move to the next task?</p>';
		}

		const modalElement = $('#nextTaskModal');	
		modalElement.find('.modal-body').html(modelBodyElement);

		modalElement.modal('show');
	});
}

function bindEventsForModal(){
	$("#continueModalButton").on("click", function() {
		tasks.next();
		$('#nextTaskModal').modal('hide');
	});

	$("#giveUpModalButton").on("click", function() {
		tasks.giveup();
		$('#giveUpTaskModal').modal('hide');
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

function resetTree(){
	$('#tree').jstree().close_all();
	$('#tree').jstree().deselect_all(true);
	disableButton('#nextTaskButton');
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

function getNodePath(node){
	return $('#tree').jstree().get_path(node);
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
			window.dispatchEvent(new CustomEvent('treetestcompleted'));
			$('#submitForm').click();
		}
		if (this.idx == this.list.length-1){
			$('#nextTaskButton').html('Finish')
		}
	},
	giveup:function() {
		this.answers[this.idx] = ['n/a']
		window.dispatchEvent(new CustomEvent('giveup'));

		this.next();
	},
	set:function(number){
		this.idx = number;
		$('#taskDesc').html(this.list[number]);
		$('#taskNum').html("Task "+(number+1)+" of "+this.list.length);

		// Resetting the tree between tasks results in all open nodes closing, but
		// we don't want to register these as close node events, because they aren't
		// meaningfully user actions. So we pause listening for close node events
		const { emitCloseNodeEvent } = socket;
		socket.emitCloseNodeEvent = () => {};

		resetTree();

		// Start listening for close node events again
		socket.emitCloseNodeEvent = emitCloseNodeEvent;

		window.dispatchEvent(new CustomEvent('taskchanged',));
	},
}

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
		this._emitEvent({}, 'page_load');
	},

	emitSelectNodeEvent: function(node) {
		this._emitNodeActionEvent(node, 'select_node');
	},

	emitOpenNodeEvent: function(node) {
		this._emitNodeActionEvent(node, 'open_node');
	},

	emitCloseNodeEvent: function(node) {
		this._emitNodeActionEvent(node, 'close_node');
	},

	emitTaskChangedEvent: function() {
		this._emitEvent({}, 'task_changed');
	},

	emitGiveUpEvent: function() {
		this._emitEvent({}, 'give_up');
	},	

	emitTreeTestCompletedEvent: function() {
		this._emitEvent({}, 'tree_test_completed');
	},

	emitWindowVisibilityChangedEvent: function(newVisibilityState) {
		//https://html.spec.whatwg.org/multipage/interaction.html#visibility-state
		const isVisible = newVisibilityState === 'visible';

		const data = { visible: isVisible };
		this._emitEvent(data, 'window_visibility_changed');
	},

	_emitNodeActionEvent: function(node, eventType) {
		const data = {
			taskIndex: tasks.idx + 1,
			node: getNodePath(node),
		};
		this._emitEvent(data, eventType);
	},

	_emitEvent: function(data, eventType) {
		const json = JSON.stringify({
			_id: generateUUID(),
			type: eventType,
			responseId: document.getElementById('resid').value,
			isoTimestampSent: new Date().toISOString(),
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
	bindEventsForModal();

	socket.connect();
	socket.emitPageLoadEvent();
}

function bindEvents() {	
	bindOnSelectNode();
	bindOnDeselectNode();
	bindEmitOnOpenNode();
	bindEmitOnCloseNode();
	bindEmitOnTaskChanged();
	bindEmitOnGiveUp();
	bindEmitOnTreeTestCompletion();
	bindEmitOnWindowVisibilityChanged();
}

function bindOnSelectNode() {
	// Fires when the user selects a node (by clicking on it)
	$('#tree').on('select_node.jstree', function (_, { node }) {
		tasks.answers[tasks.idx] = getNodePath(node);
		enableButton('#nextTaskButton');

		socket.emitSelectNodeEvent(node);
	});
}

function bindOnDeselectNode() {
	// Fires when the user de-selects a node (by clicking on a selected node)
	$('#tree').on("deselect_node.jstree", function (_, _) {
		disableButton('#nextTaskButton');
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
	window.addEventListener('taskchanged', () => socket.emitTaskChangedEvent());
}

function bindEmitOnGiveUp() {
	window.addEventListener('giveup', () => socket.emitGiveUpEvent());
}


function bindEmitOnTreeTestCompletion() {
	window.addEventListener('treetestcompleted', () => socket.emitTreeTestCompletedEvent());
}

function bindEmitOnWindowVisibilityChanged() {
	document.addEventListener('visibilitychange', () => {
		socket.emitWindowVisibilityChangedEvent(document.visibilityState);
	});
}
