const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list posts on GET', function() {
    return chai.request(app)
    .get('/blogPosts/')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);
      const expectedKeys = ['title', 'content', 'author', 'publishDate'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });

  it('should add a blog post on POST', function() {
    const newPost = {title: 'new blog title', content: 'Lorem Ipsum', author: 'First Last', publishDate: '10.10.10'};
    return chai.request(app)
      .post('/blogPosts/')
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('title', 'content', 'author', 'publishDate');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
      });
  });

  it('should update blog posts on PUT', function() {
    const updatePost = {
      title: 'Update blog title', 
      content: 'Update Lorem Ipsum', 
      author: 'Update First Last', 
      publishDate: '11.11.11'
    };
    return chai.request(app)
      .get('/blogPosts/')
      .then(function(res) {
        updatePost.id = res.body[0].id;
        return chai.request(app)
          .put(`/blogPosts/${updatePost.id}`)
          .send(updatePost);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  it('should delete blog posts on DELETE', function() {
    return chai.request(app)
      .get('/blogPosts/')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blogPosts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});