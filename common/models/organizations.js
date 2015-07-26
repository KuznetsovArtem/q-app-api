module.exports = function(Organizations) {


  Organizations.disableRemoteMethod("create", true);
  Organizations.disableRemoteMethod("upsert", true);
  Organizations.disableRemoteMethod("updateAll", true);
  Organizations.disableRemoteMethod("updateAttributes", false);

  //Organizations.disableRemoteMethod("find", true);
  Organizations.disableRemoteMethod("findById", true);
  Organizations.disableRemoteMethod("findOne", true);

  Organizations.disableRemoteMethod("deleteById", true);

  Organizations.disableRemoteMethod("confirm", true);
  Organizations.disableRemoteMethod("count", true);
  Organizations.disableRemoteMethod("exists", true);
  Organizations.disableRemoteMethod("resetPassword", true);

  Organizations.disableRemoteMethod('__count__accessTokens', false);
  Organizations.disableRemoteMethod('__create__accessTokens', false);
  Organizations.disableRemoteMethod('__delete__accessTokens', false);
  Organizations.disableRemoteMethod('__destroyById__accessTokens', false);
  Organizations.disableRemoteMethod('__findById__accessTokens', false);
  Organizations.disableRemoteMethod('__get__accessTokens', false);
  Organizations.disableRemoteMethod('__updateById__accessTokens', false);

  Organizations.getServices = function(id, cb) {
    var request = require("request")
    var self = this;

    self.findOne({where: {id: id}}, function(err, user) {
      if(err) {
          throw(err);
      } else {
        // TODO: fill req data;
        var url = [
          "http://109.108.87.13:8094/QueueService.svc/json_pre_reg/GetServiceList",
          "?organisationGuid={0B6A3E72-8604-4EB6-BD11-4C7F0A126B62}",
          "&serviceCenterId=" + id
        ].join('');

        request({
          url: url,
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            cb(null, body);
          }
        });
      }
    });
  };

  Organizations.getServiceDates = function(org_id, srv_id, cb) {
    var request = require("request")

    var url = [
      "http://109.108.87.13:8094/QueueService.svc/json_pre_reg/GetDayList",
      "?organisationGuid={0B6A3E72-8604-4EB6-BD11-4C7F0A126B62}",
      "&serviceCenterId=" + org_id,
      "&serviceId=" + srv_id||2
    ].join('');

    console.log(url);

    request({
      url: url,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        cb(null, body);
      }
    });
  };


  Organizations.getServiceAvbTime = function(org_id, srv_id, ts, cb) {
    var request = require("request")

    // http://109.108.87.13:8094/QueueService.svc/json_pre_reg/GetTimeList?organisationGuid={0B6A3E72-8604-4EB6-BD11-4C7F0A126B62}&serviceCenterId=1&serviceId=2&date=2015-07-22
    // TODO: get from orgs;`
    var url = "http://109.108.87.13:8094/QueueService.svc/json_pre_reg/GetServiceList?organisationGuid={0B6A3E72-8604-4EB6-BD11-4C7F0A126B62}&serviceCenterId=1"

    request({
      url: url,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        cb(null, body);
      }
    });
  };

  Organizations.registerService = function(cb) {
    //http://109.108.87.13:8094/QueueService.svc/json_pre_reg/RegCustomer?organisationGuid={0B6A3E72-8604-4EB6-BD11-4C7F0A126B62}&serviceCenterId=1&serviceId=2&date=2015-07-22%2016:00:00
  }

  Organizations.remoteMethod('getServices', {
    description: 'Get all services for org_id',
    accepts: {arg: 'id', type: 'number'},
    returns: {arg: 'servicesList', type: 'object'},
    http: {path: '/:id/services', verb: 'get'}
  });

  Organizations.remoteMethod('getServiceDates', {
    description: 'Get avb dates for org_id/srv_id',
    accepts: [
      {arg: 'org_id', type: 'number'},
      {arg: 'srv_id', type: 'number'}
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path: '/:org_id/services/:srv_id', verb: 'get'}
  });

  Organizations.remoteMethod('getServiceAvbTime', {
    description: 'Get avb time for org_id/srv_id/selected date',
    accepts: [
      {arg: 'org_id', type: 'number'},
      {arg: 'srv_id', type: 'number'},
      {arg: 'ts', type: 'number'}
    ],
    returns: {arg: 'data', type: 'object'},
    http   : {path: '/:org_id/services/:srv_id/:ts', verb: 'get'}
  });

  Organizations.remoteMethod('registerService', {
    description: 'Register new service for user',
    accepts: [
      {arg: 'org_id', type: 'number'},
      {arg: 'srv_id', type: 'number'},
      {arg: 'ts', type: 'number'},
      {arg: 'user_id', type: 'number'}
    ],
    returns: {arg: 'data', type: 'object'},
    http   : {path: '/registerService', verb: 'post'}
  });

};
