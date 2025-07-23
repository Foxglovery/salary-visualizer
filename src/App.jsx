import { useState } from 'react'
import './App.css'
import dollarBill from './assets/10-dollar.png'
import SalaryInput from './components/SalaryInput'
import EarningCounter from './components/EarningCounter'
// import hourlyWage from '../src/components/SalaryInput' // This import is not needed

const ELEMENT_COLORS = {
  Earth: '#4B8F29',   // green
  Water: '#2196F3',   // blue
  Fire: '#FF5722',    // orange/red
  Air: '#B0E0E6'      // light blue/gray
};

function App() {
  const [hourlyWage, setHourlyWage] = useState(0);
  const [element, setElement] = useState('Earth');

  const textColor = ELEMENT_COLORS[element];

  return (
    <>
      <div className='main' style={{ color: textColor }}>
        <h1>Salary Visualizer</h1>
        <div>
          <p className='instruction-p'>
            Enter your hourly wage to visualize how the trickle of time equates to your wallet
          </p>
        </div>
        <div className='element-picker'>
          <span>Pick an element: </span>
          {Object.keys(ELEMENT_COLORS).map((el) => (
            <button
              key={el}
              onClick={() => setElement(el)}
              style={{
                backgroundColor: element === el ? ELEMENT_COLORS[el] : '#1a1a1a',
                color: element === el ? '#fff' : '#ccc',
                margin: '0 0.5em',
                border: element === el ? '2px solid #fff' : '1px solid #444',
                fontWeight: element === el ? 'bold' : 'normal',
                transition: 'all 0.2s',
              }}
            >
              {el}
            </button>
          ))}
        </div>
        <SalaryInput setHourlyWage={setHourlyWage} />
        <EarningCounter hourlyWage={hourlyWage} />
        <img src={dollarBill} alt='Dollar Bill' className='dollar-bill'/>
        <img src={dollarBill} alt='Dollar Bill' className='dollar-bill'/>
        <img src={dollarBill} alt='Dollar Bill' className='dollar-bill'/>
      </div>
    </>
  )
}

export default App
