
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

    allRoom: {
        owner: { type: String, required: true },            //房间属主
        roomSessionId: { type: String, required: true },    //房间sessionId
        roomName: { type: String, required: false },        //房间名称
        rooms: [
            {
                user: { type: String, required: true },
                root: { type: Boolean }          /**  举手等等特权  ***/
            }
        ]
    }
};
