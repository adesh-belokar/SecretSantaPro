import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import _ from "lodash";
import "../Pages/SecretSanta.css";

const SecretSanta = () => {
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // Function to handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setEmployees(result.data);
      },
    });
  };

  // Function to assign Secret Santa pairs
  const assignSecretSanta = () => {
    let shuffled = _.shuffle(employees);
    let assignedPairs = [];
    
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];
      assignedPairs.push({
        Employee_Name: giver.Employee_Name,
        Employee_EmailID: giver.Employee_EmailID,
        Secret_Child_Name: receiver.Employee_Name,
        Secret_Child_EmailID: receiver.Employee_EmailID,
      });
    }
    setAssignments(assignedPairs);
  };

  // Function to download the assignments as CSV
  const downloadCSV = () => {
    const csvData = Papa.unparse(assignments);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "secret_santa_assignments.csv");
  };

  return (
    <div className="container">
      <h2 className="title">Secret Santa Assignment</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} className="file-input" />
      <button onClick={assignSecretSanta} className="btn assign-btn">Assign</button>
      <button onClick={downloadCSV} className="btn download-btn">Download CSV</button>
      
      <table className="table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Employee Email</th>
            <th>Secret Child Name</th>
            <th>Secret Child Email</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index}>
              <td>{assignment.Employee_Name}</td>
              <td>{assignment.Employee_EmailID}</td>
              <td>{assignment.Secret_Child_Name}</td>
              <td>{assignment.Secret_Child_EmailID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecretSanta;
