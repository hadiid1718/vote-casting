import React from 'react'
import { Link } from 'react-router-dom'

const Congrates = () => {
  return (
    <>
      <section className="congrates">
        <div className="container congrates__container">
          <h2>Thank you for yourr vote!</h2>
          <p>Your vote now added to your candidate's vote count. You will be redirected shortly to see the new result.</p>
          <Link to='/results' className='btn sm primary'>See Result</Link>
        </div>
      </section>
    </>
  )
}

export default Congrates
