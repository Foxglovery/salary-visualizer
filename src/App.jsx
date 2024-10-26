import { useState } from 'react'
import './App.css'
import dollarBill from './assets/10-dollar.png'
import SalaryInput from './components/SalaryInput'
import EarningCounter from './components/EarningCounter'
import hourlyWage from '../src/components/SalaryInput'

function App() {
  const [hourlyWage, setHourlyWage] = useState(0);

  return (
    <>
      
      <h1>Salary Visualizer</h1>
      <img src={dollarBill} alt='Dollar Bill' className='dollar-bill'/>
      <SalaryInput  setHourlyWage={setHourlyWage} />
      <EarningCounter hourlyWage = {hourlyWage}/>
      
    </>
  )
}

export default App
