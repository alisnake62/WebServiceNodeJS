const db = require('../database');
const MovieRepository = require('../repository/MovieRepository');



exports.actor_list = (req, res) => {
    const repo = new MovieRepository(db);
    repo.get_object_list('actors')
        .then((result) => {
            getResult(result, res);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.get_actor = (req, res) => {
    const repo = new MovieRepository(db);
    repo.get_object_by_id('actors', req.params.id)
        .then((result) => {
            getResult(result, res);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.create_actor = (req, res) => {
    const errors = [];
    ['first_name', 'last_name', 'date_of_birth'].forEach((field) => {
        if (!req.body[field]) {
            errors.push(`Field '${field}' is missing from request body`);
        }
    });
    if (errors.length) {
        res.status(400).json({
            success: false,
            errors,
        });
        return;
    }

    const repo = new MovieRepository(db);

    repo.create_actor({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
    })
        .then((result) => {
            res
                .status(201)
                .json({
                    success: true,
                    id: result,
                });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.update_actor = (req, res) => {
    const errors = [];
    ['first_name', 'last_name', 'date_of_birth'].forEach((field) => {
        if (!req.body[field]) {
            errors.push(`Field '${field}' is missing from request body`);
        }
    });
    if (errors.length) {
        res.status(400).json({
            success: false,
            errors,
        });
        return;
    }

    const repo = new MovieRepository(db);

    //check if id exist
    repo.get_object_by_id('actors', req.params.id) 
    .then((result) => {
        if (!result){
            res.status(404).json({
                success: false,
                data: 'Unable to find the data requested',
            })
        }else{
            repo.update_actor(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death,
                    id: req.params.id,
                }
            )   
            .then(() => {
                repo.get_object_by_id('actors', req.params.id) 
                    .then((result) => {
                        res.json({
                            success: true,
                            data: result,
                        });
                    });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
        }
    });

    
};

exports.delete_actor = (req, res) => {
    const repo = new MovieRepository(db);

    //check if id exist
    repo.get_object_by_id('actors', req.params.id) 
    .then((result) => {
        if (!result){
            res.status(404).json({
                success: false,
                data: 'Unable to find the data requested',
            })
        }else{
            repo.delete_object('actors', req.params.id)
            .then(() => {
                res.status(204)
                    .json({
                        success: true,
                    });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
        }
        
    });
};

exports.genre_list = (req, res) => {
    const repo = new MovieRepository(db);
    repo.get_object_list('genres')
        .then((result) => {
            getResult(result, res);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.create_genre = (req, res) => {
    const errors = [];
    
    if (!req.body['name']) {
        errors.push(`Field 'name' is missing from request body`);
    }

    if (errors.length) {
        res.status(400).json({
            success: false,
            errors,
        });
        return;
    }

    const repo = new MovieRepository(db);

    repo.create_genre({
        name: req.body.name
    })
        .then((result) => {
            res
                .status(201)
                .json({
                    success: true,
                    id: result,
                });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.delete_genre = (req, res) => {
    const repo = new MovieRepository(db);

    //check if id exist
    repo.get_object_by_id('genres', req.params.id) 
    .then((result) => {
        if (!result){
            res.status(404).json({
                success: false,
                data: 'Unable to find the data requested',
            })
        }else{

            //check si il y a des films dans le genre
            repo.get_items("films", "*", `genre_id=${req.params.id}`) 
            .then((result) => {
                if (result.length){
                    res.status(403).json({
                        success: false,
                        data: `Unable to delete this genre, one or more film are store in this one`,
                    })
                }else{
                    repo.delete_object('genres', req.params.id)
                    .then(() => {
                        res.status(204)
                            .json({
                                success: true,
                            });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    }); 
                        }
                    });
        }
    });

    
};

exports.film_list = (req, res) => {
    const repo = new MovieRepository(db);
    repo.get_object_list('films')
        .then((films) => {
            if (!films.length){
                res.status(404).json({
                    success: false,
                    data: 'Unable to find the data requested',
                });
            }else{
                var rtfunc = [];
                films.forEach((film) => {

                    //get genre
                    repo.get_object_by_id("genres", film.genre_id)
                    .then((genre) => {
                        
                        delete film.genre_id;
                        film.genre = genre;
                        
                        //get actors
                        repo.get_actors_by_film_id(film.id)
                        .then((actors) => {
                            film.actors = actors;
                            
                            rtfunc.push(film);
                            if (rtfunc.length == films.length){
                                res.json({
                                    success: true,
                                    data: rtfunc,
                                });
                            }
                        })
                        .catch((err) => {
                            res.status(500).json({ error: err.message });
                        });

                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    });

                });
                
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.get_film = (req, res) => {
    const repo = new MovieRepository(db);
    repo.get_object_by_id('films', req.params.id)
        .then((film) => {
            if (!film){
                res.status(404).json({
                    success: false,
                    data: 'Unable to find the data requested',
                });
            }else{

                //get genre
                repo.get_object_by_id("genres", film.genre_id)
                .then((genre) => {
                    delete film.genre_id;
                    film.genre = genre;


                    //get actors
                    repo.get_actors_by_film_id(film.id)
                    .then((actors) => {
                        film.actors = actors;
                        res.json({
                            success: true,
                            data: film,
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    });

                })
                .catch((err) => {
                    res.status(500).json({ error: err.message });
                });

            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.create_film = (req, res) => {
    const errors = [];
    ['name', 'synopsis', 'release_year', 'genre_id', 'actors_id'].forEach((field) => {
        if (!req.body[field]) {
            errors.push(`Field '${field}' is missing from request body`);
        }
        if (!Array.isArray(req.body.actors_id)) {
            errors.push(`Field '${field}' is missing from request body`);
        }
    });
    if (errors.length) {
        res.status(400).json({
            success: false,
            errors,
        });
        return;
    }

    const repo = new MovieRepository(db);

    //check if genre exist
    repo.get_object_by_id('genres', req.body.genre_id)
        .then((genre) => {
            
            if (!genre){
                res.status(404).json({
                    success: false,
                    data: 'Unable to find the data requested',
                });
            }else{
                
                //check if all actors exist
                repo.get_actors_by_ids(req.body.actors_id)
                .then((actors) => {
                    if (actors.length != req.body.actors_id.length){
                        res.status(404).json({
                            success: false,
                            data: 'Unable to find the data requested',
                        });
                    }else{
                        
                        // création du film
                        repo.create_film({
                            name: req.body.name,
                            synopsis: req.body.synopsis,
                            release_year: req.body.release_year,
                            genre_id: req.body.genre_id
                        })
                        .then((lastID) => {
                            var varTemp = 0;
                            if (!req.body.actors_id.length){
                                res.status(201)
                                .json({
                                    success: true,
                                    id: lastID,
                                });
                            }else{

                                // création de l'associaiton film_actor
                                req.body.actors_id.forEach((actor_id) => {
                                    varTemp += 1;
                                    repo.create_films_actors(lastID, actor_id)
                                    .then((value) => {
                                        if (varTemp == req.body.actors_id.length)
                                        {
                                            res.status(201)
                                            .json({
                                                success: true,
                                                id: lastID,
                                            });
                                        }
                                        
                                    })
                                    .catch((err) => {
                                        res.status(500).json({ error: err.message });
                                    });
                                });
                            }
                        })
                        .catch((err) => {
                            res.status(500).json({ error: err.message });
                        });
                        
                    }
                })
            
            }

        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};


exports.update_film = (req, res) => {
    const errors = [];
    ['name', 'synopsis', 'release_year', 'genre_id', 'actors_id'].forEach((field) => {
        if (!req.body[field]) {
            errors.push(`Field '${field}' is missing from request body`);
        }
        if (!Array.isArray(req.body.actors_id)) {
            errors.push(`Field '${field}' is missing from request body`);
        }
    });
    if (errors.length) {
        res.status(400).json({
            success: false,
            errors,
        });
        return;
    }

    const repo = new MovieRepository(db);

    //check if id exist
    repo.get_object_by_id('films', req.params.id) 
    .then((result) => {
        if (!result){
            res.status(404).json({
                success: false,
                data: 'Unable to find the data requested',
            })
        }else{
           
            //check if genre exist
            repo.get_object_by_id('genres', req.body.genre_id)
            .then((genre) => {
                
                if (!genre){
                    res.status(404).json({
                        success: false,
                        data: 'Unable to find the data requested',
                    });
                }else{
                    
                    //check if all actors exist
                    repo.get_actors_by_ids(req.body.actors_id)
                    .then((actors) => {
                        if (actors.length != req.body.actors_id.length){
                            res.status(404).json({
                                success: false,
                                data: 'Unable to find the data requested',
                            });
                        }else{

                            // suppression de l'association films actor
                            repo.delete_films_actors(req.params.id)
                            .then(() => {
                                
                                // création de l'association film actors
                                var varTemp = 0;
                                if (!req.body.actors_id.length){
                                    

                                    // get film
                                    repo.get_object_by_id('films', req.params.id)
                                    .then((film) => {

                                        //get genre
                                        repo.get_object_by_id("genres", film.genre_id)
                                        .then((genre) => {
                                            delete film.genre_id;
                                            film.genre = genre;


                                            //get actors
                                            repo.get_actors_by_film_id(film.id)
                                            .then((actors) => {
                                                film.actors = actors;
                                                res.json({
                                                    success: true,
                                                    data: film,
                                                });
                                            })
                                            .catch((err) => {
                                                res.status(500).json({ error: err.message });
                                            });

                                        })
                                        .catch((err) => {
                                            res.status(500).json({ error: err.message });
                                        });

                                    })
                                    .catch((err) => {
                                        res.status(500).json({ error: err.message });
                                    });


                                }
                                else{


                                    req.body.actors_id.forEach((actor_id) => {
                                        varTemp += 1;
                                        repo.create_films_actors(req.body.genre_id, actor_id)
                                        .then((value) => {
                                            if (varTemp == req.body.actors_id.length)
                                            {
                                                
                                                // get film
                                                repo.get_object_by_id('films', req.params.id)
                                                .then((film) => {

                                                    //get genre
                                                    repo.get_object_by_id("genres", film.genre_id)
                                                    .then((genre) => {
                                                        delete film.genre_id;
                                                        film.genre = genre;


                                                        //get actors
                                                        repo.get_actors_by_film_id(film.id)
                                                        .then((actors) => {
                                                            film.actors = actors;
                                                            res.json({
                                                                success: true,
                                                                data: film,
                                                            });
                                                        })
                                                        .catch((err) => {
                                                            res.status(500).json({ error: err.message });
                                                        });

                                                    })
                                                    .catch((err) => {
                                                        res.status(500).json({ error: err.message });
                                                    });

                                                })
                                                .catch((err) => {
                                                    res.status(500).json({ error: err.message });
                                                });

                                            }
                                            
                                        })
                                        .catch((err) => {
                                            res.status(500).json({ error: err.message });
                                        });
                                    });


                                }

                            })
                            .catch((err) => {
                                res.status(500).json({ error: err.message });
                            });
                            
                        }
                    })
                
                }

            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });

        }
    
    })
    
};


exports.delete_film = (req, res) => {
    const repo = new MovieRepository(db);

    //check if id exist
    repo.get_object_by_id('films', req.params.id) 
    .then((result) => {
        if (!result){
            res.status(404).json({
                success: false,
                data: 'Unable to find the data requested',
            })
        }else{
           
            // suppression de l'association films actor
            repo.delete_films_actors(req.params.id)
            .then(() => {
                
                // suppression du film
                repo.delete_object('films', req.params.id)
                .then(() => {
                    res.status(204)
                        .json({
                            success: true,
                        });
                })
                .catch((err) => {
                    res.status(500).json({ error: err.message });
                }); 

            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });

        }
    
    })
    
};



getResult = (result, response) => {
    if (!result){
        response.status(404).json({
            success: false,
            data: 'Unable to find the data requested',
        });
    }else{
        response.json({
            success: true,
            data: result,
        });
    }
}
