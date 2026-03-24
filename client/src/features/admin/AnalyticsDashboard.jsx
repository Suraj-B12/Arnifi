import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useGetDashboardAnalyticsQuery } from "./analyticsApi";

const TEAL = "#0d9488";
const TEAL_LIGHT = "#14b8a6";
const CORAL = "#f97316";
const CORAL_LIGHT = "#fb923c";

function StatCard({ label, value, isLoading }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold font-heading text-gray-900">
        {isLoading ? "—" : value}
      </p>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="h-5 w-40 rounded bg-gray-100 animate-pulse mb-4" />
      <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
    </div>
  );
}

const funnelLabels = {
  total: "Applied",
  reviewed: "Reviewed",
  interview: "Interview",
  offer: "Offer",
};

export default function AnalyticsDashboard() {
  const { data, isLoading } = useGetDashboardAnalyticsQuery();

  const summary = data?.summary;
  const funnel = data?.funnel;
  const dailyData = data?.dailyData || [];
  const viewsPerJob = data?.viewsPerJob || [];
  const offerRates = data?.offerRates || [];

  const funnelData = funnel
    ? Object.entries(funnelLabels).map(([key, label]) => ({
        name: label,
        count: funnel[key],
      }))
    : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-gray-900">
          Analytics
        </h1>
        <p className="mt-1 text-gray-500">
          Track performance across your job postings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Jobs"
          value={summary?.totalJobs ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Applications"
          value={summary?.totalApplications ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Views"
          value={summary?.totalViews ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          label="Offer Rate"
          value={`${summary?.offerRate ?? 0}%`}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      {isLoading ? (
        <div className="space-y-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      ) : !data || summary?.totalJobs === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 bg-white">
          <h3 className="text-lg font-semibold font-heading text-gray-900">
            No data yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Post jobs and receive applications to see analytics
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Applications per Day */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold font-heading text-gray-900 mb-4">
              Applications per Day
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(d) => d.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={TEAL}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: TEAL }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Funnel */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold font-heading text-gray-900 mb-4">
              Conversion Funnel
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="count" fill={TEAL} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Views per Job */}
          {viewsPerJob.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold font-heading text-gray-900 mb-4">
                Views per Job
              </h2>
              <ResponsiveContainer width="100%" height={Math.max(200, viewsPerJob.length * 40)}>
                <BarChart data={viewsPerJob} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="views" fill={TEAL_LIGHT} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Offer Rates per Job */}
          {offerRates.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold font-heading text-gray-900 mb-4">
                Offer Rate by Job
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={offerRates}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [`${value}%`, "Offer Rate"]}
                  />
                  <Bar dataKey="rate" fill={CORAL} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
