"use client";
import { useEffect, useState } from "react";
// import { Line } from 'react-chartjs-2'; // Uncomment if using chart.js

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/analytics/admin");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Error loading analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading analytics...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  // If not admin, show message
  if (data.error && data.error.toLowerCase().includes("admin")) {
    return <div className="p-8 text-center text-red-500">Admin access required.</div>;
  }

  // Prepare chart data (placeholder, replace with chart.js or recharts as needed)
  const days = Object.keys(data.timeSeries.viewsByDay || {});
  const views = days.map(day => data.timeSeries.viewsByDay[day] || 0);
  const bookings = days.map(day => data.timeSeries.bookingsByDay[day] || 0);
  const inquiries = days.map(day => data.timeSeries.inquiriesByDay[day] || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Analytics Dashboard</h1>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold">{data.overview.totalUsers}</div>
          <div className="text-gray-600 mt-2">Total Users</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold">{data.overview.totalProperties}</div>
          <div className="text-gray-600 mt-2">Total Properties</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold">{data.overview.totalBookings}</div>
          <div className="text-gray-600 mt-2">Total Bookings</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold">₹{data.overview.totalRevenue.toLocaleString()}</div>
          <div className="text-gray-600 mt-2">Total Revenue</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold">{data.overview.totalInquiries}</div>
          <div className="text-gray-600 mt-2">Total Inquiries</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold">{data.overview.totalReviews}</div>
          <div className="text-gray-600 mt-2">Total Reviews</div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Property Views (Last 30 Days)</h2>
          {/* Replace below with a real chart */}
          <div className="h-48 flex items-end gap-1">
            {views.map((v, i) => (
              <div key={i} className="bg-blue-500 rounded w-2" style={{ height: `${v * 2}px` }} title={`${days[i]}: ${v}`}></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{days[0]}</span>
            <span>{days[days.length - 1]}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Bookings (Last 30 Days)</h2>
          {/* Replace below with a real chart */}
          <div className="h-48 flex items-end gap-1">
            {bookings.map((v, i) => (
              <div key={i} className="bg-green-500 rounded w-2" style={{ height: `${v * 4}px` }} title={`${days[i]}: ${v}`}></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{days[0]}</span>
            <span>{days[days.length - 1]}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Inquiries (Last 30 Days)</h2>
          {/* Replace below with a real chart */}
          <div className="h-48 flex items-end gap-1">
            {inquiries.map((v, i) => (
              <div key={i} className="bg-yellow-500 rounded w-2" style={{ height: `${v * 4}px` }} title={`${days[i]}: ${v}`}></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{days[0]}</span>
            <span>{days[days.length - 1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 