var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var Event = mongoose.model('Event')
var resp = require('./response_server');
var logger = require('./logger.js');
//https://github.com/vkarpov15/mongo-sanitize
const sanitize = require('mongo-sanitize'); //helps with MongoDB injection attacks

function renderPages(study,responseID,responseObj){
    switch(study.type) {
        case 'sus':
            responseObj.render('sus/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'nps':
            responseObj.render('nps/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'cardsort':
            responseObj.render('cardsort/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'treetest':
            responseObj.render('treetest/view.ejs',{singleStudy: study, response: responseID});
            break;
        case 'productreactioncards':
            responseObj.render('productreactioncards/view.ejs',{singleStudy: study, response: responseID});
            break;
        default:
            logger.error('study_server.js: renderPages function - default switch case');
            res.redirect('/study404');
            break;
    }
}

module.exports = {
    home: function (req, res, next) {
        Study.find({ownerID: req.user._id}, function (err, studies) {
            if (err) {
                res.status(504);
                logger.error("study_server.js: home section error:", err);
                res.end(err);
            } else {
                res.render("studies.ejs", {studies: studies, email: req.user.email, admin: req.session.admin});
            }
        });
    },
    homenew: function (req, res, next) {
        Study.find({ownerID: req.user._id}, function (err, studies) {
            if (err) {
                res.status(504);
                logger.error("study_server.js: homenew section error:", err);
                res.end(err);
            } else {
                res.render("studies.ejs", {new: true,studies: studies, email: req.user.email, admin: req.session.admin});
            }
        });
    },
    copy: function (req, res, next) {
        Study.findOne({_id: req.params.id}, function (err, study) {
            if (err) {
                res.status(504);
                logger.error("study_server.js: Error copying study:", err);
                res.end(err);
            } else {
                var newStudy = new Study({
                    title: "Copy of "+study.title,
                    dateCreated: new Date(Date.now()),
                    type: study.type,
                    data: study.data,
                    status: study.status,
                    ownerID: study.ownerID,
                    private: study.private,
                });
                newStudy.save();
                res.redirect('/studies');
            }
        });
    },
    view: function (req, res, next) {
        Study.findOne({_id: req.params.id}, function (err, study) {
            if (err) {
                res.status(504);
                logger.error("study_server.js: Error viewing study:", err);
                res.end(err);
            } else if (study) {
				if (study.status == "open") {
				   if (study.private){
                        var con2 = (study.incompleteResponses.indexOf(req.params.resid) != -1);
                        if (req.params.resid && con2){
							renderPages(study,req.params.resid,res)
						} else {
							logger.error("study_server.js: Error viewing study, 404.");
							res.redirect('/msg/study404');
						}
					} else {
                        //if a response id was not passed, create a response and render page
                        if (req.params.resid == null) {
                            var response = resp.createResponse(req.params.id,"Anonymous");
                            study.incompleteResponses.push(response._id);
                            study.save();
                            renderPages(study,response._id,res)
                        } else {
                            //if response id was sent - send error page
                            logger.error("study_server.js: Error viewing study, 404.");
                            res.redirect('/msg/study404');
                        }
					}
				} else {
					res.redirect('/msg/notactive');
				}
            } else {
                res.redirect('/msg/study404');
            }
        });
    },
    preview: function (req, res, next) {
        Study.findOne({_id: req.params.id}, function (err, study) {
            if (err) {
                res.status(504);
                logger.error("study_server.js: Error previewing study:", err);
                res.end(err);
            } else {
                renderPages(study,"preview",res)
            }
        });
    },
    delete: function(req, res, next) {
        Study.findOne({ _id: req.params.id, ownerID: req.user._id}, function(err, study) {
            if (err) {
                res.status(504);
                logger.error("study_server.js: Error, cannot find study to delete:", err);
                res.end();
            } else {
                Response.find({ studyID: req.params.id}, function(err,responses) {
                    if (err) {
                        res.status(504);
                        logger.error("response_server.js: Cannot find study responses to delete:", err);
                        res.end();
                    } else {
                        for (var i = 0; i < responses.length; i++) {
                             Event.find({ responseId: responses[i]._id}, function(err,events)
                             {
                                if (err) {
                                    res.status(504);
                                    logger.error("response_server.js: Cannot find study events to delete:", err);
                                    res.end();
                                }
                                else {
                                    for (var i = 0; i < events.length; i++) {
                                        events[i].deleteOne(function(err){
                                        if(err) {
                                            logger.error("response_server.js: Error trying to delete event:", err);
                                            res.status(500).send(err);
                                            }
                                        })
                                    }
                                } 
                            });                       
                            
                            responses[i].deleteOne(function(err){
                                if(err) {
                                    logger.error("response_server.js: Error trying to delete response:", err);
                                    res.status(500).send(err);
                                }
                            });
                        }
                    }
                });
                
                Event.find({ responseId: "preview"}, function(err,events)
                {
                    if (err) {
                        res.status(504);
                        logger.error("response_server.js: Cannot find study events to delete:", err);
                        res.end();
                    }
                    else {
                        for (var i = 0; i < events.length; i++) {
                        events[i].deleteOne(function(err){
                        if(err) {
                            logger.error("response_server.js: Error trying to delete event:", err);
                            res.status(500).send(err);
                            }
                        })
                    }
                    } 
                });            

                study.deleteOne(function(err){
                    if(err) {
                        logger.error("study_server.js: Error trying to delete study:", err);
                        res.status(500).send(err);
                    }
                });
                res.send(true);
                res.end();
            }
        });
    },
    submitResult: function (req, res, next) {
        var clean_id = sanitize(req.body.id);
        var clean_resid = sanitize(req.body.resid);

        //if the study is being previewed, don't record the response
        if (req.body.resid === "preview") {
            res.redirect('/studies');
            res.end();
            return;
        }

        function updateStudy() {
            Study.findOneAndUpdate(
                { "_id": clean_id },
                {
                    "$pull": { "incompleteResponses": mongoose.Types.ObjectId(clean_resid) },
                    "$push": { "completeResponses": clean_resid }
                },
                function (err) {
                    if (err) {
                        logger.error("study_server.js: Error has occured: ", err);
                        res.status(500).send(err);
                        res.end();
                    } else {
                        logger.info("study_server.js: Response saved successfully to study.");
                        res.redirect('/msg/thanks');
                        res.end();
                    } 
                }
            );
    }
    
    function saveResponse() {
        return new Promise((resolve, reject) => {
            Response.findOne({ _id: clean_resid }).then(response => {
                if (!response) {
                    logger.error("study_server.js: Response not found");
                    res.status(404).send("Response not found");
                    res.end();
                    reject(false);
                } else if (response.complete) {
                    logger.error("study_server.js: The response has already been completed");
                    res.redirect('/msg/nomore');
                    res.end();
                    reject(false);
                } else {
                    Response.findOneAndUpdate(
                        { "_id": clean_resid },
                        {
                            "$set": {
                                "complete": true,
                                "date": new Date(Date.now()),
                                "data": JSON.parse(req.body.result)
                            }
                        }
                    ).then(() => {
                        resolve(true);
                    });
                }
            })
        })
    }
    
    let promise = saveResponse();
    
    promise.then((value) => {
        if (value) {
           updateStudy();
        }
    });

    },
    deleteAllIncompleteResponses: function(req, res, next) {
        Study.findOne({ _id: req.params.id, ownerID: req.user._id}, function(err, study) {
            if (err) {
                req.status(504);
                logger.error("study_server.js: Cannot find study to clear responses:", err);
                req.end();
            } else {
                Response.find({complete: false, studyID: study._id}, function(err,responses) {
                    if (err) {
                        req.status(504);
                        logger.error("response_server.js: Cannot find study responses to delete:", error);
                        req.end();
                    } else {
                        for (var i = 0; i < responses.length; i++) {
                            responses[i].remove();
                        }
                    }
                });

                study.incompleteResponses = [];
                study.save();
                res.send(true);
                res.end();
            }
        });
    },
    deleteAllCompleteResponses: function(req, res, next) {
        Study.findOne({ _id: req.params.id, ownerID: req.user._id}, function(err, study) {
            if (err) {
                req.status(504);
                logger.error("study_server.js: Cannot find study to clear responses:", err);
                req.end();
            } else {
                Response.find({complete: true, studyID: study._id}, function(err,responses) {
                    if (err) {
                        req.status(504);
                        logger.error("response_server.js: Cannot find study responses to delete:", error);
                        req.end();
                    } else {
                        for (var i = 0; i < responses.length; i++) {
                            responses[i].remove();
                        }
                    }
                });
                study.completeResponses = [];
                study.save();
                res.redirect('/studies');
                res.end();
            }
        });
    },
}
