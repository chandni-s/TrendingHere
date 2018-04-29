var Twitter = require('twitter');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');

var client = new Twitter({
    consumer_key: 'nbPjCwvfnuFmflLGcXCLBjNaP',
    consumer_secret: 'ioEZpV4psKARxQgWYOD8nff6dQGUtNJpFkLp9Q7Rybe2jnoezQ',
    access_token_key: '3193500684-QVVBNqiz2ghu5B047iO6R1bw8TH2slO7jLsjVv3',
    access_token_secret: 'fpgoNjlTe7eTDSNeVwSenpLEm0Gf3IVNj9ZPTP474bBpy'
});



function getlocationID(location) {
    var query = {
        lat: location.lat,
        long: location.lng
    };
    return new Promise(function (resolve, reject) {
        client.get('trends/closest', query, function (err, data) {
            if (err) return reject(err);
            else {
                var location_id;
                for (var i = 0; i < data.length; i++) {
                    location_id = data[i].woeid;
                }
                return resolve(location_id);
            }
        });
    });
}

function getTrends(idd) {
    return new Promise(function (resolve, reject) {
        client.get('trends/place', {id: idd}, function (err, data) {
            if (err) return reject(err);
            else {
                var tags = [];
                for (var i = 0; i < data.length; i++) {
                    var result = data[i].trends;
                    for (var k = 0; k < 10; k++) {
                        var obj = {name: result[k].name};
                        tags.push(obj);
                    }
                }
                return resolve(tags);
            }
        });
    });
}


module.exports = {
    getTrends: getTrends,
    getlocationID: getlocationID
};