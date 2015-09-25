module.exports = function ( app ) {
    app.get('/login',function(req,res){
        res.render('index');
    });

    app.post('/login', function (req, res) {
        var User = global.dbHelper.getModel('user')
            uname = req.body.uname;
        User.findOne({name: uname}, function (error, doc) {
            if (error) {
                res.send(500);
                console.log(error);
            } else if (!doc) { 
                req.session.error = '用户名不存在！';
                res.send(404,req.session.error);
            } else {
               if(req.body.upwd != doc.password){
                   req.session.error = "密码错误!";
                   res.send(404,req.session.error);
               }else{
                   global.dbHelper.createFriendRec(doc.name);
                   global.dbHelper.updateState(doc.name, true);
                   global.dbHelper.addSessionId(req.session.id, doc.name);
                   req.session.user=doc;
                   res.send(200);
               }
            }
        });
    });
}