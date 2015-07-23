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


  // Remove the properties from base User model that doesn't have mapped columns
  excludedProperties.forEach(function (p) {
    delete Customers.definition.rawProperties[p];
    delete Customers.definition.properties[p];
    delete Customers.prototype[p];
  });
}
