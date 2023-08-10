var express = require('express');
var router = express.Router();
const { simpleQuery } = require('../database/databaseConnection')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//categories
router.get('/categories', async function(req, res) {
  const categories = await simpleQuery(`SELECT * FROM categories`)
  res.send({ categories: categories.rows })
})

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


router.get('/posts/top-summary', async function(req, res) {
  const posts = await simpleQuery(
    `
      SELECT p.* FROM ratings as r 
      JOIN posts as p 
      ON p.id = r.postid 
      WHERE p.category_id = ${req.query.id} 
      GROUP BY p.id 
      ORDER BY AVG(rating) DESC 
      LIMIT 5
    `
  )
  res.send({ posts: posts.rows })
})

router.get('/posts/all-summary', async function(req, res) {
  const posts = await simpleQuery(`SELECT * FROM posts WHERE category_id = ${req.query.category_id}`)
  res.send({ posts: posts.rows })
})

router.get('/posts', async function(req, res) {
  const posts = await simpleQuery(`SELECT * FROM posts WHERE id = ${req.query.id}`)
  res.send({ post: posts.rows[0] })
})

// router.get('/posts/:title', async function(req, res) {
//   const posts = await simpleQuery(`SELECT * FROM posts WHERE title = '${req.params.title}'`)
//   res.send({ post: posts.rows[0] })
// })

//mini section for ratings
router.post('/posts/confirm-rating', async function(req, res) {
  const {postid, username, rating} = req.body;
  var response = await simpleQuery(`SELECT u.id FROM ratings as r JOIN users as u ON u.id = r.userid WHERE postid = ${postid}  and username = '${username}' ;`)
  
  if (response.rowCount === 0) {
    const userID = await simpleQuery(`SELECT id FROM users WHERE username = '${username}';`)
    response = await simpleQuery(`INSERT INTO ratings (postid, userid, rating) VALUES (${postid}, ${userID.rows[0].id}, ${rating});`)
    console.log("Rating inserted");
  } else {
    response = await simpleQuery(`UPDATE ratings SET rating = ${rating} WHERE postid = ${postid} AND userid = ${response.rows[0].id}`)
    console.log("Rating updated");
  }
})

//all querys related to users
router.post('/users/insert-new', async function(req, res) {
  const {username, password} = req.body;
  console.log(req.body);
  const response = await simpleQuery(`INSERT INTO users (username, password) VALUES ('${username}', '${password}');`)
  console.log(response);
  res.status(201).end();
})

router.post('/users/login', async function(req, res) {
  const {username, password} = req.body;
  const response = await simpleQuery(`SELECT * FROM users WHERE username = '${username}' and password = '${password}';`)
  console.log(response);
  if (response.rowCount === 0) {
    res.status(401).send({message:"Login invalid"});
  } else {
    res.end();
  }
})

router.get('/users/search', async function(req, res) {
  const username = req.query;
  const userID = await simpleQuery(`SELECT id FROM users WHERE username = '${username}';`)
  res.send({ userID: userID.rows[0] })
})

router.get('/users/:id', async function(req, res) {
  const users = await simpleQuery(`SELECT * FROM users WHERE id = ${req.params.id}`)
  res.send({ user: users.rows[0] })
})




//post ingresar

//put modificar



module.exports = router;
