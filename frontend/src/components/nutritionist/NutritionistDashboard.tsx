export default function NutritionistDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value="120" />
        <StatCard label="Upcoming Appointments" value="5" />
        <StatCard label="Pending Reports" value="2" />
        <StatCard label="Total Earnings" value="₹2,450" />
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        <ul className="space-y-1 text-gray-700">
          <li>• John Doe registered as a client</li>
          <li>• Appointment confirmed with Jane Smith</li>
          <li>• Report submitted for Alex Johnson</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-3xl font-bold text-emerald-600">{value}</p>
    </div>
  );
}
