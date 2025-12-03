export default function NutritionistDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <p className="text-gray-700 text-lg">
        Welcome to your Nutritionist Dashboard.
      </p>

      <div className="space-y-2 text-gray-700">
        <p>Total Clients: 120</p>
        <p>Upcoming Appointments: 5</p>
        <p>Pending Reports: 2</p>
        <p>Total Earnings: ₹2,450</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Recent Activity
        </h2>
        <ul className="space-y-1 text-gray-700">
          <li>• John Doe registered as a client</li>
          <li>• Appointment confirmed with Jane Smith</li>
          <li>• Report submitted for Alex Johnson</li>
        </ul>
      </div>
    </div>
  );
}
