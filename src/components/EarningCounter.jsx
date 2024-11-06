import React, { useEffect, useState } from 'react'

// functional component for displaying the earnings

function EarningCounter({ hourlyWage }) {
    const [earnings, setEarnings] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
           setEarnings((prevEarnings) => prevEarnings + hourlyWage / 3600); 
        }, 1000);

        return () => clearInterval(interval);
    },[hourlyWage])
  return (
    <div className='counter-btn'>
        <h2>Earnings: ${earnings.toFixed(2)}</h2>
    </div>
  )
}

export default EarningCounter
