require('mongoose').model('Study');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var logger = require('./logger.js');
//https://github.com/vkarpov15/mongo-sanitize
const sanitize = require('mongo-sanitize'); //helps with MongoDB injection attacks

function convertResponseArrayToString(arr){
    var ret_str = "";
    for (var i = 0; i < arr.length; i++) {
        ret_str+="/"+arr[i].toString()
    }
    return ret_str
}

function countUniqueInstances(taskArray){
    var taskSets = []
    var taskCounts = []
    for (var task = 0; task < taskArray.length; task++) {
        var taskSet = {}
        var singleTask = taskArray[task]
        for (var response = 0; response < singleTask.length; response++) {
            taskSet[singleTask[response]] = (taskSet[singleTask[response]] || 0) + 1;
        }
        var taskSum = []
        var taskCount = []
        Object.keys(taskSet).forEach(function(key) {
            taskSum.push(key);
            taskCount.push(taskSet[key]);
        });
        taskSets.push(taskSum);
        taskCounts.push(taskCount);
    }
    return [taskSets,taskCounts]
}

function gatherResponses(tasks, responses){
    var ret_responses = []
    for (var i = 0; i < tasks.length; i++) {
        ret_responses.push([]);
    }

    for (var i = 0; i < responses.length; i++) {
        var response = responses[i]
        for (var j = 0; j < response.data.length; j++) {
            ret_responses[j].push(convertResponseArrayToString(response.data[j]));
        }
    }
    return countUniqueInstances(ret_responses)
}

module.exports = {
    create: function (req, res) {
        var newStudy = new Study({
            title: "Default Tree Test Title",
            dateCreated: new Date(Date.now()),
            type: "treetest",
            data: {
                showSiblings: true,
                selectableParents: true,
                tasks: [
                    {
                        question: 'Where is the Apples?',
                        expectedAnswers:[["Fruits", "Apple"]]
                    },
                    {
                        question: 'Where is the Bacon?',
                        expectedAnswers:[["Meats", "Bacon"]]
                    }
                ],
                tree: JSON.stringify([{text:'Fruits',children:['Apple','Banana']},{text:'Meats',children:['Bacon','Turkey']}])
            },
            status: 'closed',
            ownerID: req.user._id,
            private: false,
        });
        newStudy.save(function (err) {
            if (err) {
                logger.error('treetest_server.js: Error creating new treetest:', err);
                res.status(504);
                res.end(err);
            } else {
                logger.info('treetest_server.js: Created new treetest via POST successfully.');
                res.redirect('/studies/new');
                res.end();
            }
        });
    },
    edit: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                logger.error("treetest_server.js: Error in edit treetest:", err);
                res.end(err);
            } else {
                 Response.find({_id: {$in: study.incompleteResponses}}, function (err, incompleteResponses) {
                    if (err) {
                        res.status(504);
                        logger.error("cardsort_server.js: Error in edit cardsort:", err);
                        res.end(err);
                    } else {
        				var fullUrl = req.protocol + '://' + req.get('host');
                        res.render('treetest/edit.ejs', {singleStudy: study,
                                                        incompleteResponses: incompleteResponses,
                                                        email: req.user.email,
                                                        admin: req.session.admin,
                                                        url: fullUrl});
                    }
                });
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                logger.error("treetest_server.js: Error getting study to see results:", err);
                res.end(err);
            } else {
                Response.find({_id: {$in: study.completeResponses}}, function (err, completeResponses) {
                    if (err) {
                        res.status(504);
                        logger.error("cardsort_server.js: Error in edit cardsort:", err);
                        res.end(err);
                    } else {
                        var responses = gatherResponses(study.data.tasks, completeResponses)
                        res.render('treetest/results.ejs',{study: study,
                                                            completeResponses:completeResponses,
                                                            email: req.user.email,
                                                            admin: req.session.admin,
                                                            taskSet: responses[0],
                                                            taskCount: responses[1]
                                                        });
                    }
                });

            }
        });
    },
    update: function (req, res, next) {
        //Updates the tasks and their expected answers for the respective tree test 
        var tasks = [];
        for (var i = 0; i < req.body.question.length; i++) {
            if (req.body.question[i].trim() == '') {
                //Do not save the question and related answers if the question is empty or a whitespace
                continue;
            } 

            //Adds a new element to tasks array. Every element contains a string field for question and an array field for storing expected answers
            tasks.push(
                {
                    question: req.body.question[i],
                    expectedAnswers: JSON.parse(req.body.expectedAnswers[i])
                }
            );           
        }

        var clean_id = sanitize(req.body.id);
        var clean_ownerid = sanitize(req.user._id);

        //Uses Mongoose Model.findOne() api function to get study document from the database with matching study id. 
        //It then updates the retrieved study document with the captured form data and saves it back.
        Study.findOne({_id: clean_id, ownerID: clean_ownerid},
            function (err, study) {
            if (err) {
                res.status(504);
                logger.error('treetest_server.js: error updating treetest:', err);
                res.end(err);
            }
            else {
				study.title = req.body.title;
                study.data = {
                    tasks: tasks,
                    tree: req.body.treedata,
                    selectableParents: req.body.selectableParents,
                    showSiblings: req.body.showSiblings
                };
				study.status = req.body.status;
                study.private = req.body.private;
				study.save();
                res.redirect('/studies');
                res.end();
            }
        });
    },
}
