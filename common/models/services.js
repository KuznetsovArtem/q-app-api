module.exports = function(Services) {



  Services.get = function(next) {
    var request = require("request")

    // TODO: get from orgs;`
    var url = "http://109.108.87.13:8094/QueueService.svc/json_pre_reg/GetServiceList?organisationGuid={0B6A3E72-8604-4EB6-BD11-4C7F0A126B62}&serviceCenterId=1"

    request({
      url: url,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body) // Print the json response
        next(null, body);
      }
    });
  }


  Services.testdata = function(next) {
    var data = [{
      id: 1,
      name: 'test'
    },{
      id: 2,
      name: 'test2'
    },{
      id: 3,
      name: 'test3'
    }];



    next(null, data);
  };

  Services.remoteMethod(
    'testdata',
    {
      http: {path: '/testdata', verb: 'get'},
      returns: {arg: 'testdata', type: 'object'}
    }
  );

  Services.remoteMethod(
    'get', {
      http: {path: '/get', verb: 'get'},
      returns: {arg: 'servicesList', type: 'object'}
    }
  );

};
