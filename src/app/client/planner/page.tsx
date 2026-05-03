import { ComingSoon } from "../_components/ComingSoon";
import { Calendar01Icon } from "@hugeicons/core-free-icons";

export const metadata = {
  title: "Planner | TunedEssays",
  description: "Plan and schedule your upcoming academic work.",
};

export default function PlannerPage() {
  return (
    <ComingSoon
      title="Planner"
      description="Schedule deadlines, set reminders, and stay ahead of your academic calendar effortlessly."
      icon={Calendar01Icon}
      eta="Q4 2025"
    />
  );
}
