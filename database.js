/* eslint-disable no-console */
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (errConnect) => {
    if (errConnect) {
        // Cannot open database
        console.error(errConnect.message);
        throw errConnect;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(
            `CREATE TABLE 'genres' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' varchar(255) NOT NULL
            )`,
            (errQuery) => {
                if (errQuery) {
                console.log(errQuery);
                } else {
                // Table just created, creating some rows
                    const insert = 'INSERT INTO genres (id, name) VALUES (?,?)';
                    db.run(insert, [1, 'Western']);
                    db.run(insert, [2, 'Epouvante']);
                    db.run(insert, [3, 'Comedie']);
                }
            },
        );

        db.run(
            `CREATE TABLE 'actors' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'first_name' varchar(255) NOT NULL,
                'last_name' varchar(255) NOT NULL,
                'date_of_birth' date NOT NULL,
                'date_of_death' date
            )`,
            (errQuery) => {
                if (errQuery) {
                // Table already created
                } else {
                // Table just created, creating some rows
                    const insert = 'INSERT INTO actors (id, first_name, last_name, date_of_birth, date_of_death) VALUES (?,?,?,?,?)';
                    db.run(insert, [1, 'Clint', 'Eastwood', '1930-05-31', null]);
                    db.run(insert, [2, 'Carmen', 'Electra', '1972-04-20', null]);
                    db.run(insert, [3, 'Michel', 'Galabru', '1922-08-27', '2016-01-04']);
                    db.run(insert, [4, 'Daniel', 'Auteil', '1922-08-27', null]);
                }
            },
        );
        db.run(
            `CREATE TABLE 'films' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' varchar(255) NOT NULL,
                'synopsis' text NOT NULL,
                'release_year' int,
                'genre_id' int NOT NULL
            )`,
            (errQuery) => {
                if (errQuery) {
                // Table already created
                } else {
                // Table just created, creating some rows
                    const insert = 'INSERT INTO films (id, name, synopsis, release_year, genre_id) VALUES (?,?,?,?,?)';
                    db.run(insert, [1, 'Le Bon, la Brute et le Truand', 'Film qui claque !!!', '1968', 1]);
                    db.run(insert, [2, 'Scary Movie', 'Film qui claque aussi !!!', '2000', 2]);
                    db.run(insert, [3, 'Les Sous-doués', 'Film qui me rappelle mon quotidien a l EPSI !!!', '1980', 3]);
                }
            },
        );
        db.run(
            `CREATE TABLE 'films_actors' (
                'film_id' INTEGER,
                'actor_id' INTEGER,
                FOREIGN KEY (film_id) REFERENCES films(id),
                FOREIGN KEY (actor_id) REFERENCES actors(id),
                PRIMARY KEY ('film_id', 'actor_id')
            )`,
            (errQuery) => {
                if (errQuery) {
                // Table already created
                } else {
                // Table just created, creating some rows
                    const insert = 'INSERT INTO films_actors (film_id, actor_id) VALUES (?,?)';
                    db.run(insert, [1, 1]);
                    db.run(insert, [2, 2]);
                    db.run(insert, [3, 3]);
                    db.run(insert, [3, 4]);
                }
            },
        );
    }
});

module.exports = db;
