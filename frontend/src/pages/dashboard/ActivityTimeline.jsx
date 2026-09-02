import { FiCheckCircle } from "react-icons/fi";

const activities = [
  "Applied for Full Stack Developer",
  "Added .NET Skill",
  "Updated Profile",
  "AI Match recalculated"
];

export default function ActivityTimeline() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-5">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((item, index) => (
          <div key={index} className="flex gap-3">
            <FiCheckCircle className="text-green-500 mt-1" />

            <div>
              <p className="font-medium">{item}</p>

              <p className="text-sm text-gray-500">
                Today
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}