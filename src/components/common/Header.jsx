import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// material ui components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import MoreVert from "@material-ui/icons/MoreVert";
import ViewList from "@material-ui/icons/ViewList";
import Menu from "@material-ui/icons/Menu";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "components/common/Button.jsx";

// services
import netRouter from "services/netRouter.js";
import EventEmitter from "services/eventEmitter.js";
import calculator from "services/calculator.js";

// styles
import headerStyle from "assets/jss/headerStyle.jsx";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { net: netRouter.getNet().name };
  }
  componentDidMount() {
    this.getResourceInfo();
  }
  makeBrand() {
    var name;
    this.props.routes.map((prop, key) => {
      if (prop.collapse) {
        prop.views.map((prop, key) => {
          if (prop.path === this.props.location.pathname) {
            name = prop.name;
          }
          return null;
        });
      }
      if (prop.path === this.props.location.pathname) {
        name = prop.name;
      }
      return null;
    });
    if (name) {
      return name;
    } else {
      return "Default Brand Name";
    }
  }
  handleChangeNet(event) {
    let val = event.target.value;
    this.setState({
      net: val
    });
    netRouter.setNet(val);
    calculator.setUpTronWeb();
    this.getResourceInfo();
    EventEmitter.dispatch("changeNet", val);
  }
  async getResourceInfo() {
    let resource = await calculator.getAccountResources();
    let blockNum = await calculator.getLastUpdateBlock();
    this.setState({
      totalEnergyWeight: resource.TotalEnergyWeight,
      totalNetWeight: resource.TotalNetWeight,
      block: blockNum
    });
  }
  render() {
    const { classes, color, rtlActive } = this.props;
    const appBarClasses = cx({
      [" " + classes[color]]: color
    });
    const sidebarMinimize =
      classes.sidebarMinimize +
      " " +
      cx({
        [classes.sidebarMinimizeRTL]: rtlActive
      });
    return (
      <AppBar className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <Hidden smDown implementation="css">
            <div className={sidebarMinimize}>
              {this.props.miniActive ? (
                <Button
                  justIcon
                  round
                  color="white"
                  onClick={this.props.sidebarMinimize}
                >
                  <ViewList className={classes.sidebarMiniIcon} />
                </Button>
              ) : (
                <Button
                  justIcon
                  round
                  color="white"
                  onClick={this.props.sidebarMinimize}
                >
                  <MoreVert className={classes.sidebarMiniIcon} />
                </Button>
              )}
            </div>
          </Hidden>
          <div className={classes.flex}>
            {/* Here we create navbar brand, based on route name */}
            <Button href="#" className={classes.title} color="transparent">
              {this.makeBrand()}
            </Button>
          </div>
          <Hidden smDown implementation="css">
            <div>
              <strong>Last Updated Block: {this.state.block}</strong>
            </div>
          </Hidden>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Hidden smDown implementation="css">
            <div>
              <strong>
                Total Energy Weight: {this.state.totalEnergyWeight}
              </strong>
            </div>
          </Hidden>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Hidden smDown implementation="css">
            <div>
              <strong>Total Net Weight: {this.state.totalNetWeight}</strong>
            </div>
          </Hidden>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Hidden sdUp implementation="css">
            <NativeSelect
              name="net"
              defaultValue={this.state.net}
              className={classes.selectEmpty}
              onChange={event => this.handleChangeNet(event)}
            >
              <option value={"MainNet"}>main net</option>
              <option value={"ShastaNet"}>shasta testnet</option>
            </NativeSelect>
          </Hidden>
          <Hidden mdUp implementation="css">
            <Button
              className={classes.appResponsive}
              color="transparent"
              justIcon
              aria-label="open drawer"
              onClick={this.props.handleDrawerToggle}
            >
              <Menu />
            </Button>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool
};

export default withStyles(headerStyle)(Header);
