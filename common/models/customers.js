module.exports = function(Customers) {

  var excludedProperties = [
    'realm',
    'emailVerified',
    'verificationToken',
    'credentials',
    'challenges',
    'lastUpdated',
    //'username',
    'status',
    'created'
  ];


  //Customers.disableRemoteMethod("create", true);
  //Customers.disableRemoteMethod("upsert", true);
  Customers.disableRemoteMethod("updateAll", true);
  //Customers.disableRemoteMethod("updateAttributes", false);

  Customers.disableRemoteMethod("find", true);
  //Customers.disableRemoteMethod("findById", true);
  Customers.disableRemoteMethod("findOne", true);

  //Customers.disableRemoteMethod("deleteById", true);

  Customers.disableRemoteMethod("confirm", true);
  Customers.disableRemoteMethod("count", true);
  Customers.disableRemoteMethod("exists", true);
  Customers.disableRemoteMethod("resetPassword", true);
  Customers.disableRemoteMethod("createChangeStream", true);

  Customers.disableRemoteMethod('__count__accessTokens', false);
  Customers.disableRemoteMethod('__create__accessTokens', false);
  Customers.disableRemoteMethod('__delete__accessTokens', false);
  Customers.disableRemoteMethod('__destroyById__accessTokens', false);
  Customers.disableRemoteMethod('__findById__accessTokens', false);
  Customers.disableRemoteMethod('__get__accessTokens', false);
  Customers.disableRemoteMethod('__updateById__accessTokens', false);

  // Remove the properties from base User model that doesn't have mapped columns
  excludedProperties.forEach(function (p) {
    delete Customers.definition.rawProperties[p];
    delete Customers.definition.properties[p];
    delete Customers.prototype[p];
  });
}
