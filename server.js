const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const config = require('./variables')

const app = express();

const events = [];

app.use(bodyParser.json())

app.use('/graphql', graphQlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return events;
    },
    createEvent: (args) => {
      const event = {
        _id: Math.random().toString(),
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date
      }
      events.push(event)
      return event;
    }
  },
  graphiql: true
}))

mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0-o8qiw.mongodb.net/test?retryWrites=true&w=majority`).then(() => {
  console.log('connected to database!!!')
  app.listen(5000);
}).catch(err => {
  console.log(err)
})


