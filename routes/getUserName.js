/**
 * Created by jky on 15-9-17.
 */
module.exports = function ( app ) {

    app.post('/getUserName', function (req, res) {
        var sessionId = req.session.id;
        var sessionModel = global.dbHelper.getModel('session');
        sessionModel.findOne({sessionId: sessionId}, "sessionId userName", function (err, doc) {
            if (err) {
                res.send(500, err);
                return handleError(err);
                console.log("_getUnameFromSessionId:" + err);
            } else if (doc) {

                req.session.user = doc.userName;
                res.send(200, req.session.user);
            } else {
                res.send(500);
                return false;
            }
        });
    });
}