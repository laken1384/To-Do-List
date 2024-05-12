import React, { useState, useRef } from "react";
import styles from "./style.module.scss";
import classnames from "classnames/bind";
import PropTypes from 'prop-types'

// components
import TodoItem from "./TodoItem";

// lib
import { v4 as uuidv4 } from 'uuid';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { MdDelete, MdModeEdit } from 'react-icons/md';

// utils
import { LIST_ACTION, TASK_ACTION } from '../../TodoList/useTaskReducer';

Panel.propTypes = {
    listTitle: PropTypes.string,
    listId: PropTypes.string,
    children: PropTypes.any,
    colorType: PropTypes.string,
    listIndex: PropTypes.number,
    taskDispatch: PropTypes.func
}

const cx = classnames.bind(styles);

export default function Panel(props) {
  const { listTitle, listId, colorType, children, listIndex, taskDispatch } = props;
  const [isEditing, setIsEditing] = useState(false);
  const listRef = useRef();
  const taskRef = useRef();

  const editList = (e) => {
    e.preventDefault();
    const newValue = listRef.current.value.trim();

    if(!newValue) {
      return;
    }else if(newValue !== listTitle){
      taskDispatch({
        type: LIST_ACTION.EDIT_LIST,
        payload: {listTitle: newValue, listId, colorType}
      })
      
    }
    setIsEditing(false);
  }

  const deleteList = () => {
    taskDispatch({
      type: LIST_ACTION.DELETE_LIST,
      payload: listId
    })
  }



  const addTask = (e) => {
    e.preventDefault();
    const newValue = taskRef.current.value.trim();
    if (newValue) {
      taskDispatch({
        type: TASK_ACTION.ADD_TASK,
        list: listId,
        payload: {taskTitle: newValue,taskId: uuidv4()} 
      });
    }
    taskRef.current.value = '';
    taskRef.current.blur();
  };


  return (

    <Draggable draggableId={listId} index={listIndex}>
      {(provided) => (
      <div
        className={cx("panel", colorType)}
        ref={provided.innerRef}
          {...provided.draggableProps}   
      >
        <div className={cx("header")}
        {...provided.dragHandleProps}
        >
          {isEditing ? 
            <form onSubmit={editList}>
                <input
                  type="text"
                  defaultValue={listTitle}
                  autoFocus
                  ref={listRef}
                  onBlur={() => setIsEditing(false)}/>
                </form>
            : 
            <span>{listTitle}</span>
          }
          <div className={cx('actions',{ hidden: isEditing })}>
            <div className={cx('edit','btn')} onClick={() => setIsEditing(true)} ><MdModeEdit /></div>
            <div className={cx('remove','btn')} onClick={deleteList} ><MdDelete /></div>
          </div>
        </div>
        
        <Droppable droppableId={listId}>
          {(provided) => (
            <div className={cx("body")}
              ref={provided.innerRef} 
              {...provided.droppableProps}
            >
                {children}
                {provided.placeholder}
            </div>
          )} 
        </Droppable>

        <div className={cx('add-item')}>
          
          <form onSubmit={addTask}>
            <input
              type='text'
              placeholder='Add a task'
              ref={taskRef}
              onBlur={() => taskRef.current.value = ''}
            />
          </form>
        </div>      
      </div>
    )}
    </Draggable>
  )
  
}

Panel.Item = TodoItem;
