import React from 'react';
import './assign.css';
import { MdDelete } from "react-icons/md";

const AssignmentStd = () => {
  return (
    <div className="table-container">
      <div className="container" id='assign'>
        <table className='table'>
          <thead className='thead'>
            <tr className='head '>
              <th>SI No</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Download</th>
              <th>Submit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr className='body'>
              <td>1</td>
              <td>OOPs</td>
              <td>Data Structure Assignment</td>
              <td><button className='dwnld px-3 py-2'>Download</button></td>
              <td><button className='upload px-3 py-2'>Upload</button></td>
              <td><button className='delete px-3 py-2'>Delete</button></td>
            </tr>
            <tr className='body'>
              <td>1</td>
              <td>OOPs</td>
              <td>Data Structure Assignment</td>
              <td><button className='dwnld  px-3 py-2'>Download</button></td>
              <td><button className='upload p-2'>Upload</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentStd;
