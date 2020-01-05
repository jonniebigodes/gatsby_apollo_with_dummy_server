# What is this

This is a simple Gatsby website that will consume and change data to a graphql server using [Apollo]().

I took it a bit further were and introduced the caching mechanism, so that you could get a more complete picture.

## File/Folder structure

- `src\pages` - inside is where the pages that Gatsby will create when running the build.
- `src\components` - inside are some components that were created for the app.
   - `src\components\addTask.js` is a simple React form that will execute the mutation to add a task.
   - `src\components\Task.js` is the component that will display the task and also be responsible for:
      - Updating the task.
      - Deleting the task.

- `src\apollo\client.js` is where apollo client will be initialized and configured.
- `src\apollo\wrap-root-element` is a simple HOC (high order component) that will be injected into the Gatsby app which will allow you to work with the data as needed.
- `gatsby-browser` and `gatsby-ssr` are two files that Gatsby used handling changes in the browser. You can read up more about `gatsby-browser` [here](https://www.gatsbyjs.org/docs/api-files-gatsby-browser/) and `gatsby-ssr`[here](https://www.gatsbyjs.org/docs/api-files-gatsby-ssr/)