import React from "react";
import classnames from "classnames/bind";
import styles from "./style.module.scss";
import PropTypes from "prop-types";
import "./snackbar.scss";

// lib
import Snackbar from "@material-ui/core/Snackbar";

const cx = classnames.bind(styles);

SaveButton.propTypes = {
  saveAll: PropTypes.func,
};

export default function SaveButton({ saveAll }) {
  const [open, setOpen] = React.useState(false);

  const handleSave = () => {
    saveAll();
    setOpen(true);
  };

  return (
    <div className={cx("save")}>
      <button onClick={handleSave}>Save</button>
      <Snackbar className={cx("toast")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={1000}
        message="Saved successfully"
      ></Snackbar>
    </div>
  );
}
