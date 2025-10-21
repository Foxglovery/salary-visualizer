

//functional component for displaying the input 
// eslint-disable-next-line react/prop-types
function SalaryInput({ setHourlyWage }) {
    

    const handleChangeWage = (event) => {
        setHourlyWage(parseFloat(event.target.value) || 0)
    }

  return (
    <>
    <div className='salary-input'>
      <label htmlFor='wage'>Hourly Wage </label>
        <input 
        type='number'
        id='wage'
        
        onChange={handleChangeWage}
        min={0}
        step={0.01}
        />
    </div>


    </>
    
  )
}

export default SalaryInput