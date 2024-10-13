import { useState, useEffect } from "react"
import './App.css'
import React from "react";
function App() {

  // declaring variables
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [todos, setTodos] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editDesc, setEditDesc] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const apiUrl = "http://localhost:8000/"
  // this function is for giving the title and desc
  function handlesubmit() {
    setError("");
    if (title.trim !== '' || desc.trim !== '') {
      // api calling
      fetch(apiUrl + "todos", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, desc })
      }).then((res) => {
        if (res.ok) {
          // add a item to the list
          setTodos([...todos, { title, desc }])
          setSuccess("Your items is added")
          setTimeout(() => {
            setSuccess("")
          }, 3000)
        }
        else {
          setError("Unable to add the item to the list");
          setTimeout(() => {
            setError("")
          }, 3000)
        }
      }).catch(() => {
        setError("Unable to create a todo");
      })

    }
  }
  // this function for getting the title and desc
  const getItems = () => {
    fetch(apiUrl + "todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res)
      })
  }

  useEffect(() => {
    getItems()
  }, [])

  const handleUpdate = () => {
    if (editTitle.trim !== '' || editDesc.trim !== ''){
      fetch(apiUrl+"todos/"+editId,{
        method: "PUT",
        headers:{
          "Content-Type" : "application/json"
        },
        body:JSON.stringify({title : editTitle,desc : editDesc})
      }).then((res) => {
        if(res.ok){
          // update the items to list 
          const updateTodos = todos.map((items) => {
            if(items._id == editId){
              items.title = editTitle;
              items.desc = editDesc;
            }
            return items
          })
          setTodos(updateTodos);
          setSuccess("Item update successfully")
          setTimeout(() => {
            setSuccess("");
          },3000)
          setEditId(-1);
        }
      })
    }
  }
  const handleEdit = (items) => {
    setEditId(items._id);
    setEditTitle(items.title);
    setEditDesc(items.desc);
  }
  const handleCancelEdit = () => {
    setEditId(-1); 
  }
  return (
    <>
      <div className="navbar-container">
        <h1>Todo Application with MERN</h1>
      </div>
      <div className="content-container">
        <div className="add-item-container">
          <h1>Add Items:</h1>
          {success && <p className="success">{success}</p>}
          <div className="inputbox-container">
            <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} name="username" id="username" placeholder="Add title.." />
            <input type="text" onChange={(e) => setDesc(e.target.value)} value={desc} name="password" id="password" placeholder="Add description" />
            <button type="submit" onClick={handlesubmit} >Add</button>
          </div>
          {error && <p className="danger">{error}</p>}
        </div>
        <div className="tasks-container">
          <h1>Tasks:</h1>
          <ul className="tasks-box">
            {
              todos.map((items) =>
                <li>
                  <div className="tasks-content">
                    {
                      editId == -1 || editId !== items._id
                        ?
                        <>
                          <span className="title-content">{items.title}</span>
                          <span className="disc-content">{items.desc}</span>
                        </>
                        :
                        <>
                          <input className="input-title" type="text" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} name="username" id="username" placeholder="Add title.." />
                          <input className="input-desc" type="text" onChange={(e) => setEditDesc(e.target.value)} value={editDesc} name="password" id="password" placeholder="Add description.." />
                        </>
                    }


                    <div className="tasks-btns">
                     
                      {
                        editId == -1 || editId !== items._id
                        ?
                        <>
                          <i onClick={() => handleEdit(items)} class="fa-regular fa-pen-to-square"></i>
                          <i class="fa-solid fa-trash trash"></i>
                        </>
                        :
                        <>
                          <i class="fa-solid fa-xmark" onClick={handleCancelEdit}></i>
                          <i class="fa-regular fa-floppy-disk fa-pen-to-square" onClick={handleUpdate}></i>
                        </>
                      }
                    </div>
                  </div>
                </li>)
            }
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
