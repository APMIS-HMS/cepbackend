'use strict';

const Model = require('../services/user/user-model');
const service = require('feathers-mongoose');
const request = require('request');


var Client = require('node-rest-client').Client;
var Zoom = require("zoomus")({
    "key": 'Is_Rgaz1R8C4NNPCHsbOiw',
    "secret": '00m1X5gocBmb1pOydgAYAOoq7kObqBUkKdRg'
});
module.exports = function(app) {

    return function(req, res, next) {
        const ZOOM_API_KEY = 'Is_Rgaz1R8C4NNPCHsbOiw';
        const ZOOM_API_SEC = '00m1X5gocBmb1pOydgAYAOoq7kObqBUkKdRg';

        // api_key = eQl0fPVWQ9KzOeTLKlnyzA
        // api_secret = GXGqQFd8yeI8YeusvQ4p9tbOXzZkDkeGi6sE
        // data_type = JSON
        // host_id = XO_fV9abS4mUmuzi8TriQg
        // topic = 'Just me and you'
        // type = 2
        // start_time = '2017-8-15T17:00:00Z'
        // duration = 60
        // timezone = Africa / Bangui
        // registration_type = 1
        // option_jbh = true
        // option_audio = both
        // option_auto_record_type = cloud

        // var options = {
        //   qs: { api_key: ZOOM_API_KEY, api_secret: ZOOM_API_SEC, data_type: "JSON", email: 'david@me.com', type: 1 }
        // };
        // var client = new Client();
        // var args = {
        //   data: { test: "hello" },
        //   headers: { "Content-Type": "application/json" }
        // };
        // console.log(options)
        // client.post("https://api.zoom.us/v1/user/create", options, function (data, response) {
        //   // parsed response body as js object
        //   console.log(data);
        //   // raw response
        //   // console.log(response);

        //   res.send(true);
        // });



        // //create a user
        // var user = {
        //   email: 'orimoyegun.sunday@hotmail.com',
        //   type: 1
        // };

        // Zoom.user.create(user, function (response) {
        //   if (response.error) {
        //     //handle error
        //     console.log(response.error);
        //     res.send(response.error);
        //   } else {
        //     //res is user object
        //     res.send(response);
        //     console.log(response);
        //   }
        // });



        var startTime = req.body.startTime;
        var topic = req.body.topic;
        var appointmentId = req.body.appointmentId
        var meeting = {
            host_id: "XO_fV9abS4mUmuzi8TriQg",
            type: 2,
            data_type: "JSON",
            topic: topic,
            start_time: startTime,
            option_jbh: true,
            option_auto_record_type: 'cloud',
            timezone: 'Africa/Bangui'
        }

        Zoom.meeting.create(meeting, function(response) {
            if (response.error) {
                //handle error

                res.jsend.error({
                    code: 404,
                    message: 'An error has occured!'
                });
            } else {
                // console.log(response);
                let appointment = updateAppointment(app, appointmentId, response);
                res.send({ zoom: response.body, appointment: appointment })
            }
        });

        // var meeting = {
        //   host_id: "XO_fV9abS4mUmuzi8TriQg"
        // }

        // Zoom.meeting.list(meeting, function (response) {
        //   if (response.error) {
        //     //handle error
        //   } else {
        //     console.log(response);
        //      res.send(response)
        //   }
        // });

    };
};

function updateAppointment(app, appointmentId, zoom) {
    app.service('appointments').get(appointmentId, {}).
    then(appointment => {
        appointment.zoom = zoom;
        return saveUpdate(app, appointment);
    });
}

function saveUpdate(app, appointment) {
    app.service('appointments').update(appointment._id, appointment).then(payload => {
        return payload;
    })
}

// db.createUser( {
//   user: "dbadmin",
//   pwd: "&@mp@c!u3@@!P",
//   roles:[ "clusterAdmin","readAnyDatabase","readWrite"] })

//Database user
// db.createUser( {
//   user: "apmisdev",
//   pwd: "imediappsolve",
//   roles:["readWrite"] })


// mongorestore --host 192.168.1.2 --port 3017 --db mongodevdb --username mongodevdb --password YourSecretPwd --drop /backup/dump