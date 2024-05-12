import { useReducer } from "react";

// Initial state for task management
const initialState = {
  allList: [
    { listTitle: "代辦事項", listId: "001", colorType: "red" },
    { listTitle: "已完成事項", listId: "002", colorType: "green" }
  ],
  tasks: {
    "001": [
      { taskTitle: "健走十分鐘", taskId: "0011" },
      { taskTitle: "飲水3000cc", taskId: "0012" }
    ],
    "002": [
      { taskTitle: "買手機殼", taskId: "0021" }
    ]
  },
};

// Action types for lists
export const LIST_ACTION = {
  INITIAL_STATE: "initialState",
  ADD_LIST: "addList",
  EDIT_LIST: "editList",
  DELETE_LIST: "deleteList",
  MOVE_LIST: "moveList",
};

// Action types for tasks
export const TASK_ACTION = {
  ADD_TASK: "addTask",
  EDIT_TASK: "editTask",
  DELETE_TASK: "deleteTask",
  MOVE_TASK: "moveTask",
};

// Reducer function for managing tasks
const taskReducer = (taskInfo, action) => {
  switch (action.type) {
    case LIST_ACTION.INITIAL_STATE:
      return action.payload;

    case LIST_ACTION.ADD_LIST:
      return {
        allList: [...taskInfo.allList, action.payload],
        tasks: { ...taskInfo.tasks, [action.payload.listId]: [] },
      };

    case LIST_ACTION.EDIT_LIST:
      const editedList = taskInfo.allList.map(list => {
        if (list.listId === action.payload.listId) {
          return { ...list, listTitle: action.payload.listTitle };
        }
        return list;
      });
      return { ...taskInfo, allList: editedList };

    case LIST_ACTION.DELETE_LIST:
      const { [action.payload]: deletedList, ...remainingLists } = taskInfo.tasks;
      return {
        ...taskInfo,
        tasks: remainingLists,
        allList: taskInfo.allList.filter(list => list.listId !== action.payload),
      };

    case LIST_ACTION.MOVE_LIST:
      return {
        ...taskInfo,
        allList: action.payload,
      };

    case TASK_ACTION.ADD_TASK:
      return {
        ...taskInfo,
        tasks: {
          ...taskInfo.tasks,
          [action.list]: [...taskInfo.tasks[action.list], action.payload],
        },
      };

    case TASK_ACTION.EDIT_TASK:
      const editedTasks = taskInfo.tasks[action.list].map(task => {
        if (task.taskId === action.payload.taskId) {
          return { ...task, taskTitle: action.payload.taskTitle };
        }
        return task;
      });
      return {
        ...taskInfo,
        tasks: { ...taskInfo.tasks, [action.list]: editedTasks },
      };

    case TASK_ACTION.DELETE_TASK:
      const remainingTasks = taskInfo.tasks[action.list].filter(task => task.taskId !== action.payload);
      return {
        ...taskInfo,
        tasks: {
          ...taskInfo.tasks,
          [action.list]: remainingTasks,
        },
      };

    case TASK_ACTION.MOVE_TASK:
      return {
        ...taskInfo,
        tasks: action.payload,
      };

    default:
      return taskInfo;
  }
};

// Custom hook for managing tasks
export default function useTaskReducer() {
  const [taskInfo, taskDispatch] = useReducer(taskReducer, initialState);
  return [taskInfo, taskDispatch];
}
