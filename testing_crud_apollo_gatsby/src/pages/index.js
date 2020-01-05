import React from "react"
import gql from "graphql-tag"
import Task from '../components/Task'
import TaskAdd from '../components/addTask'
import { useQuery } from "@apollo/react-hooks"

// graphql query to fetch all the items (if you change it in the backend update it her)
const APOLLO_GET_ALL_TASKSQUERY = gql`
  {
    allTasks {
      id
      title
      state
    }
  }
`

export default () => {
  // destructures the loading, error states and the data fetched from the query
  const { loading, error, data } = useQuery(APOLLO_GET_ALL_TASKSQUERY)
  if (loading) {
    return (
      <div style={{ textAlign: "center", width: "600px", margin: "50px auto" }}>
        <p>Loading Tasks</p>
      </div>
    )
  }
  if (error) {
    return (
      <div style={{ textAlign: "center", width: "600px", margin: "50px auto" }}>
        <p>Something went wrong fetching the tasks: ${error.message}</p>
      </div>
    )
  }
  // destructures the result object obtained in the query and will iterate over the results.
  const { allTasks } = data
  return (
    <div style={{ textAlign: "center", width: "600px", margin: "50px auto",border:'2px solid rebeccapurple' }}>
      <h2>Task list</h2>
      {allTasks.map(item => (
        <Task key={item.id} infoTask={item}/>
      ))}
      <div style={{paddingTop:'3rem'}}>
        <TaskAdd/>
      </div>
    </div>
  )
}
