module.exports = function(Services) {

  Services.disableRemoteMethod("create", true);
  //Services.disableRemoteMethod("upsert", true);
  Services.disableRemoteMethod("updateAll", true);
  //Services.disableRemoteMethod("updateAttributes", false);

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

  Services.deleteByUser = function(userId, srvId, cb) {
    var self = this;
    self.deleteById(srvId, function(err, data) {
      if(err) cb(err);
      cb(null, {
        error: null,
        done: true,
        data: data
      });
    });

    // DropCustomer(String organisationGuid, Int32 serviceCenterId, String jobGuid, String comment)
  };

  Services.updateByUser = function(oldSrvId, orgId, orgName, ctrId, ctrName, srvId, srvName, dateTime, userId, cb) {
    var app = require('../../server/server');
    var OrgModel = app.models.organizations;
    var self = this;

    OrgModel.registerService(orgId, orgName, ctrId, ctrName, srvId, srvName, dateTime, userId, function(err, newService) {
      if(err) cb(err);
      self.deleteById(oldSrvId, function(err) { //TODO: use deleteByUser;
        if(err) cb(err);
        cb(null, newService);
      });
    });
  };


  Services.remoteMethod('getUserServices', {
    description: 'Get all services for user',
    accepts: [
      {arg: 'userId', type: 'number'}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/get/:userId', verb: 'get'}
  });

  Services.remoteMethod('deleteByUser', {
    description: 'Del one',
    accepts: [
      {arg: 'userId', type: 'number'},
      {arg: 'srvId', type: 'string'}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/del/', verb: 'get'}
  });

  Services.remoteMethod('updateByUser', {
    description: 'Delete + create new one',
    accepts: [
      {arg: 'oldSrvId', type: 'string'},
      {arg: 'orgId', type: 'number'},
      {arg: 'orgName', type: 'string'},
      {arg: 'ctrId', type: 'number'},
      {arg: 'ctrName', type: 'string'},
      {arg: 'srvId', type: 'number'},
      {arg: 'srvName', type: 'string'},
      {arg: 'dateTime', type: 'string'},
      {arg: 'userId', type: 'number'}
    ],
    returns: {type: 'object', root: true},
    http: {path: '/update/', verb: 'post'}
  });

};
