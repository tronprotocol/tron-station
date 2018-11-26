import { createMuiTheme } from "@material-ui/core/styles";

const muiTheme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&:hover:not($disabled):not($error):not($focused):before": {
          borderBottom: "1px solid rgba(0, 0, 0, 0.42)"
        },
        "&:hover:not($disabled):not($error):not($focused):after": {
          borderBottom: "1px solid rgba(0, 0, 0, 0.42)"
        },
        "&:after": {
          borderBottom: "2px solid rgba(180, 4, 4)"
        }
      }
    },
    MuiNativeSelect: {
      select: {
        "&:focus": {
          background: "transparent"
        }
      }
    }
  }
});

export default muiTheme;
