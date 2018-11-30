// ##############################
// // // RegularForms view styles
// #############################

import {
  cardTitle,
  successColor,
  dangerColor
} from "assets/jss/materialUI.jsx";

const regularFormsStyle = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  staticFormGroup: {
    marginLeft: "0",
    marginRight: "0",
    paddingBottom: "10px",
    margin: "8px 0 0 0",
    position: "relative",
    "&:before,&:after": {
      display: "table",
      content: '" "'
    },
    "&:after": {
      clear: "both"
    }
  },
  staticFormControl: {
    marginBottom: "0",
    paddingTop: "8px",
    paddingBottom: "8px",
    minHeight: "34px"
  },
  inputAdornment: {
    marginRight: "8px",
    position: "relative"
  },
  inputAdornmentIconSuccess: {
    color: successColor + "!important"
  },
  inputAdornmentIconError: {
    color: dangerColor + "!important"
  },
  selectBtn: {
    fontWeight: 500,
    paddingTop: "28px",
    fontSize: "15px"
  },
  linkBtn: {
    marginTop: "1px",
    fontWeight: "400",
    fontSize: "13px"
  },
  formulaIcon: {
    width: "15px",
    height: "15x",
    marginLeft: "5px",
    marginBottom: "15px",
    cursor: "pointer"
  },
  formulaContent: {
    margin: "20px"
  },
  labelHorizontal: {
    color: "rgba(0, 0, 0, 1)",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    paddingTop: "33px",
    "@media (min-width: 992px)": {
      // float: "right"
    }
  },
  dialog: {
    height: "600px",
    width: "500px"
  },
  dialogTableRow: {
    cursor: "Pointer"
  },
  searchBar: {
    backgroundColor: "#fff"
  },
  grow: {
    flexGrow: 1
  },
  search: {
    position: "relative",
    borderRadius: "2px",
    backgroundColor: "#fff",
    marginLeft: 0,
    width: "100%",
    borderBottom: "1px solid #000"
  },
  searchIcon: {
    width: "18px",
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "#000",
    width: "100%"
  },
  inputInput: {
    paddingLeft: "30px",
    width: "100%"
  },
  miniTableRow: {
    height: "0px"
  },
  required: {
    color: "red",
    textTransform: "lowercase"
  }
};

export default regularFormsStyle;
