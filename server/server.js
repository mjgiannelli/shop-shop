const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
app.use('/images', express.static(path.join(__dirname, '../client/images')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`Use GraphQL at https://${process.env.RENDER_EXTERNAL_URL}${graphqlPath}`);
    } else {
      console.log(`Use GraphQL at http://localhost:${PORT}${graphqlPath}`);
    }
  });
});
