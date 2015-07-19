/**
 * Created by Artem on 20.07.2015.
 */

module.exports = function(app) {
    app.dataSources.db.automigrate('orgs', function(err) {
        if (err) throw err;

        app.models.orgs.create([
            {"id":3,"name":"Test3","description":"test"},
            {"id":4,"name":"Test4","description":"test"},
            {"id":5,"name":"Test5","description":"test"},
            {"id":6,"name":"Test6","description":"test"},
            {"id":7,"name":"Test7","description":"test"},
            {"id":8,"name":"Test8","description":"test"},
            {"id":9,"name":"Test9","description":"test"}
        ], function(err, org) {
            if (err) throw err;

            console.log('Models created: \n', org);
        });
    });
};