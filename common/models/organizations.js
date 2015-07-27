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
  Organizations.disableRemoteMethod("createChangeStream", true);

  Organizations.disableRemoteMethod('__count__accessTokens', false);
  Organizations.disableRemoteMethod('__create__accessTokens', false);
  Organizations.disableRemoteMethod('__delete__accessTokens', false);
  Organizations.disableRemoteMethod('__destroyById__accessTokens', false);
  Organizations.disableRemoteMethod('__findById__accessTokens', false);
  Organizations.disableRemoteMethod('__get__accessTokens', false);
  Organizations.disableRemoteMethod('__updateById__accessTokens', false);

  var request = require("request")

  Organizations.getServices = function(id, cb) {
    var self = this;

    self.findOne({where: {id: id}}, function(err, org) {
      if(err) {
          throw(err);
      } else {
        var url = [
          org.server,
          "/QueueService.svc/json_pre_reg/GetServiceList",
          "?organisationGuid={"+ org.guid +"}",
          "&serviceCenterId=" + id // TODO: ?
        ].join('');

        request({
          url: url,
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            cb(null, body.d);
          }
        });
      }
    });
  };

  Organizations.getServiceDates = function(orgId, srvId, cb) {
    var self = this;

    self.findOne({where: {id: orgId}}, function(err, org) {
      if(err) {
          throw(err);
      } else {
        var url = [
          org.server,
          "/QueueService.svc/json_pre_reg/GetDayList",
          "?organisationGuid={"+ org.guid +"}",
          "&serviceCenterId=" + orgId,
          "&serviceId=" + srvId||2
        ].join('');

        request({
          url: url,
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            cb(null, body.d);
          }
        });
      }
    });
  };


  Organizations.getServiceAvbTime = function(orgId, srvId, date, cb) {
    var self = this;

    self.findOne({where: {id: orgId}}, function(err, org) {
      if(err) {
          throw(err);
      } else {
        var url = [
          org.server,
          "/QueueService.svc/json_pre_reg/GetTimeList",
          "?organisationGuid={"+ org.guid +"}",
          "&serviceCenterId=" + orgId,
          "&serviceId=" + srvId||2,
          "&date=" + date // 2015-07-22
        ].join('');

        request({
          url: url,
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            cb(null, body.d);
          }
        });
      }
    });

  };

  Organizations.registerService = function(orgId, orgName, srvId, srvName, dateTime, userId, cb) {
    var app = require('../../server/server');
    var ServicesModel = app.models.services;
    var self = this;

    self.findOne({where: {id: orgId}}, function(err, org) {
      if(err) {
          throw(err);
      } else {
        var url = [
          org.server,
          "/QueueService.svc/json_pre_reg/RegCustomer",
          "?organisationGuid={"+ org.guid +"}",
          "&serviceCenterId=" + orgId,
          "&serviceId=" + srvId||2,
          "&date=" + dateTime // 2015-07-29 16:00:00
        ].join('');

        request({
          url: url,
          json: true
        }, function (error, response, data) {
          if (!error && response.statusCode === 200) {

            //cb(null, data.d);
            /*
            {
              "__type": "CustomerRegistration:#QueueState.Entities",
              "CustOrderGuid": "4b9ddd68-f9a1-4a04-b445-59afa858797b",
              "CustReceiptLetter": "",
              "CustReceiptNum": 5
            }*/

            ServicesModel.create({
              "id": data.d.CustOrderGuid,
              "orderid": data.d.CustOrderGuid,
              "userId": userId,
              "paytoolid": 1,
              "amount": 0,
              "organisationid": orgId,
              "orgId": orgId,
              "orgName": orgName,
              "serviceid": srvId,
              "serviceName": srvName,
              "dateTime": dateTime,
              "status": 0,
              "causeid": 0
              //"updatetime": ""
            }, function(err, service) {
              if (err) throw err;

              console.log(' created: \n', service);
              cb(null, service);
            });

          }

        });
      }
    });
  }

  Organizations.remoteMethod('getServices', {
    description: 'Get all services for orgId',
    accepts: {arg: 'id', type: 'number'},
    //returns: {arg: 'servicesList', type: 'object'},
    returns: {type: 'object', root: true},
    http: {path: '/:id/services', verb: 'get'}
  });

  Organizations.remoteMethod('getServiceDates', {
    description: 'Get avb dates for orgId/srvId',
    accepts: [
      {arg: 'orgId', type: 'number'},
      {arg: 'srvId', type: 'number'}
    ],
    //returns: {arg: 'data', type: 'object'},
    returns: {type: 'object', root: true},
    http: {path: '/:orgId/services/:srvId', verb: 'get'}
  });

  Organizations.remoteMethod('getServiceAvbTime', {
    description: 'Get avb time for orgId/srvId/selected date',
    accepts: [
      {arg: 'orgId', type: 'number'},
      {arg: 'srvId', type: 'number'},
      {arg: 'date', type: 'string'}
    ],
    //returns: {arg: 'data', type: 'object'},
    returns: {type: 'object', root: true},
    http   : {path: '/:orgId/services/:srvId/:ts', verb: 'get'}
  });

  Organizations.remoteMethod('registerService', {
    description: 'Register new service for user',
    accepts: [
      {arg: 'orgId', type: 'number'},
      {arg: 'orgName', type: 'string'},
      {arg: 'srvId', type: 'number'},
      {arg: 'srvName', type: 'string'},
      {arg: 'dateTime', type: 'string'},
      {arg: 'userId', type: 'number'}
    ],
    returns: {type: 'object', root: true},
    //returns: {arg: 'data', type: 'object'},
    http   : {path: '/registerService', verb: 'post'}
  });

};
