/* eslint-disable no-console */
/* eslint-disable func-names */
class MovieRepository {
    constructor(database) {
        this.database = database;
    }

    create_actor(data) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO actors (first_name, last_name, date_of_birth, date_of_death) VALUES (?,?,?,?)',
                Object.values(data),
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                },
            );
        });
    };

    update_actor(data) {
        return new Promise((resolve, reject) => {
            this.database.run(
                `UPDATE actors
                 SET first_name = ?,
                    last_name = ?,
                    date_of_birth = ?,
                    date_of_death = ?
                 WHERE id = ?`,
                Object.values(data),
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );
        });
    };
    
    create_genre(data) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO genres (name) VALUES (?)',
                Object.values(data),
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                },
            );
        });
    };

    get_object_list(table) {
        return new Promise((resolve, reject) => {
            this.database.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    get_object_by_id(table, id) {
        return new Promise((resolve, reject) => {
            this.database.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    };

    delete_object(table, id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                `DELETE FROM ${table} WHERE id = ?`, [id], (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                },
            );
        });
    }

    get_items(table, item, condition) {
        return new Promise((resolve, reject) => {
            var query = `SELECT ${item} FROM ${table} WHERE ${condition}`;
            this.database.all(query, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    get_actors_by_film_id(film_id) {
        return new Promise((resolve, reject) => {
            var query = `SELECT * from actors WHERE id IN (SELECT actor_id FROM films_actors WHERE film_id = ${film_id})`;
            this.database.all(query, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    get_actors_by_ids(ids) {
        return new Promise((resolve, reject) => {
            if(!ids.length){
                resolve([]);
            }
            else{
                var query = `SELECT * from actors WHERE id IN (${ids.join()})`;
                this.database.all(query, [], (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            }
        });
    };

    create_film(data) {

        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO films (name, synopsis, release_year, genre_id) VALUES (?,?,?,?)',
                Object.values(data),
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                },
            );
        });
    };

    create_films_actors(film_id, actor_id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO films_actors (film_id, actor_id) VALUES (?,?)',
                [film_id, actor_id],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                },
            );
        });
    };

    delete_films_actors(film_id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                `DELETE FROM films_actors WHERE film_id = ?`, [film_id], (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                },
            );
        });
    }

    update_film(data) {
        return new Promise((resolve, reject) => {
            this.database.run(
                `UPDATE films
                 SET name = ?,
                    synopsis = ?,
                    release_year = ?,
                    genre_id = ?
                 WHERE id = ?`,
                Object.values(data),
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );
        });
    };

}

module.exports = MovieRepository;
