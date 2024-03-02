import React from 'react'
import Spinner from './components/Spinner'

const loading = () => {
  return (
    <div><h2 className="mt-6 text-center text-3xl font-extrabold text-pink-400">
    Loading {<Spinner />}
  </h2></div>
  )
}
export default loading