import React, { useEffect } from "react";
import classnames from "classnames/bind";
import styles from "./style.module.scss";

// Components
import Clock from "../base/Clock";
import AddList from "../base/AddList";
import Panel from "@/base/Panel"; // Assuming this path is correctly configured
import SaveButton from "../base/SaveButton";

// Libraries
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Utils
import useTaskReducer, { TASK_ACTION, LIST_ACTION } from "./useTaskReducer";

const cx = classnames.bind(styles);

function TodoList() {
  // State management using custom hook
  const [taskInfo, taskDispatch] = useTaskReducer();

  // Function to handle drag and drop
  const handleDragEnd = (dragInfo) => {
    const { destination, source, type } = dragInfo;

    // If there's no destination, do nothing
    if (!destination) {
      return;
    }

    // Handle dragging panels
    if (type === "panel") {
      const updatedPanelList = [...taskInfo.allList];
      const draggedPanel = { ...updatedPanelList[source.index] };

      updatedPanelList.splice(source.index, 1);
      updatedPanelList.splice(destination.index, 0, draggedPanel);

      taskDispatch({
        type: LIST_ACTION.MOVE_LIST,
        payload: updatedPanelList,
      });

      return;
    }

    // Handle dragging tasks
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // Do nothing if the task is dropped in the same position
    }

    const sourceList = [...taskInfo.tasks[source.droppableId]];
    const targetList = [...taskInfo.tasks[destination.droppableId]];

    if (destination.droppableId === source.droppableId) {
      // If the task is dropped within the same list
      const draggedTask = { ...sourceList[source.index] };

      sourceList.splice(source.index, 1);
      sourceList.splice(destination.index, 0, draggedTask);

      taskDispatch({
        type: TASK_ACTION.MOVE_TASK,
        payload: { ...taskInfo.tasks, [source.droppableId]: sourceList },
      });

      return;
    }

    // If the task is dropped in a different list
    targetList.splice(destination.index, 0, sourceList[source.index]);
    sourceList.splice(source.index, 1);

    taskDispatch({
      type: TASK_ACTION.MOVE_TASK,
      payload: {
        ...taskInfo.tasks,
        [source.droppableId]: sourceList,
        [destination.droppableId]: targetList,
      },
    });
  };

  // Function to save all tasks to localStorage
  const saveAllTasks = () => {
    localStorage.setItem("board", JSON.stringify(taskInfo));
  };

  // Effect to initialize state from localStorage
  useEffect(() => {
    if (localStorage.length) {
      taskDispatch({
        type: LIST_ACTION.INITIAL_STATE,
        payload: JSON.parse(localStorage.getItem("board")),
      });
    }
  }, [taskDispatch]);

  return (
    <div className={cx("container")}>
      {/* Component to add new lists */}
      <AddList taskDispatch={taskDispatch} />

      {/* Drag and drop context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="lists" direction="horizontal" type="panel">
          {(provided) => (
            <div
              className={cx("lists")}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {taskInfo.allList.map((listItem, index) => (
                <Panel
                  key={listItem.listId}
                  listIndex={index}
                  listTitle={listItem.listTitle}
                  listId={listItem.listId}
                  colorType={listItem.colorType}
                  taskDispatch={taskDispatch}
                >
                  {taskInfo.tasks[listItem.listId].map((taskItem, index) => (
                    <Panel.Item
                      key={taskItem.taskId}
                      itemIndex={index}
                      taskTitle={taskItem.taskTitle}
                      taskId={taskItem.taskId}
                      listId={listItem.listId}
                      colorType={listItem.colorType}
                      taskDispatch={taskDispatch}
                    />
                  ))}
                </Panel>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Button to save all tasks */}
      <SaveButton saveAll={saveAllTasks} />

      {/* Clock component */}
      <Clock />
    </div>
  );
}

export default TodoList;
