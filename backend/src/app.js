const express = require('express');
const app = express();
const controller = require('./controller');
const cors = require('cors');
const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors(corsOptions));

// Define routes
app.get('/', (req, res) => {
  console.log('GET /');
  res.send('Hello, world!');
});
app.post('/', controller.postPaper);
app.get('/papers', controller.getPapers);
app.get('/papersWith/:title', controller.getPapersWithTitle);
app.get('/tags', controller.getTags); 
app.delete('/clean', controller.clean);
app.post('/graph', controller.getGraph);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// Export the app for use in other modules
module.exports = app;
