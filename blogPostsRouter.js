const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

// we're going to add some blog posts to BlogPosts
// so there's some data to look at
BlogPosts.create(
    'my first blog title', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ', 'colleen saltarelli', '11.10.17');
BlogPosts.create(
    'my second blog title', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ', 'colleen saltarelli', '11.10.17');
    
// send back JSON representation of all BlogPosts
// on GET requests to root
router.get('/', (req, res) => {
  console.log(BlogPosts.get())
  res.status(200).json(BlogPosts.get());
});

// when new BlogPosts added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
router.post('/', jsonParser, (req, res) => {
  // ensure title, content, author, publishDate are in request body
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  })
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

// Delete recipes (by id)!
router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
  console.log(`Deleted BlogPosts item \`${req.params.id}\``);
  res.status(204).end();
});

// when PUT request comes in with updated BlogPosts, ensure has
// required fields. also ensure that BlogPosts id in url path, and
// BlogPosts id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.updateItem` with updated recipe.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    return res.status(400).send(message);
  }
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate,
  });
  res.status(204).end();
})

module.exports = router;