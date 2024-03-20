$(function() {
    var studyTasks = $('#studyTasks').data("value");
    var selectableParents = $('#selectableParents').data('value');
    var showSiblings = $('#showSiblings').data('value');
    var treeData = $("#treedata").val();
   
    setup(studyTasks,treeData,selectableParents,showSiblings);
})