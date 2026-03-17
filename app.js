const express = require('express');
const errorMiddleware = require('./middleware/error_middleware');

const userRoutes = require('./routes/user_routes');
const postRoutes = require('./routes/post_routes');

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);



const categoryRoutes = require('./routes/category_routes');
app.use('/api/categories', categoryRoutes);




app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Global Error Middleware
app.use(errorMiddleware);

module.exports = app;