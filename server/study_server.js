var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
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
        Study.findOne({ _id: req.params.id, ownerID: req.user._id}, function(err) {
            if (err) {
                req.status(504);
                logger.error("study_server.js: Error, cannot find study to delete:", err);
                req.end();
            } else {
                Response.find({ studyID: req.params.id}, function(err,responses) {
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
            }
        }).remove(function (err) {
            if (err) {
                logger.error("study_server.js: Error, cannot remove study:", err);
                res.end(err);
            } else {
                res.send(true);
                res.end();
            }
        });
    },
    submitResult: function (req, res, next) {
        var clean_id = sanitize(req.body.id);
        var max_retries = 3;

        //if the study is being previewed, don't record the response
        if (req.body.resid === "preview") {
            res.redirect('/studies');
            res.end();
        }

        // function to save complete response to study and remove from incomplete responses
        function saveStudy(study, responseID, retries){
            var respIdx = study.incompleteResponses.indexOf(responseID);
            study.completeResponses.push(study.incompleteResponses[respIdx]);
            study.incompleteResponses.splice(respIdx,1);
            study.save(function(err) {
                if (err) {
                    logger.error("study_server.js: Error saving response to study:", err);
                    if (retries < max_retries) {
                        logger.warn(`Retrying... (${retries + 1}/${max_retries})`);
                        handleAndSaveResults(retries + 1);
                    } else {
                        res.status(500).send(err);
                    }
                } else {
                    logger.info("study_server.js: Response saved successfully to study.");
                    res.redirect('/msg/thanks');
                    res.end();
                }
            });
        }

        function handleAndSaveResults(retries) {
            Study.findOne({_id: clean_id}, function (err, study) {
                if (err) {
                    res.status(504);
                    res.end(err)
                } else {
                    var clean_resid = sanitize(req.body.resid);
                    Response.findOne({_id: clean_resid}, function(err,response) {
                        if (err) {
                            req.status(504);
                            logger.error("response_server.js: Cannot find study responses to delete:", err);
                            req.end();
                        } else {
                            if (response.complete) {
                                // if the response is already complete and is not in the completeResponses array, add it to the array
                                if (!study.completeResponses.includes(clean_resid)) {
                                    saveStudy(study, clean_resid, retries);
                                } else {
                                    res.redirect('/msg/nomore');
                                    res.end();
                                }
                            } else {
                                Response.findOneAndUpdate({"_id": clean_resid},
                                    { "$set": { "complete": true,
                                                "date": new Date(Date.now()),
                                                "data": JSON.parse(req.body.result)}
                                            }).exec(function(err){
                                                if(err) {
                                                    console.log(err);
                                                    res.status(500).send(err);
                                                }
                                            });
                            saveStudy(study, clean_resid, retries);
                            }
                        }
                    });
                }
            });
        }
        handleAndSaveResults(1); 
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
