require('dotenv').config();

const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const urlBase = 'https://api.github.com';
const repository = 'axios-api-testing-excercise';

const headers = {
    headers: {
      Authorization: `token ${process.env.ACCESS_TOKEN}`
    }
  };

describe('GitHub Issues Api Test', () => {
    
    let githubUserName;
    
    it('Check repository axios-api-testing-excercise exists', async () => {
        const response1 = await axios.get(`${urlBase}/user`, headers);
        expect(response1.status).to.equal(StatusCodes.OK);
        githubUserName = response1.data.login;
        
        const response2 = await axios.get(`${urlBase}/repos/${githubUserName}/${repository}`, headers);
        expect(response2.status).to.equal(StatusCodes.OK);
        expect(response2.data.name).equal(repository);
    });
    
    let issueNumber;
    let issueTitle = 'My issue';

    it('Create issue', async () => {
        const body = {
            title: issueTitle
        };

        const response = await axios.post(`${urlBase}/repos/${githubUserName}/${repository}/issues`, body, headers);
  
        expect(response.status).to.equal(StatusCodes.CREATED);
        expect(response.data.title).equal(body.title);
        expect(response.data.body).to.be.null;

        issueNumber = response.data.number;
    });

    it('Modificate issue', async () => {
        const body = {
            body: 'Body issue'
        };

        const response = await axios.patch(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}`, body, headers);
        
        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.data.title).equal(issueTitle);
        expect(response.data.body).equal(body.body);

    });

    it('Lock an issue', async () => {
        const body = {
            lock_reason: 'resolved'
        };

        const response = await axios.put(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}/lock`, body, headers);
        
        expect(response.status).to.equal(StatusCodes.NO_CONTENT);
        
        const response1 = await axios.get(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}`, headers);
        expect(response1.status).to.equal(StatusCodes.OK);
        expect(response1.data.active_lock_reason).equal(body.lock_reason);
        expect(response1.data.locked).equal(true);

    });

    it('Unlock an issue', async () => {
        const response = await axios.delete(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}/lock`, headers);
        
        expect(response.status).to.equal(StatusCodes.NO_CONTENT);
        
        const response1 = await axios.get(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}`, headers);
        expect(response1.status).to.equal(StatusCodes.OK);
        expect(response1.data.active_lock_reason).to.be.null;
        expect(response1.data.locked).equal(false);

    });

});