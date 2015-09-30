
module.exports = {
    user: {
        name: { type: String, required: true },
        password: { type: String, required: true },
        state: { type: Boolean, required: true }
    },

    session: {
        sessionId: { type: String, required: true },
        userName: { type: String, required: true }
    },

    userFriends: {
        userName: { type: String, required: true },
        friends: [
            {
                name: { type: String, required: true },
                state: { type: String },
                Group: { type: String, required: true }
            }
        ]
    },

    addUser: {
        date: { type: Date },
        subject: { type: String, required: true },
        object: { type: String, required: true },
      //  response: { type: Boolean, required: true },      /***** response false/true object是否回复*/
        result: { type: Number, required: true },           /***** result  0——不同意  1——同意  2——默认且没有回复过 */
        refuse: {type: Boolean, required: true}             /***** refuse  在用户同意好友和默认初始化状态时， refuse-false
                                                                            如果不同意好友， refuse-true
                                                                用来推送给subject客户端， object对于此次请求的拒绝状态*/
    },

    roomTables: {
        owner: { type: String, required: true },                    //房间信息
        rooms: [                                                    /******rooms 存储所有owner创建的房间*/
            {
                channel: {type: String, required: true},            //channel
                sessionId: { type: String, required: true },        //房间sessionId   房间入口地址
                name: { type: String, required: false },            //房间别名
            }
        ],
        sessions: [                                                  /******sessions 存储加入的别人的房间***/
            {
                channel: {type: String, required: true},
                sessionId: { type: String, required: true },        //房间的sessionId  房间入口地址
                name: { type: String, required: false },            //房间的别名
                theOwner: { type: String, required: true }         //房间的创建人
            }
        ]
    },

    room_users: {
        roomId: { type: String , required: true},
        users: [                                                    //房间内的邀请加入的所有的用户列表
            {
                user: { type: String }
            }
        ],
        rootUser: [                                                 //拥有特权的user 比如说 主讲人之类的
            {
                user: { type: String }
            }
        ]
    }
};
