import { useEffect, useState } from "react";
import { supabase, Database } from "./supabase";

type Student = Database['public']['Tables']['student']['Row'];
type School = Database['public']['Tables']['school']['Row'];

export function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setdob] = useState('');
  const [school, setSchool] = useState('');

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [foundedIn, setFoundedIn] = useState('');

  async function fetchStudents() {
    // const response = await supabase.from('student').select('*'); //Select all
    const response = await supabase.from('student').select('*');
    if (response.data) {
      setStudents(response.data);
    }
  };
  async function fetchSchools() {
    // const response = await supabase.from('student').select('*'); //Select all
    const response = await supabase.from('school').select('*');
    if (response.data) {
      setSchools(response.data);
    }
  };

  async function handleDelete(id: any, database: string) {
    await supabase.from(database).delete().eq('id', id);
    await fetchStudents();
    await fetchSchools();
  }
  async function createStudent() {
    await supabase.from('student').insert({
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      school: school,
    });
    await fetchStudents();
  }
  async function createSchool() {
    await supabase.from('school').insert({
      title: title,
      address: address,
      foundedIn: foundedIn,
    });
    await fetchSchools();
  }

  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, []);
  return (
    <div>
      <div>
        <input type="text" placeholder="first name" onChange={(event) => setFirstName(event.target.value)}/>
        <input type="text" placeholder="last name" onChange={(event) => setLastName(event.target.value)}/>
        <input type="date" placeholder="dob" onChange={(event) => setdob(event.target.value)}/>
        <select defaultValue='' onChange={(event) => setSchool(event.target.value)}>
          <option key={0}></option>
          {schools.map((value) => (
            <option value={value.id} key={value.id}>{value.title}</option>
          ))}
        </select>
        <button onClick={createStudent}>Add</button>
      </div>
      
      <div>
        <input type="text" placeholder="title" onChange={(event) => setTitle(event.target.value)}/>
        <input type="text" placeholder="address" onChange={(event) => setAddress(event.target.value)}/>
        <input type="text" placeholder="founding date" onChange={(event) => setFoundedIn(event.target.value)}/>
        <button onClick={createSchool}>Add</button>
      </div>
      
      <h1>Students</h1>
      {students.map((value, index) => {
        return (
          <div key={index}>
            <p>{value.firstName} {value.lastName}</p>
            <button onClick={() => handleDelete(value.id, 'student')}>Delete</button>
          </div>
        )
      })}
       {schools.map((value, index) => {
        return (
          <div key={index}>
            <p>{value.title}</p>
            <button onClick={() => handleDelete(value.id, 'school')}>Delete</button>
          </div>
        )
      })}
    </div>
  );
};