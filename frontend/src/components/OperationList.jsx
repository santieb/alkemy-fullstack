import React from 'react'
import Operation from '../components/Operation'
import useOperation from '../hooks/useOperation'

const OperationList = ({ setOpenModal }) => {
  const { operations } = useOperation()
  return (
    <div>
      <ul className="divide-y divide-gray-200 lg:grid lg:grid-cols-2">
        {operations && operations.map(operation => <Operation setOpenModal={setOpenModal} key={operation.id} operation={operation} />)}
      </ul>
    </div>
  )
}

export default OperationList
