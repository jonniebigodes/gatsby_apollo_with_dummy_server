import React, { useState } from "react"
import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"

// add task graphql mutation
const APOLLO_CREATE_TASK_MUTATION = gql`
mutation($title: String!, $state: String!) {
    createTask(title: $title,state:$state) {
        id
        title
        state
    }
  }
`

// get all tasks graphql query (this will be used by the caching mechanism)
const APOLLO_GET_ALL_TASKSQUERY = gql`
  {
    allTasks {
      id
      title
      state
    }
  }
`
//
// functional component to create a task
const TaskAdd = () => {
  const [title, setTitle] = useState("")
  const [taskState, setTaskState] = useState("")
  
  //function that will update the cache.
  // it will "fetch" the query results and then merge in the new object, obtained from running the mutation
  const updateCache = (cache, { data }) => {
    // grabs the cache based on the query
    const existingTasks = cache.readQuery({
      query: APOLLO_GET_ALL_TASKSQUERY,
    })
    
    // the result of the mutation
    const newTask = data.createTask
    // writes back data into the cache with the mutation result
    cache.writeQuery({
      query: APOLLO_GET_ALL_TASKSQUERY,
      data: { allTasks: [newTask, ...existingTasks.allTasks] },
    })
  }
  // implementation of the add task mutation
  const [createTask, { error, loading }] = useMutation(
    APOLLO_CREATE_TASK_MUTATION,
    {
      update: updateCache,
      onCompleted: resetInputs
    }
  )
  const resetInputs = () => {
    setTaskState("")
    setTitle("")
  }
  if (error) {
    console.log(`error adding Task:${error.message}`)
    return (
      <div>
        <p>Something went wrong while adding the task</p>
      </div>
    )
  }
  if (loading) {
    return (
      <div>
        <p>Wait a bit we're processing your request</p>
      </div>
    )
  }
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        createTask({ variables: { title: title, state: taskState } })
      }}
    >
      <legend>Task Information</legend>
      <fieldset>
        <label htmlFor="title">Name:</label>
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label htmlFor="taskState">State:</label>
        <input
          id="taskState"
          type="text"
          name="taskState"
          value={taskState}
          onChange={e => setTaskState(e.target.value)}
        />
        <button type="submit" disabled={title === "" && taskState === ""}>
          Add Task
        </button>
      </fieldset>
    </form>
  )
}
export default TaskAdd
