import React, { useRef, useState } from "react";
import classnames from "classnames/bind";
import styles from "./style.module.scss";
import PropTypes from "prop-types";

// components
import ColorButton from "./ColorButton";

// lib
import { v4 as uuidv4 } from "uuid";

// utils
import { LIST_ACTION } from "../../TodoList/useTaskReducer";

const cx = classnames.bind(styles);

AddList.propTypes = {
  taskDispatch: PropTypes.func,
};

const colorList = ["red", "yellow", "green"];

export default function AddList({ taskDispatch }) {
  const [selectedColor, setSelectedColor] = useState("red");
  const inputRef = useRef();

  const addList = (e) => {
    e.preventDefault();
    const inputValue = inputRef.current.value.trim();
    if (inputValue) {
      taskDispatch({
        type: LIST_ACTION.ADD_LIST,
        payload: {
          listTitle: inputValue,
          listId: uuidv4(),
          colorType: selectedColor,
        },
      });
      inputRef.current.value = "";
      inputRef.current.blur();
    }
  };
  return (
    <div className={cx("add-list")}>
      <div className={cx("color-picker")}>
        {colorList.map((color, index) => (
          <ColorButton
            key={index}
            colorType={color}
            handleColor={setSelectedColor}
            selectedColor={selectedColor}
          />
        ))}
      </div>
      <form onSubmit={addList}>
        <input
          id="addList"
          type="text"
          placeholder="Add a list"
          ref={inputRef}
          onBlur={() => (inputRef.current.value = "")}
        />
        
      </form>
    </div>
  );
}
