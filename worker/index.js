var CronJob = require('cron').CronJob;
var fetchGithub = require('./tasks/fetch-github');

var job = new CronJob('*/1 * * * *', function() {
    //console.log('Search a job every second in my life');
    fetchGithub();
}, null, true, 'America/Los_Angeles');
job.start();