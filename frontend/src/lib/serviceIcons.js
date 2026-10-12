import archiveLoadIcon from "../assets/images/lets-icons_arhive-load-duotone-line.svg";
import boxIcon from "../assets/images/lets-icons_3d-box-duotone.svg";
import identityIcon from "../assets/images/lets-icons_user-duotone-line.svg";
import paperIcon from "../assets/images/lets-icons_paper-duotone-line.svg";
import topUpIcon from "../assets/images/lets-icons_ito-duotone.svg";
import walletIcon from "../assets/images/lets-icons_wallet-duotone-line.svg";

const serviceIcons = {
  shipping: boxIcon,
  pickups: archiveLoadIcon,
  payments: walletIcon,
  "financial services": paperIcon,
  "top-ups": topUpIcon,
  "identity services": identityIcon,
};

export function getServiceIcon(serviceName) {
  return serviceIcons[serviceName.trim().toLowerCase()] ?? null;
}
