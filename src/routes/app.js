import EnergyCalcIco from "@material-ui/icons/OfflineBoltOutlined";
import BPCalcIco from "@material-ui/icons/LineWeightOutlined";
import UnitCalcIco from "@material-ui/icons/FiberSmartRecord";
import VoteCalcIco from "@material-ui/icons/AssignmentOutlined";

// components
import EnergyCalculator from "components/energycalculator/EnergyCalculator.jsx";
import BandWidthCalculator from "components/bandwidthcalculator/BandwidthCalculator.jsx";
import UnitCalculator from "components/unitcalculator/UnitCalculator.jsx";
import VoteReward from "components/votereward/VoteReward.jsx";

var appRoutes = [
  {
    path: "/unitcalc",
    name: "Unit Calculator",
    icon: UnitCalcIco,
    component: UnitCalculator
  },
  {
    path: "/energycalc",
    name: "Energy Calculator",
    icon: EnergyCalcIco,
    component: EnergyCalculator
  },
  {
    path: "/bpcalc",
    name: "Bandwidth Calculator",
    icon: BPCalcIco,
    component: BandWidthCalculator
  },
  {
    path: "/votereward",
    name: "SR Vote Reward",
    icon: VoteCalcIco,
    component: VoteReward
  },
  {
    redirect: true,
    path: "/",
    pathTo: "/unitcalc",
    name: "Unit Calculator"
  }
];
export default appRoutes;
