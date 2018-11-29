import React from "react";

// styles
import { withStyles } from "@material-ui/core/styles";
import regularFormsStyle from "assets/jss/regularFormsStyle";
import formulaIco from "assets/img/question-black.png";

// components
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NativeSelect from "@material-ui/core/NativeSelect";
import { MuiThemeProvider } from "@material-ui/core/styles";
import muiTheme from "assets/jss/muiStyle.jsx";
import GridContainer from "components/common/GridContainer.jsx";
import GridItem from "components/common/GridItem.jsx";
import Card from "components/common/Card.jsx";
import CardHeader from "components/common/CardHeader.jsx";
import CardBody from "components/common/CardBody.jsx";
import CustomInput from "components/common/CustomInput.jsx";
import Button from "components/common/Button.jsx";
import Table from "components/common/Table.jsx";
import Popover from "@material-ui/core/Popover";

// services
import calculator from "services/calculator.js";
import EventEmitter from "services/eventEmitter.js";

class EnergyCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trxAmount: "",
      frozenEnergyInit: "",
      frozenEnergy: "",
      frozenRatio: "1",
      hexAddress: "",
      feeLimit: "",
      feeLimitState: "",
      feeLimitRatio: "1",
      maxEnergy: {},
      TotalEnergyWeight: "",
      formulaState: false,
      anchorElState: null,
      formula: ""
    };
  }
  componentDidMount() {
    let self = this;
    this.calcEnergy(true);
    EventEmitter.subscribe("changeNet", function() {
      self.calcEnergy(true);
    });
  }
  componentWillUnmount() {
    EventEmitter.unSubscribe("changeNet");
  }
  handleInputChange(event, name) {
    let v = event.target.value;
    switch (name) {
      case "feeLimit":
        if (v >= 0 && v <= 1000 / this.state.feeLimitRatio) {
          this.setState({ feeLimitState: "success" });
        } else {
          this.setState({ feeLimitState: "error" });
        }
        this.setState({ [name]: v });
        break;
      case "formulaState":
        this.setState({
          anchorElState: this.state.formulaState ? null : event.currentTarget
        });
        this.setState({ formulaState: this.state.formulaState ? false : true });
        break;
      default:
        this.setState({ [name]: v });
        break;
    }
  }
  async calcEnergy(isInit) {
    let data = await calculator.getFrozenEnergy(
      isInit ? 1 : this.state.trxAmount * this.state.frozenRatio
    );
    if (isInit) {
      this.setState({
        frozenEnergyInit: data.energy,
        frozenEnergy: "",
        maxEnergy: {},
        furmula:
          "1 TRX = TotalEnergyLimit (" +
          data.accountResource.TotalEnergyLimit.toLocaleString() +
          ") / TotalEnergyWeight (" +
          data.accountResource.TotalEnergyWeight.toLocaleString() +
          ") = " +
          data.energy +
          " energy"
      });
    } else {
      this.setState({
        frozenEnergy: data.energy
      });
    }
  }
  async calcMaxEnergyLimit() {
    if (this.state.feeLimitState === "success") {
      let data = await calculator.getMaxEnergyLimit(
        this.state.hexAddress,
        this.state.feeLimit * this.state.feeLimitRatio
      );
      this.setState({ maxEnergy: data });
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <h4 className={classes.cardIconTitle}>
                Calculate Energy by freezing TRX &nbsp;&nbsp;
                <strong>1 TRX = {this.state.frozenEnergyInit} Energy</strong>
                <img
                  className={classes.formulaIcon}
                  src={formulaIco}
                  alt="formula"
                  onClick={event =>
                    this.handleInputChange(event, "formulaState")
                  }
                />
              </h4>
              <Popover
                id="formula-popover"
                open={this.state.formulaState}
                anchorEl={this.state.anchorElState}
                onClose={event => this.handleInputChange(event, "formulaState")}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
              >
                <Typography className={classes.formulaContent}>
                  <strong>{this.state.furmula}</strong>
                </Typography>
              </Popover>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={9}>
                    <CustomInput
                      labelText="Frozen TRX amount"
                      id="trx_amount"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        defaultValue: this.state.trxAmount,
                        onChange: event =>
                          this.handleInputChange(event, "trxAmount")
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <MuiThemeProvider theme={muiTheme}>
                      <NativeSelect
                        className={classes.selectBtn}
                        defaultValue={this.state.frozenRatio}
                        onChange={event =>
                          this.handleInputChange(event, "frozenRatio")
                        }
                      >
                        <option value={"1"}>Trx</option>
                        <option value={"0.000001"}>Sun</option>
                      </NativeSelect>
                    </MuiThemeProvider>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <Button
                      color="rose"
                      onClick={event => this.calcEnergy(false)}
                    >
                      Calculate
                    </Button>
                  </GridItem>
                </GridContainer>
              </form>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <h4 className={classes.cardIconTitle}>Energy you will get</h4>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      id="frozen_energy"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        value: this.state.frozenEnergy,
                        disabled: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </form>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <h4 className={classes.cardIconTitle}>
                Calculate Max Energy Limit to deploy/trigger contract
              </h4>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={9}>
                    <CustomInput
                      labelText="Hex account address"
                      id="hex_address"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: event =>
                          this.handleInputChange(event, "hexAddress")
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={9}>
                    <CustomInput
                      success={this.state.feeLimitState === "success"}
                      error={this.state.feeLimitState === "error"}
                      labelText="Fee limit for contract (Max=1000 Trx)"
                      id="fee_limit"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: event =>
                          this.handleInputChange(event, "feeLimit")
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <MuiThemeProvider theme={muiTheme}>
                      <NativeSelect
                        className={classes.selectBtn}
                        defaultValue={this.state.frozenRatio}
                        onChange={event =>
                          this.handleInputChange(event, "feeLimitRatio")
                        }
                      >
                        <option value={"1"}>Trx</option>
                        <option value={"0.000001"}>Sun</option>
                      </NativeSelect>
                    </MuiThemeProvider>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <Button
                      color="rose"
                      onClick={event => this.calcMaxEnergyLimit()}
                    >
                      Calculate
                    </Button>
                  </GridItem>
                </GridContainer>
              </form>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <h4 className={classes.cardIconTitle}>Max Energy Limit</h4>
            </CardHeader>
            <CardBody>
              <CustomInput
                id="max_energy_limit"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "text",
                  value:
                    this.state.maxEnergy.maxEnergyLimit === undefined
                      ? ""
                      : this.state.maxEnergy.maxEnergyLimit,
                  disabled: true
                }}
              />
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    Calculation Details
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Table
                    striped
                    tableHeaderColor="primary"
                    tableHead={["Fee code", "Fee item", "Calculator", "Result"]}
                    tableData={[
                      ["Account Remaining Energy Limit:", "", "", ""],
                      [
                        "(1)",
                        "Remaing Energy in your account",
                        "",
                        this.state.maxEnergy.energyLimit
                      ],
                      [
                        "(2)",
                        "Energy used",
                        "",
                        this.state.maxEnergy.energyUsed
                      ],
                      [
                        "(3)",
                        "Remaining TRX balance in your account",
                        "",
                        this.state.maxEnergy.balance
                      ],
                      [
                        "(4)",
                        "Remaining TRX energy limit",
                        "10,000 * (3)",
                        this.state.maxEnergy.balanceEnergy
                      ],
                      [
                        "(4)",
                        "Total remaining energy limit in your account",
                        "(1) - (2) + (4)",
                        this.state.maxEnergy.remainEnergyLimit
                      ],
                      ["Fee Limit Energy:", "", "", ""],
                      [
                        "(5)",
                        "Fee limit in TRX set in deploy/trigger contract",
                        "",
                        this.state.maxEnergy.feeLimit
                      ],
                      [
                        "(6)",
                        "Energy by freezing 1 TRX",
                        "",
                        this.state.maxEnergy.ratio
                      ],
                      [
                        "(7)",
                        "Total fee limit energy",
                        "(5) * (6)",
                        this.state.maxEnergy.feeLimitEnergy
                      ],
                      [
                        "Max Energy Limit to Deploy/Trigger Contract:",
                        "",
                        "",
                        ""
                      ],
                      [
                        "(8)",
                        <strong>Max energy limit</strong>,
                        "When Account Remaining Energy (1) is bigger than Fee limit energy (7),  choose minimum value between (4) and (7), otherwise choose (4).",
                        <strong>{this.state.maxEnergy.maxEnergyLimit}</strong>
                      ]
                    ]}
                    coloredColls={[3]}
                    colorsColls={["primary"]}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(EnergyCalculator);
