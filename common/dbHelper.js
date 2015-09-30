var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    models = require('./models');

var util = require('util');

for (var m in models) {
    console.log("m in models:" + m);
    mongoose.model(m, new Schema(models[m]));
};


/*****  注册用户   ***/
var _addUser = function (userInfo) {
    var userModel = _getModel('user');
    var newUsers = new userModel({
        name: userInfo.name,
        password: userInfo.password,
        state: false
    });

    console.log("_addUser over");
    newUsers.save(function(err, doc){
        if (err) {
            console.log("_addUser err:" + err);
        } else {
            console.log("_addUser success:" + doc);
        }
    } );
};

/*******   检测用户是否存在 ****/
var _findUser = function (userName) {
    var userModel = _getModel("user");
    userModel.findOne({name: userName}, 'name', function (err, doc) {
        if (err) {
            return false;
        }
        if (!doc) {
            console.log("_findUser : no user");
            return false;
        } else return true;
    });
    console.log("_findUser over");
};

/*****  修改用户state状态，即修改在先状态 ********/
var _updateState = function(userName, state) {
    var userModel = _getModel('user');
    userModel.update({name: userName }, {state: state}, function (err, raw) {
       if (err) {
           console.log("_updateState err");
           return;
       } else if(raw) {
           console.log("_updateState:" + state);
       }
    });
};

/**********    session Model 增加记录 *******/
var _addSessionId = function (sessionId, userName) {
    var sessionModel = _getModel('session');
    sessionModel.findOne({sessionId: sessionId}, function (err, doc) {
        if (err) {
            return false;
        } else if (!doc) {
            var newSession = new sessionModel({
                sessionId: sessionId,
                userName: userName
            });
            newSession.save(function(err, doc){
                if (err) {
                    console.log("_addSessionId err:" + err);
                } else {
                    console.log("_addSessionId success:" + doc);
                }
            });
            return true;
        } else
            return false;
    })
};

/**********    session Model 删除记录 *******/
var _removeSessionId = function (sessionId) {
    var sessionModel = _getModel('session');
    console.log(sessionId);

    sessionModel.remove({sessionId: sessionId}, function (err) {
        if (err) {
            return handleError(err);
        }
    });
};

/***********   session Model ******/
var _getUnameFromSessionId = function (sessionId) {
    var sessionModel = _getModel('session');
    sessionModel.findOne({sessionId: sessionId}, "sessionId userName", function (err, doc) {
        if (err) {
            return handleError(err);
            console.log("_getUnameFromSessionId:" + err);
        } else if (doc) {
            return doc.userName;
        } else {
            return false;
        }
    });
};

/*******************************    好友添加的代码    *************************************************/

/********  createFriend in userFriends Model ****/
function _createFriendRec (userName) {
    var friendsModel = _getModel('userFriends');
    friendsModel.findOne({userName: userName}, function (err, doc) {
        if(err) {
            console.log("create userFriends err" + err);
            return;
        }
        if(!doc) {
            var newFriends = new friendsModel({
                userName: userName,
                friends: []
            });
            newFriends.save(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("_createFriendRec" + doc);
                }
            });
        } else return;
    });

};

/*********  addFriends to Rec ****/
/*function _addFriends (userName) {
    var user = []; //数组用来保存所有的用户名
    var userModel = _getModel('user');
    userModel.find(function(err, doc) {
        if (err) {
            console.log("_addFriends err");
            return;
        } else {
            for(var id in doc) {
                var curName = doc[id].name;
                if(curName != userName){
                    user.push(curName);
                    _addFriend(userName, curName);
                    _addFriend(curName, userName);
                }
                console.log("get user:" + user);
            }
        }
    });
};*/

/**********  _add Friend ***/
function _addFriend (userName, friendsName) {
    var friendsModel = _getModel('userFriends');
    friendsModel.findOne({userName: userName}, function (err, doc) {
        if (err) {
            console.log("_addFriend err" + err);
            return;
        } else {
            for (var m in doc.friends) {
                if (doc.friends[m].name === friendsName)
                    return;         //一旦发现好友中已经有这个人，就退出，
            }
            var friend = {
                name: friendsName,
                state: false,
                Group: "default"
            };
            if(!doc || !doc.friends)
            {
                _createFriendRec(userName);
            }
            doc.friends.push(friend);
            doc.markModified('friends'); /*模型改变*/
            doc.save();
        }
    });
};

 /**** 增加一条好友添加的记录，并写入记录  一些初始状态 如result=2表示是初始状态，并没有进行任何回复****/
