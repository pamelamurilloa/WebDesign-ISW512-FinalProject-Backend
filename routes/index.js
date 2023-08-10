var express = require('express');
var router = express.Router();
const { simpleQuery } = require('../database/databaseConnection')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//all queryes related to posts

router.post('/posts/insert-new', async function(req, res) {
  const {id, img_source, title, author, date, summary, complete_information, category_id} = req.body;
  console.log(req.body);

  const response = await simpleQuery(
      `
        INSERT INTO posts (
        id, img_source, title, author, date, summary, complete_information, category_id) 
        VALUES (${id}, '${img_source}', '${title}', '${author}', '${date}', '${summary}', '${complete_information}', ${category_id});
      `
    )
  console.log(response);
  res.status(201).end();
})

router.get('/users/:id', async function(req, res) {
  const users = await simpleQuery(`SELECT * FROM users WHERE id = ${req.params.id}`)
  res.send({ user: users.rows[0] })
})

router.get('/posts/top-summary', async function(req, res) {
  const posts = await simpleQuery(
    `
      SELECT p.* FROM ratings as r 
      JOIN posts as p 
      ON p.id = r.postid 
      GROUP BY p.id 
      ORDER BY AVG(rating) DESC 
      LIMIT 5
    `
  )
  res.send({ posts: posts.rows })
})

router.get('/posts/all-summary', async function(req, res) {
  const posts = await simpleQuery(`SELECT * FROM posts ORDER BY categoryid ASC`)
  res.send({ posts: posts.rows })
})

router.get('/posts/:id', async function(req, res) {
  const posts = await simpleQuery(`SELECT * FROM posts WHERE id = ${req.params.id}`)
  res.send({ post: posts.rows[0] })
})

//mini section for ratings
router.put('/posts/', async function(req, res) {
  const {postid, userid, rating} = req.body;
  const posts = await simpleQuery(`UPDATE ratings SET rating = ${rating} WHERE postid = ${postid} AND userid = ${userid}`)
  res.send({ post: posts.rows[0] })
})

//all querys related to users
router.post('/users/insert-new', async function(req, res) {
  const {username, password} = req.body;
  console.log(req.body);
  const response = await simpleQuery(`INSERT INTO users (username, password) VALUES ('${username}', '${password}');`)
  console.log(response);
  res.status(201).end();
})

router.get('/users/password', async function(req, res) {
  const username = req.body;
  const password = await simpleQuery(`SELECT password FROM users WHERE username = '${username}';`)
  res.send({ password: password.rows[0] })
})

router.get('/users/:id', async function(req, res) {
  const users = await simpleQuery(`SELECT * FROM users WHERE id = ${req.params.id}`)
  res.send({ user: users.rows[0] })
})

//post ingresar

//put modificar



module.exports = router;
