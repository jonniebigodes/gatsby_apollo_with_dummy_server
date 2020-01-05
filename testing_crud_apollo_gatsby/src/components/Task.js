import React, { useState } from "react"
import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"


// graphql query to fecth all of the tasks(this will be used by the cache)
const APOLLO_GET_ALL_TASKSQUERY = gql`
  {
    allTasks {
      id
      title
      state
    }
  }
`
// delete task mutation
const APOLLO_REMOVE_TASK_MUTATION = gql`
  mutation taskRemove($taskId: Int!) {
    deleteTask(id: $taskId)
  }
`
// update task title mutation
const APOLLO_UPDATE_TASK_TITLE_MUTATION = gql`
mutation titleUpdate($taskId:Int!,$taskTitle:String!){
  updateTaskTitle(id:$taskId,title:$taskTitle){
    id
    title
  }
}
`
// update task state mutation
const APOLLO_UPDATE_TASK_STATE_MUTATION= gql`
mutation StateUpdate($taskId:Int!,$taskState:String!){
  updateTaskState(id:$taskId,state:$taskState){
    id
    state
  }
}
`

/**
 * Functional compoent to display the task information and delete it and edit it
 * @param {Object} infoTask is the state of the task 
 */
const Task = ({ infoTask }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [taskTitle, setTaskTitle] = useState(infoTask.title)
  const [taskState, setTaskState] = useState(infoTask.state)

  // defines the mutation to delete the task
  const [taskRemoveMutation] = useMutation(APOLLO_REMOVE_TASK_MUTATION)

  const [taskTitleUpdateMutation] = useMutation(
    APOLLO_UPDATE_TASK_TITLE_MUTATION
  )
  const [taskStateUpdateMutation]= useMutation(
    APOLLO_UPDATE_TASK_STATE_MUTATION
  )

  // function that will update the title of the task
  const updateTitle = () => {
    // calls the function defined above in the useMutation implementation regarding the title
    taskTitleUpdateMutation({
      variables: { taskId: infoTask.id, taskTitle: taskTitle },
      optimisticResponse: null,
      update: cache => {
        // fetches the data stored in the cache based on the query 
        const existingTasks = cache.readQuery({
          query: APOLLO_GET_ALL_TASKSQUERY,
        })
        // updates the task
        const updatedTasks = existingTasks.allTasks.map(x => {
          if (x.id === infoTask.id) {
            return {
              ...x,
              title: taskTitle,
            }
          } else {
            return x
          }
        })
        // writes back the query
        cache.writeQuery({
          query: APOLLO_GET_ALL_TASKSQUERY,
          data: { allTasks: updatedTasks },
        })
      },
    })
  }
  
  // function to update the task state
  const updateState=()=>{
    // calls the function defined above in the useMutation implementation regarding the state
    taskStateUpdateMutation({
      variables:{taskId:infoTask.id,taskState:taskState},
      optimisticResponse:null,
      update:cache=>{
        // retrieves the cached data based on the query
        const existingTasks= cache.readQuery({
          query:APOLLO_GET_ALL_TASKSQUERY
        })
        // updates the information
        const updatedTasks= existingTasks.allTasks.map(x=>{
          if (x.id===infoTask.id){
            return{
              ...x,
              state:taskState
            }
          }
          else{
            return x
          }
        })
        // writes back into the cache the updated information 
        cache.writeQuery({
          query:APOLLO_GET_ALL_TASKSQUERY,
          data:{allTasks:updatedTasks}
        })
      }
    })
  }
  // function to check which piece of data was changed and call the necessary function
  // if both items are changed and you try to updated it only the first one will be updated. 
  //To avoid adding more complexity to this i left it like so, adjust your logic accordingly
  const updateTaskData = () => {
    if (taskTitle !== infoTask.title) {
      updateTitle()
    } else if (taskState !== infoTask.state) {
      console.log(`is double update`)
      updateState()
    }
    setIsEdit(prevState => !prevState)
  }
  // function to handle the task deletion
  const removeTask = () => {
    // calls the function defined above in the useMutation implementation deletion
    taskRemoveMutation({
      variables: { taskId: infoTask.id },
      optimisticResponse: "DONE",
      update: cache => {
        // retrieves the cached data based on the query
        const existingTasks = cache.readQuery({
          query: APOLLO_GET_ALL_TASKSQUERY,
        })
        
        console.log(
          `on delete existing Tasks:${JSON.stringify(existingTasks, null, 2)}`
        )
        // filters the dat
        const updatedTasks = existingTasks.allTasks.filter(
          x => x.id !== infoTask.id
        )
        console.log(
          `on delete new Tasks:${JSON.stringify(updatedTasks, null, 2)}`
        )
        // writes back the data into the cache based on the query
        cache.writeQuery({
          query: APOLLO_GET_ALL_TASKSQUERY,
          data: { allTasks: updatedTasks },
        })
      },
    })
  }
  return (
    <div>
      {isEdit ? (
        <form
          onSubmit={e => {
            e.preventDefault()
            updateTaskData()
          }}
          style={{ border: "2px solid tomato" }}
        >
          <legend>Updating Task Information</legend>
          <fieldset>
            <label htmlFor="title">Name:</label>
            <input
              id="title"
              type="text"
              name="title"
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
            />
            <label htmlFor="taskState">State:</label>
            <input
              id="taskState"
              type="text"
              name="taskState"
              value={taskState}
              onChange={e => setTaskState(e.target.value)}
            />
            <button
              type="submit"
              disabled={
                taskTitle === infoTask.title && taskState === infoTask.state
              }
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsEdit(prevState => !prevState)}
            >
              Cancel
            </button>
          </fieldset>
        </form>
      ) : (
        <div>
          <p>Title: {infoTask.title}</p>
          <p>Task State:{infoTask.state}</p>
          <button
            type="button"
            onClick={() => setIsEdit(prevState => !prevState)}
          >
            Edit
          </button>
          <button type="button" onClick={() => removeTask()}>
            Delete Task
          </button>
        </div>
      )}
    </div>
  )
}

export default Task
