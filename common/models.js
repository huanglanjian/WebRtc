
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
      //  response: { type: Boolean, required: true },    /***** response false/true object是否回复*/
        result: { type: Number, required: true}         /***** result  0——不同意  1——同意  2——默认且没有回复过 */
    }
};
