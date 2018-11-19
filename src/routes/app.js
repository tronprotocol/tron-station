import EnergyCalcIco from "@material-ui/icons/OfflineBoltOutlined";
import BPCalcIco from "@material-ui/icons/LineWeightOutlined";

// components
import EnergyCalculator from "components/energycalculator/EnergyCalculator.jsx";
import BandWidthCalculator from "components/bandwidthcalculator/BandwidthCalculator.jsx";

var appRoutes = [
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
    redirect: true,
    path: "/",
    pathTo: "/energycalc",
    name: "Energy Calculator"
  }
];
export default appRoutes;
