import React from "react";

// styles
import { withStyles } from "@material-ui/core/styles";
import regularFormsStyle from "assets/jss/regularFormsStyle";

// components
import GridContainer from "components/common/GridContainer.jsx";
import GridItem from "components/common/GridItem.jsx";
import Card from "components/common/Card.jsx";
import CardHeader from "components/common/CardHeader.jsx";
import CardBody from "components/common/CardBody.jsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CustomInput from "components/common/CustomInput.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import CustomButton from "components/common/CustomButton.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

// services
import calculator from "services/calculator.js";
import EventEmitter from "services/eventEmitter.js";
import _ from "lodash";

class VoteReward extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      srData: [],
      candidateData: [],
      allData: [],
      queryData: [],
      totalVotes: 0,
      tabIdx: 0,
      dialogOpen: false,
      isSrChecked: false,
      addedVotes: 0,
      srQuery: "",
      srSelect: null,
      srSelectContent: "Select",
      calcReward: {},
      requiredError: ""
    };
  }

  componentDidMount() {
    let thiz = this;
    this.getSuperRepresentatives();
    EventEmitter.subscribe("changeNet", function() {
      thiz.getSuperRepresentatives();
    });
  }

  componentWillUnmount() {
    EventEmitter.unSubscribe("changeNet");
  }

  handleAction = (event, name, value) => {
    switch (name) {
      case "addedVotes":
        this.setState({ [name]: event.target.value });
        break;
      case "tabIdx":
        this.setState({ [name]: this.state.tabIdx === 0 ? 1 : 0 });
        break;
      case "isSrChecked":
        this.setState({ [name]: !this.state.isSrChecked });
        break;
      case "dialogOpen":
        this.setState({
          [name]: !this.state.dialogOpen,
          queryData: this.state.allData
        });
        break;
      case "srQuery":
        this.setState({
          queryData: _.filter(this.state.allData, function(d) {
            return d.name.indexOf(event.target.value) !== -1;
          })
        });
        break;
      case "srSelect":
        this.setState({
          srSelect: this.state.allData[value],
          srSelectContent: this.state.allData[value].name,
          dialogOpen: !this.state.dialogOpen
        });
        break;
      default:
        break;
    }
  };

  async getSuperRepresentatives() {
    let data = await calculator.getSuperRepresentatives();
    this.setState({
      srData: data.srData,
      candidateData: data.candidateData,
      allData: data.allData,
      queryData: data.allData,
      totalVotes: data.totalVotes
    });
  }

  calcVoteReward() {
    let addedVotes = parseInt(
      this.state.addedVotes === "" ? 0 : this.state.addedVotes,
      0
    );
    let srVotes =
      !this.state.isSrChecked || this.state.srSelect == null
        ? 0
        : this.state.srSelect.votes;
    if (
      (this.state.isSrChecked && this.state.srSelect == null) ||
      (!this.state.isSrChecked && addedVotes <= 0)
    ) {
      return;
    }

    let totalSrVotes = addedVotes + srVotes;

    let ascData = _.reverse(_.clone(this.state.allData));
    let pos = _.sortedIndexBy(ascData, { votes: totalSrVotes }, function(d) {
      return d.votes;
    });
    let rank =
      this.state.isSrChecked && addedVotes === 0
        ? this.state.allData.length - pos
        : this.state.allData.length - pos + 1;

    let srName = this.state.isSrChecked
      ? this.state.srSelect.name
      : rank <= 27
        ? "New SR"
        : "New Candidate";
    let totalVotes = this.state.totalVotes + addedVotes;
    let percentage = ((100 * totalSrVotes) / totalVotes).toFixed(2);
    let voteReward = Math.ceil(16 * 20 * 60 * 24 * (totalSrVotes / totalVotes));
    let blockReward = Math.ceil((32 * 20 * 60 * 24) / 27);
    let totalReward = blockReward + voteReward;
    let rewardObj = {
      rank: rank,
      sr: srName,
      votes: totalSrVotes.toLocaleString(),
      totalVotes: totalVotes.toLocaleString(),
      percentage: percentage + "%",
      voteReward: voteReward.toLocaleString(),
      blockReward: blockReward.toLocaleString(),
      totalReward: totalReward.toLocaleString()
    };
    this.setState({ calcReward: rewardObj });
  }

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <h4 className={classes.cardIconTitle}>
                Calculate Vote Reward for SR &nbsp;&nbsp;
                <strong>
                  Total Votes: {this.state.totalVotes.toLocaleString()}
                </strong>
              </h4>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <FormLabel className={classes.labelHorizontal}>
                      New Votes / Exsited SR added votes:
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={7}>
                    <CustomInput
                      labelText="Votes amount"
                      id=""
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        onChange: event =>
                          this.handleAction(event, "addedVotes")
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.isSrChecked}
                          onClick={event =>
                            this.handleAction(event, "isSrChecked")
                          }
                        />
                      }
                      label="Is existed SR/Candidate in Tron"
                    />
                    <Button
                      disabled={!this.state.isSrChecked}
                      className={classes.linkBtn}
                      onClick={event => this.handleAction(event, "dialogOpen")}
                    >
                      {this.state.srSelectContent}
                    </Button>
                    <font className={classes.required}>
                      {this.state.isSrChecked && this.state.srSelect == null
                        ? "(*required)"
                        : ""}
                    </font>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomButton
                      color="rose"
                      onClick={event => this.calcVoteReward(false)}
                    >
                      Calculate
                    </CustomButton>
                  </GridItem>
                </GridContainer>
              </form>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <h4 className={classes.cardIconTitle}>Daily Vote Reward</h4>
            </CardHeader>
            <CardBody>
              <Table>
                <TableBody>
                  <TableRow className={classes.miniTableRow}>
                    <TableCell>Rank</TableCell>
                    <TableCell>{this.state.calcReward.rank}</TableCell>
                  </TableRow>
                  <TableRow className={classes.miniTableRow}>
                    <TableCell>SR/Candidate</TableCell>
                    <TableCell>{this.state.calcReward.sr}</TableCell>
                  </TableRow>
                  <TableRow className={classes.miniTableRow}>
                    <TableCell>SR/Candidate Votes</TableCell>
                    <TableCell>{this.state.calcReward.votes}</TableCell>
                  </TableRow>
                  <TableRow className={classes.miniTableRow}>
                    <TableCell>Total Votes</TableCell>
                    <TableCell>{this.state.calcReward.totalVotes}</TableCell>
                  </TableRow>
                  <TableRow className={classes.miniTableRow}>
                    <TableCell>Votes Percentage</TableCell>
                    <TableCell>{this.state.calcReward.percentage}</TableCell>
                  </TableRow>
                  <TableRow className={classes.miniTableRow}>
                    <TableCell>Vote Reward</TableCell>
                    <TableCell>{this.state.calcReward.voteReward}</TableCell>
                  </TableRow>
                  <TableRow className={classes.miniTableRow}>
                    <TableCell>Block Reward</TableCell>
                    <TableCell>{this.state.calcReward.blockReward}</TableCell>
                  </TableRow>
                  <TableRow className={classes.miniTableRow}>
                    <TableCell>Total Reward</TableCell>
                    <TableCell>{this.state.calcReward.totalReward}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="success" icon>
              <h4 className={classes.cardIconTitle}>
                Current Super Representatives Vote Reward
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="space-between">
                <GridItem xs={12} sm={12} md={12}>
                  <Tabs
                    value={this.state.tabIdx}
                    onChange={event => this.handleAction(event, "tabIdx")}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="SR Vote Reward" />
                    <Tab label="Candidate Vote Reward" />
                  </Tabs>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank #</TableCell>
                        <TableCell>SR</TableCell>
                        <TableCell numeric>Votes</TableCell>
                        {this.state.tabIdx === 1 && (
                          <TableCell numeric>SR Votes Difference</TableCell>
                        )}
                        <TableCell numeric>Votes Percentage</TableCell>
                        <TableCell numeric>Daily Vote Reward (TRX)</TableCell>
                        <TableCell numeric>Daily Block Reward (TRX)</TableCell>
                        <TableCell numeric>Daily Total Reward (TRX)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.tabIdx === 0 &&
                        this.state.srData.map((row, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell component="th" scope="row">
                                <a
                                  href={row.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {row.name}
                                </a>
                              </TableCell>
                              <TableCell numeric>
                                {row.votes.toLocaleString()}
                              </TableCell>
                              <TableCell numeric>
                                {row.votesPercentage + "%"}
                              </TableCell>
                              <TableCell numeric>
                                {row.voteReward.toLocaleString()}
                              </TableCell>
                              <TableCell numeric>
                                {row.blockReward.toLocaleString()}
                              </TableCell>
                              <TableCell numeric>
                                {row.totalReward.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {this.state.tabIdx === 1 &&
                        this.state.candidateData.map((row, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{index + 28}</TableCell>
                              <TableCell component="th" scope="row">
                                <a
                                  href={row.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {row.name}
                                </a>
                              </TableCell>
                              <TableCell numeric>
                                {row.votes.toLocaleString()}
                              </TableCell>
                              <TableCell numeric>
                                {(
                                  row.votes - this.state.srData[26].votes
                                ).toLocaleString()}
                              </TableCell>
                              <TableCell numeric>
                                {row.votesPercentage + "%"}
                              </TableCell>
                              <TableCell numeric>
                                {row.voteReward.toLocaleString()}
                              </TableCell>
                              <TableCell numeric>
                                {row.blockReward.toLocaleString()}
                              </TableCell>
                              <TableCell numeric>
                                {row.totalReward.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <Dialog
          // fullScreen={classes}
          open={this.state.dialogOpen}
          onClose={event => this.handleAction(event, "dialogOpen")}
          aria-labelledby="responsive-dialog-title"
          classes={{ paper: classes.dialog }}
        >
          <DialogTitle id="responsive-dialog-title">
            {"Super Representive/Candidate"}
          </DialogTitle>
          <DialogContent>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search By Name..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                onChange={event => this.handleAction(event, "srQuery")}
              />
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SR</TableCell>
                  <TableCell numeric>Votes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.queryData.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      hover={true}
                      className={classes.dialogTableRow}
                      onClick={event =>
                        this.handleAction(event, "srSelect", index)
                      }
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell numeric>
                        {row.votes.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={event => this.handleAction(event, "dialogOpen")}
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(VoteReward);
