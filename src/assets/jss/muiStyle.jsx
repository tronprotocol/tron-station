import { createMuiTheme } from "@material-ui/core/styles";

const muiTheme = createMuiTheme({
  overrides: {
    MuiInput: {
      focused: {
        background: "rgba(255, 255, 255, 1)"
      },
      underline: {
        "&:hover:not($disabled):not($error):not($focused):before": {
          borderBottom: "1px solid rgba(0, 0, 0, 0.42)"
        },
        "&:hover:not($disabled):not($error):not($focused):after": {
          borderBottom: "1px solid rgba(0, 0, 0, 0.42)"
        }
      }
    },
    MuiNativeSelect: {
      select: {
        "&:focused:before": {
          background: "rgba(255, 255, 255, 1)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.42)"
        },
        "&:focused:after": {
          background: "rgba(255, 255, 255, 1)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.42)"
        }
      }
    }
  }
});

export default muiTheme;
