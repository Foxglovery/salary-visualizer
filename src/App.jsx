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
      <div className='main'>
        <h1>Salary Visualizer</h1>
        <div>
          <p className='instruction-p'>
            Enter your hourly wage to visualize how the trickle of time equates to your wallet
          </p>
        </div>
      <SalaryInput  setHourlyWage={setHourlyWage} />
      <EarningCounter hourlyWage = {hourlyWage}/>
      <img src={dollarBill} alt='Dollar Bill' className='dollar-bill'/>
      <img src={dollarBill} alt='Dollar Bill' className='dollar-bill'/>
      <img src={dollarBill} alt='Dollar Bill' className='dollar-bill'/>
      
      </div>
      
    </>
  )
}

export default App