function _handleAddUserRec(subject, object) {
    var addUserModel = _getModel('addUser');
    addUserModel.find(function (err, doc) {
        if (err) {
            console.log("handleAddUser err:" + err);
            return;
        }
        if( ! doc ) {
            return;
        } else {
            var FLAG_add = false;
            var FLAG_update = false;
            for( var m in doc) {
                if (doc[m].subject === subject && doc[m].object === object) {
                    FLAG_add = true;
                    if(doc[m].result === 0) { //如果这个好友的申请请求 是被object拒绝的，那么就可以更新该条记录的状态为初始状态，表示再次请求添加
                        FLAG_update = true;
                    }
                }
            }
            if(FLAG_add && FLAG_update) {
                _initAddUserRec(subject, object);
            }

            if (!FLAG_add && !FLAG_update) { //不存在这个好友请求，那么就在数据库创建记录
                _createAddUserRec(subject, object);
            }
            return;
        }
    });
};

// 创建add user record
function _createAddUserRec(subject, object) {
    var addUserModel = _getModel('addUser');
    var newAddUser = new addUserModel({
        date: new Date,
        subject: subject,
        object: object,
        result: 2,
        refuse: false
    });
    newAddUser.save(function (err, doc) {
        if(err) {
            console.log("newAddUser err:" + err);
            return;
        }
        console.log("newAddUser.save:" + doc);
    });
}

// 初始化AddUserRec为初始状态
function _initAddUserRec(subject, object) {
    var addUserModel = _getModel('addUser');
    addUserModel.find(function (err, doc) {
        if (err) {
            console.log("initAddUser err:" + err);
            return;
        }
        if( ! doc ) {
            return;
        } else {
            for( var m in doc) {
                if (doc[m].subject === subject && doc[m].object === object) {
                    doc[m].date = new Date;
                    doc[m].result = 2;
                    doc[m].refuse = false;
                    doc[m].save();
                }
            }
        }
    });
}

// 设置AddUserRec refuse 为true， 用来给subject推送object拒绝加为好友的回复
function _setAddUserRecRefuse(subject, object, refuse) {
    var addUserModel = _getModel('addUser');
    addUserModel.find(function (err, doc) {
        if (err) {
            console.log("setAddUserRecRefuse err:" + err);
            return;
        }
        if( ! doc ) {
            return;
        } else {
            for( var m in doc) {
                if (doc[m].subject === subject && doc[m].object === object) {
                    doc[m].refuse = refuse;
                    doc[m].save();
                }
            }
        }
    });
}

 /************   更新好友添加记录的状态  同意加为好友，还是不同意加为好友*/
function _updateAddUserRec(subject, object, result) {
     var addUserModel = _getModel('addUser');
     addUserModel.find(function (err, doc) {
         if (err) {
             console.log("updateAddUserRec err:" + err);
             return;
         }
         console.log(subject + "  " + object);
         if( ! doc ) {
             return;
         } else {
             for( var m in doc) {
                 if (doc[m].subject === subject && doc[m].object === object) {
                     doc[m].result = result;
                     doc[m].save();
                 }
             }
         }
     });
};

/************************************   服务器聊天room房间处理   *********************************************/
function _createRoomsRec(owner) {
    var roomTablesModel = _getModel('roomTables');
    roomTablesModel.findOne({ owner: owner }, function (err, doc) {
        if(err) {
            console.log("roomModel find err:" + err);
            return;
        }
        if(!doc) {
            var newRoomRecord = new roomTablesModel({
                owner: owner,
                rooms: [],
                sessions: []
            });
            newRoomRecord.save(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("create room record" + doc);
                }
            });
        } else return;
    })

};
//创建新的房间表
function _createRoom(owner, channel, sessionId) {
    var roomTablesModel = _getModel('roomTables');
    roomTablesModel.findOne({owner: owner}, function (err, doc) {
        if (err) {
            console.log("_createRoom err:" + err);
            return;
        }
        if (!doc) {
            return;
        } else {
            for (var m in doc.rooms) {
                if (doc.rooms[m].sessionId === sessionId) {
                    console.log("The room " + sessionId + "is exist!");
                    return;
                }
            }
            console.log("add a room:" + sessionId);
            var room = {
                channel: channel,
                sessionId: sessionId,
                name: "default"
            };
            doc.rooms.push(room);
            /*模型改变*/
            doc.markModified('rooms');
            doc.save(function (err, ret) {
                if(ret) {
                    for(var n in ret.rooms) {
                        if(ret.rooms[n].channel === channel && ret.rooms[n].sessionId === sessionId) {
                            console.log("typeof _id:" + typeof(ret.rooms[n]._id));
                            _createRoom_Users(ret.rooms[n]._id); //成功创建房间后，创建对应的用户表
                        }
                    }
                }
            });
        }
    });
}
//创建用户表
function _createRoom_Users(roomId) {
    var room_usersModel = _getModel('room_users');
    room_usersModel.findOne({roomId: roomId}, function (err, doc) {
        if(err) {
            console.log("_createRoomusers err:" + err);
            return;
        } if (!doc) {
            var newRoom_User = new room_usersModel({
                roomId: roomId,
                users: [],
                rootUser: []
            });
            newRoom_User.save(function (err, doc) {
                if (err) {
                    console.log("_createRoomUsers err:" + err);
                } else {
                    console.log("_createRoomUsers:" + doc);
                }
            });
        }
    });
}
// 添加用户到房间的用户表中
function _addUserInRoom(owner, channel, sessionId, user, callback) {
    var room_usersModel = _getModel('room_users');
    _getRoomId(owner, channel, sessionId, function (roomId) {
        room_usersModel.findOne({roomId: roomId}, function (err, doc) {
            if(err) {
                console.log("room_userMdoel find err:" + err);
                return;
            }
            if(!doc) {
                console.log("room user table not exist!");
                return;
            } else {
                var newUser = {
                    user: user
                };
                doc.users.push(newUser);
                doc.markModified('users');
                doc.save(function (err, doc) {
                    if(err) {
                        console.log("save room user err:" + err);
                        return;
                    } if(doc) {
                        callback(err, doc);
                    }
                });
            }
        })
    });
}

