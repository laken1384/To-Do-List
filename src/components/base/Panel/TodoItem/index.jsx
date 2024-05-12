import React, { useState, useRef } from "react";
import styles from "./style.module.scss";
import classnames from "classnames/bind";

// lib
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";

// utils
import { TASK_ACTION } from "@/TodoList/useTaskReducer";
import PropTypes from "prop-types";

const cx = classnames.bind(styles);

TodoItem.propTypes = {
  taskTitle: PropTypes.string,
  taskId: PropTypes.string,
  colorType: PropTypes.string,
  listId: PropTypes.string,
  taskDispatch: PropTypes.func,
  itemIndex: PropTypes.number,
};

export default function TodoItem(props) {
  const { taskTitle, taskId, colorType, listId, itemIndex, taskDispatch } = props;
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef();

  const deleteItem = () => {
    taskDispatch({
      type: TASK_ACTION.DELETE_TASK,
      list: listId,
      payload: taskId,
    });
  };

  const editTask = (e) => {
    e.preventDefault();
    const newValue = inputRef.current.value.trim();
    if (!newValue) {
      return;
    } else if (newValue !== taskTitle) {
      taskDispatch({
        type: TASK_ACTION.EDIT_TASK,
        list: listId,
        payload: { taskTitle: newValue, taskId },
      });
    }
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={taskId} index={itemIndex}>
      {(provided) => (
        <div
          className={cx("item", colorType)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            <form onSubmit={editTask}>
              <input
                type="text"
                defaultValue={taskTitle}
                autoFocus
                ref={inputRef}
                onBlur={() => setIsEditing(false)}
              />
            </form>
          ) : (
            <span>{taskTitle}</span>
          )}
          <div className={cx("actions", { hidden: isEditing })}>
            <div
              className={cx("edit", "btn")}
              onClick={() => setIsEditing(true)}
            >
              <MdModeEdit />
            </div>
            <div className={cx("remove", "btn")} onClick={deleteItem}>
              <MdDelete />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
