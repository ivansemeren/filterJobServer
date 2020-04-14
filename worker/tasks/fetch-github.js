
const redis = require("redis");
const client = redis.createClient();
//const getAsync = promisify(client.get).bind(client);
var fetch = require('node-fetch');
const { promisify } = require("util");
const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json'

async function fetchGithub() {
    
    let onPage = 0, resultCount = 1;
    let allJobs = [];
    
    while(resultCount > 0) {
        const res = await fetch(`${baseURL}?page=${onPage}`);
        const jobs = await res.json();
        allJobs.push(...jobs);
        resultCount = jobs.length;
        console.log('got', resultCount, 'jobs'); 
        //console.log(jobs);
        onPage++;
    }

    console.log('total jobs:', allJobs.length);

    const jrJobs = allJobs.filter(job => {
        const jobTitle = job.title.toLowerCase();

        if( jobTitle.includes('senior') ||  jobTitle.includes('sr.') ||
            jobTitle.includes('manager') ||  jobTitle.includes('architect')){
                return false;
            }
        return true;
    });

    console.log('Filtered Jobs:', jrJobs.length);

    const success = await setAsync('github', JSON.stringify(jrJobs));
    console.log({success});
}

//fetchGithub();

module.exports = fetchGithub;