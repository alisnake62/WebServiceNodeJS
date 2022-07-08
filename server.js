const express = require("express");
const bodyParser = require('body-parser');

const movieRoutes = require('./routes/movie');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

app.use(function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'No credentials sent in the header!' });
    }
    if(req.headers.authorization != 'Bearer 8f94826adab8ffebbeadb4f9e161b2dc') {
        return res.status(401).json({ error: 'Bad API Key!!!!' });
    }
    next();
});

//Basic Route
app.get('/', (req, res) => {
    res.json({message: 'Hello World'});
});

// Routes "Movie"
app.use('/api', movieRoutes);

app.get('*', function(req, res){
    res.json({message: 'URL NOT FOUND'}, 404);
});
