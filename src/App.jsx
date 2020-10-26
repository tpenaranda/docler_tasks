import React, { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { subscribe, unsubscribe } from 'pusher-redux'
import { useParams } from "react-router-dom"
import { useSelector } from 'react-redux'
import './App.scss'

const App = ({ history, location }) => {
  const { clientId } = useParams()
  const state = useSelector(state => state.main)

  const [input, setInput] = useState({
    value: '',
    error: false,
  })

  const pusherAction = useCallback((action, data = {}) => {
    const body = JSON.stringify({ ...data, client_id: clientId })
    setInput(state => ({ ...state, error: false, value: '' }))

    return fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/tasks/?action=${action}`, { method: 'POST', body }).then((r) => {
      if (r.status !== 200) {
        return Promise.reject(r)
      }
      return r.json()
    })
  }, [clientId])

  useEffect(() => {
    if (state.connected) {
      pusherAction('ping')
    }
  }, [state.connected, pusherAction])

  useEffect(() => {
    if (!clientId) {
      const savedClientId = localStorage.getItem('docler-client-id')

      if (savedClientId) {
        return history.push(savedClientId)
      }

      const newClientId = require('random-words')(3).join('-')
      localStorage.setItem('docler-client-id', newClientId)

      return history.push(newClientId)
    }

    subscribe(`docler-client-${clientId}`, 'state-changed', 'STATE_CHANGED', {})

    return () => {
      unsubscribe(`docler-client-${clientId}`, 'state-changed', 'STATE_CHANGED', {})
    }
  }, [clientId, history])

  const completedCount = state.tasks.filter(i => i.completed).length

  const handleInputChange = (e) => {
    setInput(state => ({...state, value: e.target.value}))
  }

  const handleAdd = () => {
    if (!input.value) {
      return setInput(state => ({...state, error: true}))
    }

    pusherAction('add', { name: input.value })
  }

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  const handleCheckboxChange = (item) => {
    pusherAction('set_completed', { id: item.id, completed: !item.completed })
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-600">
      <div className="shadow overflow-hidden rounded-md w-full max-w-xl m-2">
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-gray-600 sm:px-6 bg-white">
          <div>
          <h3 className="text-xl leading-6 font-medium text-gray-900">Docler Tasks</h3>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
            { state.tasks.length ? `Completed: ${completedCount} / ${state.tasks.length}` : 'No tasks.' }
          </p>
          </div>
          <div>
          <button onClick={() => pusherAction('clear_completed')} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 sm:px-6 mx-1 sm:mx-2 rounded">Clear Completed</button>
          </div>
        </div>
        <div>
          <dl>
            { state.tasks.map(task => (
              <div key={task.id} className={clsx('flex border-b border-gray-300 py-4 px-8 justify-between items-center', task.id % 2 ? 'bg-gray-100' : 'bg-gray-200')}>
                <dt className="leading-5 font-medium text-black capitalize break-anywhere pr-2 sm:pr-4">
                  { task.name }
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                  <label className="container">
                    <input type="checkbox" checked={task.completed} onChange={() => handleCheckboxChange(task)} />
                    <span className="checkmark" />
                  </label>

                </dd>
              </div>
            )) }
            { !state.connected && <p className="text-center pt-2 bg-white">Loading...</p>}
          </dl>
        </div>

        <div className="flex flex-wrap bg-white py-4 px-2">
          <label className="w-full block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 px-2 sm:px-4" htmlFor="new-task-input">Add a new task</label>
          <div className="w-full flex items-center justify-between mb-2 px-0 sm:px-2">
            <input onKeyPress={handleInputKeyPress} onChange={handleInputChange} value={input.value} className={clsx('w-full appearance-none block bg-gray-200 text-gray-700 border rounded py-2 px-4 mx-1 sm:mx-2 focus:outline-none focus:bg-white', input.error && 'border-red-500')} id="new-task-input" type="text" placeholder="My new task..." />
            <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:px-6 mx-1 sm:mx-2 rounded">Add</button>
          </div>
          { input.error && <p className="text-red-500 px-2 sm:px-4 text-xs italic">Please verify input value.</p> }
        </div>


      </div>
    </div>
  )
}

export default App
