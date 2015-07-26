module.exports = function(Services) {

  Services.disableRemoteMethod("create", true);
  //Services.disableRemoteMethod("upsert", true);
  Services.disableRemoteMethod("updateAll", true);
  Services.disableRemoteMethod("updateAttributes", false);

  Services.disableRemoteMethod("find", true);
  //Services.disableRemoteMethod("findById", true);
  Services.disableRemoteMethod("findOne", true);

  //Services.disableRemoteMethod("deleteById", true);

  Services.disableRemoteMethod("confirm", true);
  Services.disableRemoteMethod("count", true);
  Services.disableRemoteMethod("exists", true);
  Services.disableRemoteMethod("resetPassword", true);
  Services.disableRemoteMethod("createChangeStream", true);

  Services.disableRemoteMethod('__count__accessTokens', false);
  Services.disableRemoteMethod('__create__accessTokens', false);
  Services.disableRemoteMethod('__delete__accessTokens', false);
  Services.disableRemoteMethod('__destroyById__accessTokens', false);
  Services.disableRemoteMethod('__findById__accessTokens', false);
  Services.disableRemoteMethod('__get__accessTokens', false);
  Services.disableRemoteMethod('__updateById__accessTokens', false);


  Services.getUserServices = function(userId, cb) {
    this.find({where: {userId: userId}}, function(err, services) {
      if (err) {
        cb(err);
      } else {
        cb(null, services);
      }
    });
  };

  // srvcenterid -> org_id


  Services.remoteMethod('getUserServices', {
    description: 'Get all services for user',
    accepts: [
      {arg: 'userId', type: 'number'}
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path: '/get/:userId', verb: 'get'}
  });

};