function _getRoomId(owner, channel, sessionId, callback) {
    var roomTablesModel = _getModel('roomTables');
    roomTablesModel.findOne({owner: owner}, function (err, doc) {
        if(err) {
            console.log("_getRoomId err:" + err);
            return;
        }
        if(!doc) {
            return;
        } else {
            for(var m in doc.rooms) {
                if(doc.rooms[m].channel === channel && doc.rooms[m].sessionId === sessionId) {
                    callback(doc.rooms[m]._id);
                }
            }
        }
    });
    
}

function _createSession(owner, channel, sessionId, user, callback) {
    var roomTablesModel = _getModel('roomTables');
    roomTablesModel.findOne({owner: user}, function (err, doc) {
        if(err) {
            console.log("createSession find err:" + err);
            return;
        }
        if(!doc) {
            return;
        } else {
            for(var m in doc.sessions) {
                if(doc.sessions[m].sessionId === sessionId && doc.sessions[m].channel === channel) {
                    var msg = "数据库显示，已经在房间中了！";
                    callback(msg);
                    return;
                }
            }
            var newSession = {
                channel: channel,
                sessionId: sessionId,
                name: "default",
                theOwner: owner
            };
            doc.sessions.push(newSession);
            doc.markModified('sessions');
            doc.save(function (err, doc) {
                if(err) {
                    console.log("save new session err:" + err);
                    return;
                } else {
                    callback(err, doc);
                }
            });
        }
    });
}
/************  返回Schema 数据库数据模型  *************/
var _getModel = function (type) {
    return mongoose.model(type);
};

module.exports = {
    getModel: function (type) {
        return _getModel(type);
    },
    addUser: function (userInfo) {
        _addUser(userInfo);
    },
    updateState: function (userName, state) {
        _updateState(userName, state);
    },
    addSessionId: function (sessionId, userName) {
        _addSessionId(sessionId, userName);
    },
    removeSessionId: function (sessionId) {
        _removeSessionId(sessionId);
    },
    getUnameFromSessionId: function (sessionId) {
        return _getUnameFromSessionId(sessionId);
    },
    createFriendRec: function (userName) {
        _createFriendRec(userName);
    },
    addFriends: function (userName) {
        _addFriends(userName);
    },
    addFriend: function (userName, friendName) {
        _addFriend(userName, friendName);
    },
    addUserRecord: function (subject, object) {
        _handleAddUserRec(subject, object);
    },
    updateAddUserRec: function (subject, object, result) {
        _updateAddUserRec(subject, object, result);
    },
    setRecRefuse: function (subject, object, refuse) {
        _setAddUserRecRefuse(subject, object, refuse);
    },
    createRoomsRec: function (owner) {
        _createRoomsRec(owner);
    },
    createRoom: function(owner, channel, sessionId) {
        _createRoom(owner, channel, sessionId);
    },
    addUserInRoom: function(owner, channel, sessionId, user, callback){
        _addUserInRoom(owner, channel, sessionId, user, callback);
    },
    createSessions: function (owner, channel, sessionId, user, callback) {
        _createSession(owner, channel, sessionId, user, callback);
    }


};
