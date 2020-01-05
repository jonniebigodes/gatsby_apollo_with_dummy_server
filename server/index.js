const express = require("express");
const { ApolloServer, gql, UserInputError } = require("apollo-server-express");
const models = require("./models");
// schema is going to defined here for simplicity, could be added into separate files and then imported

const typeDefs = gql`
  type Task {
    id: Int!
    title: String!
    state: String!
  }
  type Query {
    task(id: Int!): Task
    allTasks: [Task!]!
  }
  type Mutation {
    createTask(title: String!, state: String!): Task!
    deleteTask(id: Int!): String!
    updateTaskState(id: Int!, state: String!): Task!
    updateTaskTitle(id: Int!, title: String!): Task!
  }
`;

/**
 * resolvers to map to each query and mutation to a db action
 * the usage of "_" is to prevent node eslint annoying you that the argument is not used
 *
 */
const resolvers = {
  Query: {
    // fetches a single task
    async task(_, { id }, { models }) {
      // checks for param id
      if (!id) {
        return new UserInputError(
          "The task id needs to be supplied to the query"
        );
      }
      try {
        return models.Task.findByPk(id);
      } catch (error) {
        return new UserInputError("Something went wrong with the mutation");
      }
    },
    // fetches all tasks
    async allTasks(_, args, { models }) {
      return models.Task.findAll();
    }
  },
  Mutation: {
    // creates a task
    async createTask(_, { title, state }, { models }) {
        // checks for params
      if (!title){
        return new UserInputError("The task title needs to be supplied to the query");
      }
      if (!state){
        return new UserInputError("The task state needs to be supplied to the query");
      }
      try {
        return models.Task.create({
          title,
          state
        });
      } catch (error) {
        return new UserInputError("Something went wrong with the mutation");
      }
    },
    // delete a task
    async deleteTask(_, { id }, { models }) {
      console.log(`server id:${id}`)
      if (!id) {
        return new UserInputError(
          "The task id needs to be supplied to the query"
        );
      }
      try {
        await models.Task.destroy({
          where: { id },
          checkExistence: true
        });
        return "DONE";
      } catch (error) {
        return new UserInputError("Something went wrong with the mutation");
      }
    },
    // updates the task state
    async updateTaskState(_, { id, state }, { models }) {
        // checks for params
      if (!id) {
        return new UserInputError(
          "The task id needs to be supplied to the query"
        );
      }
      if (!state) {
        return new UserInputError(
          "The task state needs to be supplied to the query"
        );
      }
      try {
        await models.Task.update({ state: state }, { where: { id } });
        const updatedResult = await models.Task.findByPk(id);
        return updatedResult;
      } catch (error) {
        return new UserInputError("Something went wrong with the mutation");
      }
    },
     // updates the task title
     async updateTaskTitle(_,{id,title},{models}){
         // checks for params
      if (!id) {
        return new UserInputError(
          "The task id needs to be supplied to the query"
        );
      }
      if (!title) {
        return new UserInputError(
          "The task title needs to be supplied to the query"
        );
      }
      try {
        await models.Task.update({ title: title }, { where: { id } });
        const updatedResult = await models.Task.findByPk(id);
        return updatedResult;
      } catch (error) {
        return new UserInputError("Something went wrong with the mutation");
      }
     }
  }
};
//
// creates a new apolloserver instance
const server = new ApolloServer({ typeDefs, resolvers, context: { models } });
// creates a new express app
const app = express();
//
// adds express app as a middleware to graphql server
server.applyMiddleware({ app });

// sets the port 4000 to be used as endpoint ( you can use playground to test the queries in http://localhost:4000/graphql)
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
