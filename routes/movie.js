const express = require('express');
const movieController = require('../controllers/MovieController');

const router = express.Router();

router.get('/actor', movieController.actor_list);
router.get('/actor/:id', movieController.get_actor);
router.post('/actor', movieController.create_actor);
router.put('/actor/:id', movieController.update_actor);
router.delete('/actor/:id', movieController.delete_actor);
router.get('/genre', movieController.genre_list);
router.post('/genre', movieController.create_genre);
router.delete('/genre/:id', movieController.delete_genre);
router.get('/film', movieController.film_list);
router.get('/film/:id', movieController.get_film);
router.post('/film', movieController.create_film);
router.put('/film/:id', movieController.update_film);



module.exports = router;
