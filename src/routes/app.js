import EnergyCalcIco from "@material-ui/icons/OfflineBoltOutlined";
import BPCalcIco from "@material-ui/icons/LineWeightOutlined";
import UnitCalcIco from "@material-ui/icons/FiberSmartRecord";

// components
import EnergyCalculator from "components/energycalculator/EnergyCalculator.jsx";
import BandWidthCalculator from "components/bandwidthcalculator/BandwidthCalculator.jsx";
import UnitCalculator from "components/unitcalculator/UnitCalculator.jsx";

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
    path: "/unitcalc",
    name: "Unit Calculator",
    icon: UnitCalcIco,
    component: UnitCalculator
  },
  {
    collapse: true,
    path: "/faq",
    name: "FAQ",
    icon: FAQIco,
    views: faq
  },
  {
    redirect: true,
    path: "/",
    pathTo: "/energycalc",
    name: "Energy Calculator"
  }
];
export default appRoutes;
