import { ComingSoon } from "../_components/ComingSoon";
import { Wallet01Icon } from "@hugeicons/core-free-icons";

export const metadata = {
  title: "My Balance | TunedEssays",
  description: "View your account balance and transaction history.",
};

export default function BalancePage() {
  return (
    <ComingSoon
      title="My Balance"
      description="View your wallet balance, top-up funds, and review your full transaction history."
      icon={Wallet01Icon}
      eta="Q3 2025"
    />
  );
}
