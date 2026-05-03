import { ComingSoon } from "../_components/ComingSoon";
import { Folder01Icon } from "@hugeicons/core-free-icons";

export const metadata = {
  title: "My Orders | TunedEssays",
  description: "View and manage all your orders.",
};

export default function OrdersPage() {
  return (
    <ComingSoon
      title="My Orders"
      description="Track, manage, and communicate on all your current and past orders — all in one place."
      icon={Folder01Icon}
      eta="Q3 2025"
    />
  );
}
