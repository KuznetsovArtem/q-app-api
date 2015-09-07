module.exports = function(Push) {



  Push.register = function(userId, token, cb) {

    Users.updateAll( {id: userId}, {tokenkey: token}, function (err, data) {
      if (err) {
        cb(err);
      } else {
        cb(null, data);
      }
    });
  };

  Push.send = function(userId, title, msg, cb)  {
    var request = require("request");
    var app = require('../../server/server');
    var Users = app.models.customers;
    Users.findOne({where: {id: userId}}, function(err, user) {
      if(err){cb(err);}else {

        console.log('USER TOKEN: ', user.tokenkey);
        var options = {
          url: 'https://gcm-http.googleapis.com/gcm/send',
          headers: {
            'Content-Type': 'application/json',
            Authorization : 'key=AIzaSyDfgX1vCha8V9FmvSh14Btb7pIaBZCSL28'
          },
          method: 'POST',
          json: {
            "to": user.tokenkey,
            "data": {
              "title": title,
              "message": msg
            }
          }
        };

        request(options, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            cb(null, body);
          } else {
            cb(error)
          }
        });
      }
    });
  };

  Push.remoteMethod('register', {
    description: 'Add user token',
    accepts: [
      {arg: 'userId', type: 'number'},
      {arg: 'token', type: 'string'}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/register/:userId', verb: 'post'}
  });

  Push.remoteMethod('send', {
    description: 'send a msg',
    accepts: [
      {arg: 'userId', type: 'number'},
      {arg: 'title', type: 'string'},
      {arg: 'msg', type: 'string'}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/send/:userId', verb: 'post'}
  });
};
