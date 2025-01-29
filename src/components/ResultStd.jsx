import React from 'react'

const ResultStd = () => {
  return (
    <div className='result'>
           <div className="table-container">
      <div className="container" id=''>
        <table className='table'>
          <thead className='thead'>
            <tr className='head '>
              <th>ID</th>
              <th>Subject</th>
              <th>Maximum Score </th>
              <th>Score</th>
             
            </tr>
          </thead>
          <tbody>
            <tr className='body'>
              <td>1</td>
              <td>sub_name</td>
              <td>max_score</td>
              <td>score</td>
             
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default ResultStd