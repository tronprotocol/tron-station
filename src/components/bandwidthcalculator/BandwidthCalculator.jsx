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

class BandWidthCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trxAmount: "",
      frozenBandwidthInit: "",
      frozenBandwidth: "",
      hexAddress: "",
      maxBandwidth: {}
    };
  }
  componentDidMount() {
    let self = this;
    this.calcBandwidth(true);
    EventEmitter.subscribe("changeNet", function() {
      self.calcBandwidth(true);
    });
  }
  componentWillUnmount() {
    EventEmitter.unSubscribe("changeNet");
  }
  handleInputChange(event, name) {
    this.setState({ [name]: event.target.value });
  }
  async calcBandwidth(isInit) {
    let bp = await calculator.getFrozenBandwidth(
      isInit ? 1 : this.state.trxAmount
    );
    if (isInit) {
      this.setState({
        frozenBandwidthInit: bp,
        frozenBandwidth: "",
        maxBandwidth: {}
      });
    } else {
      this.setState({
        frozenBandwidth: bp
      });
    }
  }
  async calcMaxBandwidthLimit() {
    let data = await calculator.getMaxBandWidthLimit(this.state.hexAddress);
    this.setState({ maxBandwidth: data });
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <h4 className={classes.cardIconTitle}>
                Calculate BandWidth by freezing TRX &nbsp;&nbsp;
                <strong>
                  1 TRX = {this.state.frozenBandwidthInit} BandWidth
                </strong>
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
                <Button
                  color="rose"
                  onClick={event => this.calcBandwidth(false)}
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
              <h4 className={classes.cardIconTitle}>Bandwidth you will get</h4>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      id="frozen_bandwidth"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        value: this.state.frozenBandwidth
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
                Calculate Total Bandwidth in your account
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
                <Button
                  color="rose"
                  onClick={event => this.calcMaxBandwidthLimit()}
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
              <h4 className={classes.cardIconTitle}>Total Bandwidth Result</h4>
            </CardHeader>
            <CardBody>
              <Table
                striped
                tableHead={[
                  "Bandwidth Points",
                  this.state.maxBandwidth.maxBandWidthLimit
                ]}
                tableData={[]}
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
                      ["Account Total BandWidth Points:", "", "", ""],
                      [
                        "(1)",
                        "Remaing Free BandWidth in your account",
                        "",
                        this.state.maxBandwidth.freeBandWidthLimit
                      ],
                      [
                        "(2)",
                        "Free BandWidth Used",
                        "",
                        this.state.maxBandwidth.freeBandWidthUsed
                      ],
                      [
                        "(3)",
                        "Remaining BandWidth in your account",
                        "",
                        this.state.maxBandwidth.bandWidthLimit
                      ],
                      [
                        "(4)",
                        "BandWidth Used",
                        "",
                        this.state.maxBandwidth.bandWidthUsed
                      ],
                      [
                        "(5)",
                        <strong>
                          Total remaining bandwidth points in your account
                        </strong>,
                        "(1) - (2) + (3) - (4)",
                        <strong>
                          {this.state.maxBandwidth.maxBandWidthLimit}
                        </strong>
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

export default withStyles(regularFormsStyle)(BandWidthCalculator);
