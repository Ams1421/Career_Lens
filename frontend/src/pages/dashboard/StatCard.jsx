import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon,
  gradient
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        y: -4
      }}
      className={`rounded-3xl p-6 text-white shadow-xl ${gradient}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}