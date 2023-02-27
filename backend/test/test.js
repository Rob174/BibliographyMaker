const assert = require('chai').assert;
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const app = require('../src/app');
const request = require('supertest');
const chai = require('chai');

// Make a basic request to add the paper with doi 10.1016/j.dam.2005.05.020 and relevant_text "This is a test" and tags "test" and "test2"
// Then make a request to get the papers and check that the paper is in the list
// Then make a request to get the tags and check that the tags are in the list
describe('Test the backend', function() {
    // Make a clean request
    it('Test clean', (done) => {
        request(app)
            .delete('/clean')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    // Test the postPaper function
    it('Test postPaper', (done) => {
        request(app)
            .post('/')
            .send({ doi: "10.1016/j.dam.2005.05.020", relevant_text: "This is a test", tags: ["test", "test2"] })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    // Test the getPapers function
    it('Test getPapers', (done) => {
        request(app)
            .get('/papers')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert(res.body.find((paper) => paper.doi === "10.1016/j.dam.2005.05.020"));
                done();
            });
    });
    // Test the getTags function
    it('Test getTags', (done) => {
        request(app)
            .get('/tags')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert(res.body.find((tag) => tag === "test"));
                assert(res.body.find((tag) => tag === "test2"));
                done();
            });
    });
});
// Make a request to get the papers with title "First vs best improvement: an empirical study" and check that the doi is 10.1016/j.dam.2005.05.020
describe('Make a request to get the papers with title "First vs best improvement: an empirical study" and check that the doi is 10.1016/j.dam.2005.05.020', function() {
    it('Test getPapersWithTitle', (done) => {
        const title = "First vs best improvement: an empirical study";
        const encodedTitle = encodeURIComponent(title);
        const url = `/papersWith/${encodedTitle}`;
        request(app)
            .get(url)
            .end((err, res) => {
                const {papers} = res.body;
                const found = papers.map((paper) => paper.doi).includes("10.1016/j.dam.2005.05.020");
                chai.assert.isTrue(found, "The paper with doi 10.1016/j.dam.2005.05.020 is not in the list");
                // Chai assert that we have only the fields doi, title, authors and abstract
                const fieldsRequired = ["doi", "title", "authors", "abstract"];
                const fields = Object.keys(papers[0]);
                chai.assert(fieldsRequired.every((field) => fields.includes(field)), "The fields are not correct: " + fields);
                chai.assert(fields.length === fieldsRequired.length, "We want only the field doi, title, authors and abstract not " + fields);
                done();
            });
    });
});