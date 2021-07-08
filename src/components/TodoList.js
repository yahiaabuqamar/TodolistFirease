import React from 'react';
import {useState,useEffect} from "react";
import Button from '@material-ui/core/Button';
import "./todo.css"
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import db from "./Firebase";
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 1080,
    backgroundColor: theme.palette.background.paper,
    margin:"auto"
  },
  inputTodo:{
      width:"100%",
      marginTop:30,
      maxWidth:1080,
      paddingLeft:14,
  },
  button: {
    margin: theme.spacing(1),
  },
  textInput:{
    width:"90%"
  }
}));

export default function TodoList() {
  const classes = useStyles();
  const [loading,setLoading]= useState(true)

  const [loadingAdding,setLoadingAdding]= useState(false)
  const [newTodo,setNewTodo] = useState("");
  const [todos,setTodos] = useState([])
  const [checked, setChecked] = useState([]);

  useEffect(()=>{
    const fetchData= ()=>{
      setLoading(true)
      db.collection("todos").onSnapshot((snapshot)=>{
        setTodos(snapshot.docs.map((doc)=>{ return {...doc.data(),id:doc.id} }))
        setLoading(false)
      },(error)=>{
        setLoading(false)
        console.log(error.message)
      })
    }
    fetchData()
  },[])

  const addTodo = async ()=>{
    
    setLoadingAdding(true)
    await db.collection("todos").add({
      todoText:newTodo,
      checked:false
    }).catch(error=>{
      console.log(error.message)
    })
    setNewTodo("")
    setLoadingAdding(false)
  }


  const deletTodo = async (idOfTodo)=>{
    await db.collection('todos').doc(idOfTodo).delete()
    .catch(error=>{
      console.log(error.message)
    })
  }

  const handleToggle = async (idOfTodo) => {
    await db.collection('todos').doc(idOfTodo).update({
      checked:!(todos.find(item => item.id === idOfTodo).checked)
    }).catch(error=>{
      console.log(error.message)
    })
  };
  
  return (
    <div className={classes.root}>
    <h1 className="text-center" style={{marginTop:"70px"}}>Todo List</h1>
    <List className={classes.root}>
      {todos.map((item) => {
        const index = todos.indexOf(item);
        const labelId = `checkbox-list-label-${index}`;

        return (
          <ListItem key={index} role={undefined} dense button onClick={()=>{handleToggle(item.id)}}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.checked}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${index + 1}- ${item.todoText}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={()=>{
                deletTodo(item.id)
              }}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
    {(todos.length<1 && !loading)?<h2 className="text-center">Add items</h2>:
    (loading)&&<h2 className="text-center">loading..</h2>}
    <div className={classes.inputTodo}>
    <TextField
        className={classes.textInput}
          value={newTodo}
          id="outlined-textarea"
          label="New Todo"
          placeholder="write here"
          multiline
          variant="outlined"
          onChange={(e)=>{
            setNewTodo(e.target.value)
          }}
        />
    <Button
        variant="contained"
        color="primary"
        className={classes.button}
        disabled={(!(newTodo) || loadingAdding)}
        onClick={()=>{
          addTodo()
        }}
      >
        add
      </Button>

    </div>
    
    </div>
  );
}