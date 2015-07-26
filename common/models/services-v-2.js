module.exports = function(ServicesV2) {

  ServicesV2.getUserServices = function(userId, cb) {
    this.find({where: {userId: userId}}, function(err, services) {
      if (err) {
        cb(err);
      } else {
        cb(null, services);
      }
    });
  };

  // srvcenterid -> org_id


  ServicesV2.remoteMethod('getUserServices', {
    description: 'Get all services for user',
    accepts: [
      {arg: 'userId', type: 'number'}
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path: '/get/:userId', verb: 'get'}
  });

};
