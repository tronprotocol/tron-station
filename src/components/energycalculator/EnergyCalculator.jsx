import React from "react";

// styles
import { withStyles } from "@material-ui/core/styles";
import regularFormsStyle from "assets/jss/regularFormsStyle";

// components
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GridContainer from "components/common/GridContainer.jsx";
import GridItem from "components/common/GridItem.jsx";
import Card from "components/common/Card.jsx";
import CardHeader from "components/common/CardHeader.jsx";
import CardBody from "components/common/CardBody.jsx";
import CustomInput from "components/common/CustomInput.jsx";
import Button from "components/common/Button.jsx";
import Table from "components/common/Table.jsx";
import EventEmitter from "services/eventEmitter.js";

// services
import calculator from "services/calculator.js";

class EnergyCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trxAmount: "",
      frozenEnergyInit: "",
      frozenEnergy: "",
      hexAddress: "",
      feeLimit: "",
      maxEnergy: {}
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
    this.setState({ [name]: event.target.value });
  }
  async calcEnergy(isInit) {
    let energy = await calculator.getFrozenEnergy(
      isInit ? 1 : this.state.trxAmount
    );
    if (isInit) {
      this.setState({
        frozenEnergyInit: energy,
        frozenEnergy: "",
        maxEnergy: {}
      });
    } else {
      this.setState({
        frozenEnergy: energy
      });
    }
  }
  async calcMaxEnergyLimit() {
    let data = await calculator.getMaxEnergyLimit(
      this.state.hexAddress,
      this.state.feeLimit
    );
    this.setState({ maxEnergy: data });
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
              </h4>
            </CardHeader>
            <CardBody>
              <form>
                <CustomInput
                  labelText="Please input frozen TRX amount"
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
                <Button color="rose" onClick={event => this.calcEnergy(false)}>
                  Calculate
                </Button>
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
                        value: this.state.frozenEnergy
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
                <CustomInput
                  labelText="Please input your hex address"
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
                <CustomInput
                  labelText="Please input your fee limit for contract"
                  id="fee_limit"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "text",
                    onChange: event => this.handleInputChange(event, "feeLimit")
                  }}
                />
                <Button
                  color="rose"
                  onClick={event => this.calcMaxEnergyLimit()}
                >
                  Calculate
                </Button>
              </form>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <h4 className={classes.cardIconTitle}>Max Energy Result</h4>
            </CardHeader>
            <CardBody>
              <Table
                striped
                tableHead={[
                  "Max energy limit",
                  this.state.maxEnergy.maxEnergyLimit
                ]}
                tableData={[[]]}
                coloredColls={[1]}
                colorsColls={["primary"]}
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
                        "When Account Remaining Energy (1) is bigger than Fee limit energy (7),  choose minimum value between (4) and (7), otherwise choose (4)}",
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
