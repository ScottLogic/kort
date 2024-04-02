function init_jsTree(treedata){
	$('#tree').jstree({
	  "core" : {
	    "animation" : 0,
	    "check_callback" : true,
	    "themes" : { "stripes" : true, "variant": "large" },
	    'data' : treedata
	  },
	  "plugins" : [
	    "contextmenu", "dnd", "state", "wholerow"
	  ]
	});
	bindFunctions();
}

function bindFunctions(){
	$("#submitBtn").click(function() {
	  	var treedata = JSON.stringify($('#tree').jstree(true).get_json('#', {flat:true}));
    	$('#treedata').val(treedata);
    	$('#form').submit()
	});

  	$("#createNewRootNode").click(function() {
  		$('#tree').jstree().create_node("#", "New Root Item", "last");
	});

	//expand parent node when child is created
  	$("#createNewNode").click(function() {
  		var selectedParent = $("#tree").jstree("get_selected");
  		$('#tree').jstree().create_node(selectedParent, "New Item", "last");
  		$("#tree").jstree("open_node", selectedParent);
	});

  	$("#expandAll").click(function() {
  		$("#tree").jstree('open_all');
	});

	$('#tree').on("changed.jstree", function (e, data) {
		$("#tree").jstree("toggle_node", data.selected);
	});

	$("#newTask").on("click", function() {
		var newRow = document.getElementById('newTask').querySelector('template').content.cloneNode(true);
		$("#tasks").children("tbody").append($(newRow));
	});

	$("#tasks").on("click", ".deleteTaskBtn", function () {
        $(this).closest("tr").remove();   
    });

	$("#tasks").on("click", ".addAnswerBtn", function () {
		var node = $("#tree").jstree("get_selected");
		var nodePath = $('#tree').jstree('get_path', node)

		expectedAnswersElement=$('.expectedAnswers');
		expectedAnswers = expectedAnswersElement.val() + nodePath + ';';
		expectedAnswersElement.val(expectedAnswers);

		var answerElement = document.getElementById('newAnswer').querySelector('template').content.cloneNode(true);
		answerElement.querySelector('p').textContent=nodePath;
		$(this).closest('tr').find('.list-group').append($(answerElement));		
    });

	$("#tasks").on("click", ".deleteAnswerBtn", function () {
		const expectedAnswerContainer = $(this).closest("div");
		const expectedAnswerText = expectedAnswerContainer.find('p').first();
		
		const expectedAnswersElement=$('input[name=expectedAnswers]');
		const expectedAnswers = expectedAnswersElement.val().replace(expectedAnswerText.text() + ';', "");
		expectedAnswersElement.val(expectedAnswers);
		
		expectedAnswerContainer.remove();
    });
}

$(function() {
	var treeData = $('#studydatatree').data("value");
	init_jsTree(treeData);
})
