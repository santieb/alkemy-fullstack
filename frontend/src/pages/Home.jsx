import React, { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate, useNavigate } from 'react-router-dom'
import operationService from '../services/operationService'
import Operation from '../components/Operation'
import Balance from '../components/Balance'
import Modalt from '../components/Modal'
import categoryService from '../services/categoryService'

export default function Home () {
  const [operations, setOperations] = useState([])
  const [allOperations, setAllOperations] = useState([])
  const [categories, setCategories] = useState('')
  const [page, setPage] = useState(1)
  const [categoryId, setCategoryId] = useState('')
  const [type, setType] = useState('')

  const { auth, logOut } = useAuth()

  const navigate = useNavigate()

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  const pathGetOperations = `operations?categoryId=${categoryId}&type=${type}&page=${page}`

  useEffect(() => {
    const getOperations = async () => {
      try {
        const response = await operationService.getOperations(`operations?page=${page}`, auth)
        if (response.status === 403) {
          navigate('/login')
          logOut()
        }

        if (response) return
        setAllOperations(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    getOperations()
  }, [])

  useEffect(() => {
    const getOperations = async () => {
      try {
        const response = await operationService.getOperations(pathGetOperations, auth)
        if (response.status === 403) {
          navigate('/login')
          logOut()
        }

        if (response) return
        setOperations(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    getOperations()
  }, [pathGetOperations])

  useEffect(() => {
    const getCategories = async () => {
      const response = await categoryService.getCategories(auth)
      setCategories(response.data)
    }
    getCategories()
  }, [])

  const deleteOperation = async (id) => {
    const res = await operationService.deleteOperation(id, auth)
    if (res.status === 200) {
      const operationsUpdated = operations.filter(operation => operation.id !== id)
      const allOperationsUpdated = allOperations.filter(operation => operation.id !== id)
      setOperations(operationsUpdated)
      setAllOperations(allOperationsUpdated)
    }
  }

  return (
    <div>
      <div className="bg-indigo-100 flex flex-col items-center justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold w-64 py-2 px-4 rounded-full m-4" onClick={() => logOut()}>Logout</button>
      </div>
    <div className="md:flex items-center justify-between bg-indigo-100 h-screen ">
      <Balance allOperations={allOperations} operations={operations}/>
      <div className="max-w mx-auto">
        <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 ">
          <div className="w-80 mx-40"></div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold leading-none">Operations</h3>
            <Modalt operations={operations} allOperations={allOperations} setAllOperations={setAllOperations} setOperations={setOperations} categories={categories}/>
          </div>
          <div>
            <h5 className="text-sm font-bold text-gray-700 tracking-wide py-4">
              Type
            </h5>
            <button className={type === '' ? 'px-4 bg-green-300' : 'px-4 bg-gray-200'} onClick={() => setType('')}>None</button>
            <button className={type === 'incomes' ? 'px-4 bg-green-300' : 'px-4 bg-gray-200'} onClick={() => setType('incomes')}>Incomes</button>
            <button className={type === 'expenses' ? 'px-4 bg-green-300' : 'px-4 bg-gray-200'} onClick={() => setType('expenses')}>Expenses</button>

            <div className="mt-8">
                <div className="flex justify-between items-center">
                  <div
                    className="text-sm font-bold text-gray-700 tracking-wide">
                    Category
                  </div>
                </div>
                <select onChange={({ target }) => setCategoryId(target.value)} value={categoryId} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500">
                  {categories && categories.map(category => <option key={category.id} value={category.id}>{category.categoryName}</option>)}
                  <option value=''>None</option>
                </select>
              </div>
          </div>
          <div>
            <ul className="divide-y divide-gray-200 lg:grid lg:grid-cols-2">
              {operations && operations.map(operation => <Operation key={operation.id} operation={operation} deleteOperation={deleteOperation}/>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
