import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  BarChart,
  LineChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Printer, 
  Filter, 
  Calendar,
  DollarSign,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface FinancialReportsViewProps {
  data: {
    donations: any[];
    deductions: any[];
  };
}

export default function FinancialReportsView({ data }: FinancialReportsViewProps) {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [chartType, setChartType] = useState<'composed' | 'bar' | 'line'>('composed');

  // 1. Process and aggregate data
  const aggregateData = () => {
    const monthlyMap: Record<string, { 
      monthLabel: string; 
      sortKey: string; 
      year: string; 
      donations: number; 
      deductions: number; 
    }> = {};

    // Base year list
    const yearsSet = new Set<string>();

    data.donations.forEach((d: any) => {
      if (!d.created_at) return;
      const date = new Date(d.created_at);
      const year = String(date.getFullYear());
      yearsSet.add(year);

      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthLabel = `${monthName} ${year}`;
      const monthNum = String(date.getMonth() + 1).padStart(2, '0');
      const sortKey = `${year}-${monthNum}`;

      if (!monthlyMap[sortKey]) {
        monthlyMap[sortKey] = {
          monthLabel,
          sortKey,
          year,
          donations: 0,
          deductions: 0
        };
      }
      monthlyMap[sortKey].donations += Number(d.amount || 0);
    });

    data.deductions.forEach((dec: any) => {
      if (!dec.created_at) return;
      const date = new Date(dec.created_at);
      const year = String(date.getFullYear());
      yearsSet.add(year);

      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthLabel = `${monthName} ${year}`;
      const monthNum = String(date.getMonth() + 1).padStart(2, '0');
      const sortKey = `${year}-${monthNum}`;

      if (!monthlyMap[sortKey]) {
        monthlyMap[sortKey] = {
          monthLabel,
          sortKey,
          year,
          donations: 0,
          deductions: 0
        };
      }
      monthlyMap[sortKey].deductions += Number(dec.amount || 0);
    });

    // Convert map to list and sort chronologically
    let resultList = Object.values(monthlyMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    // Filter by year if specified
    if (selectedYear !== 'All') {
      resultList = resultList.filter(item => item.year === selectedYear);
    }

    return {
      monthlyReports: resultList.map(item => ({
        month: item.monthLabel,
        donations: item.donations,
        deductions: item.deductions,
        net: item.donations - item.deductions,
        savingsRatio: item.donations > 0 
          ? Number(((item.donations - item.deductions) / item.donations * 100).toFixed(1))
          : 0
      })),
      availYears: Array.from(yearsSet).sort().reverse()
    };
  };

  const { monthlyReports, availYears } = aggregateData();

  // Helper stats
  const totalDonationsSum = monthlyReports.reduce((acc, curr) => acc + curr.donations, 0);
  const totalDeductionsSum = monthlyReports.reduce((acc, curr) => acc + curr.deductions, 0);
  const netSurplus = totalDonationsSum - totalDeductionsSum;
  const overallEfficiency = totalDonationsSum > 0 
    ? ((totalDonationsSum - totalDeductionsSum) / totalDonationsSum * 100).toFixed(1)
    : '0.0';

  // Export functions
  const handleDownloadCSV = () => {
    const headers = ['Month', 'Donations Received (USD)', 'Expenses Deducted (USD)', 'Net Surplus (USD)', 'Retained Savings Ratio (%)'];
    const rows = monthlyReports.map(item => [
      item.month,
      item.donations,
      item.deductions,
      item.net,
      `${item.savingsRatio}%`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `will_naks_financial_summary_${selectedYear === 'All' ? 'all_time' : selectedYear}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify({
      reportHeader: {
        title: 'Will-Naks Foundation Financial Report Statement',
        yearFilter: selectedYear,
        generatedAt: new Date().toISOString(),
        overallDonationsSum: totalDonationsSum,
        overallDeductionsSum: totalDeductionsSum,
        netBalance: netSurplus
      },
      monthlyBreakdown: monthlyReports
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `will_naks_financial_report_${selectedYear === 'All' ? 'all_time' : selectedYear}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy p-4 rounded-xl border border-gold/20 shadow-xl text-white text-xs font-sans space-y-2">
          <p className="font-bold text-gold text-sm border-b border-white/10 pb-1">{label}</p>
          <div className="space-y-1 font-semibold">
            <p className="flex justify-between gap-6">
              <span className="text-gray-300">Donations (Income):</span>
              <span className="text-green-400 font-mono">${payload[0]?.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
            <p className="flex justify-between gap-6">
              <span className="text-gray-300">Deductions (Spent):</span>
              <span className="text-red-400 font-mono">${payload[1]?.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </p>
            <p className="flex justify-between gap-6 border-t border-white/5 pt-1 mt-1 font-bold">
              <span className="text-white">Net Balance:</span>
              <span className={`font-mono ${payload[2]?.value >= 0 ? 'text-gold' : 'text-rose-500'}`}>
                ${payload[2]?.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 print:p-8 print:bg-white print:text-black">
      {/* Filters & Actions Panel */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gold/10 rounded-2xl text-gold">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-navy text-lg leading-tight font-serif italic">Statement Overview</h2>
            <p className="text-xs text-gray-400 mt-0.5">Filter time periods and change visualization layouts.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Year Filter */}
          <div className="flex items-center space-x-2 bg-cream/20 px-3 py-2 rounded-xl border border-navy/5 text-xs font-bold text-navy w-full sm:w-auto justify-between">
            <span className="flex items-center gap-1.5 text-gray-500"><Filter className="h-3.5 w-3.5" /> Year:</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer pr-2 font-black text-navy accent-gold"
            >
              <option value="All">All Time Breakdown</option>
              {availYears.map(yr => (
                <option key={yr} value={yr}>{yr} Reporting Year</option>
              ))}
            </select>
          </div>

          {/* Chart Type Selector */}
          <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200 w-full sm:w-auto justify-between">
            <button 
              onClick={() => setChartType('composed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartType === 'composed' ? 'bg-navy text-white shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              Composed
            </button>
            <button 
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartType === 'bar' ? 'bg-navy text-white shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              Bar Only
            </button>
            <button 
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartType === 'line' ? 'bg-navy text-white shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              Line Only
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Received Funds</span>
          <span className="text-3xl font-serif font-bold text-green-600 block leading-tight">${totalDonationsSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <div className="mt-2.5 flex items-center text-xs font-sans text-green-600 font-medium">
            <TrendingUp className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>Lifetime Donations Income</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Spent / Deducted</span>
          <span className="text-3xl font-serif font-bold text-red-500 block leading-tight">${totalDeductionsSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <div className="mt-2.5 flex items-center text-xs font-sans text-red-500 font-medium">
            <TrendingDown className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>Program & Office Expenses</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Net Reserve Balance</span>
          <span className={`text-3xl font-serif font-bold block leading-tight ${netSurplus >= 0 ? 'text-navy' : 'text-red-500'}`}>
            ${netSurplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <div className="mt-2.5 flex items-center text-xs font-sans text-navy font-medium">
            <DollarSign className="h-4 w-4 mr-1 flex-shrink-0 text-gold" />
            <span>Remaining Operations Budget</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 rounded-full blur-xl"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Capital Reserve Ratio</span>
          <span className="text-3xl font-serif font-bold text-gold block leading-tight">{overallEfficiency}%</span>
          <div className="mt-2.5 flex items-center text-xs font-sans text-gray-500 font-medium">
            <Briefcase className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>Retained funding ratio</span>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
          <div>
            <h3 className="font-serif font-bold text-navy text-xl italic text-left">Monthly Aggregate Performance</h3>
            <p className="text-xs text-gray-400 mt-1 text-left">Aggregated monthly visual reporting showing Donations alongside Disbursements.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button 
              onClick={handleDownloadCSV}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={handleDownloadJSON}
              className="px-4 py-2 bg-navy hover:bg-navy/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
            >
              <FileCode className="h-4 w-4" />
              <span>Export JSON</span>
            </button>
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-gray-200 flex items-center space-x-1.5"
            >
              <Printer className="h-4 w-4" />
              <span>Print Page</span>
            </button>
          </div>
        </div>

        {/* Empty state safeguard */}
        {monthlyReports.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-bold text-navy">No reporting data found</p>
            <p className="text-xs text-gray-400 max-w-sm">No transaction or donation records match the selected reporting filters.</p>
          </div>
        ) : (
          <div className="h-[400px] w-full font-sans text-xs">
            {chartType === 'composed' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyReports}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94A3B8" className="font-semibold" />
                  <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" className="font-mono" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: '600' }} />
                  <Bar name="Donations Received ($)" dataKey="donations" fill="#D4AF37" radius={[6, 6, 0, 0]} maxBarSize={45} />
                  <Bar name="Deductions Spent ($)" dataKey="deductions" fill="#0B132B" radius={[6, 6, 0, 0]} maxBarSize={45} />
                  <Line name="Net Remaining ($)" type="monotone" dataKey="net" stroke="#10B981" strokeWidth={3.5} activeDot={{ r: 8 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyReports}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94A3B8" className="font-semibold" />
                  <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" className="font-mono" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: '600' }} />
                  <Bar name="Donations Received ($)" dataKey="donations" fill="#D4AF37" radius={[6, 6, 0, 0]} maxBarSize={45} />
                  <Bar name="Deductions Spent ($)" dataKey="deductions" fill="#0B132B" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyReports}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94A3B8" className="font-semibold" />
                  <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" className="font-mono" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: '600' }} />
                  <Line name="Donations ($)" type="monotone" dataKey="donations" stroke="#D4AF37" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line name="Deductions Spent ($)" type="monotone" dataKey="deductions" stroke="#0B132B" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line name="Net Balance ($)" type="monotone" dataKey="net" stroke="#10B981" strokeWidth={4} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>

      {/* Aggregate Report Table */}
      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h4 className="font-serif font-bold text-navy text-lg italic text-left">Detailed Statement Ledger</h4>
          <span className="text-[10px] font-mono text-gray-400">Total ledger items: {monthlyReports.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-navy text-[10px] uppercase font-bold text-gold tracking-wider">
                <th className="p-4 pl-6">Reporting Month</th>
                <th className="p-4">Donations Received</th>
                <th className="p-4">Deductions Spent</th>
                <th className="p-4">Net Balance change</th>
                <th className="p-4 pr-6 text-right">Fund Retained ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-sans text-navy">
              {monthlyReports.map((item) => (
                <tr key={item.month} className="hover:bg-cream/10 transition-colors">
                  <td className="p-4 pl-6 font-bold">{item.month}</td>
                  <td className="p-4 text-green-600 font-semibold font-mono">${item.donations.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-red-500 font-semibold font-mono">-${item.deductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className={`p-4 font-bold font-mono ${item.net >= 0 ? 'text-navy' : 'text-red-500'}`}>
                    {item.net >= 0 ? '+' : ''}${item.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 pr-6 text-right font-bold">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      item.savingsRatio >= 60 ? 'bg-green-50 text-green-700' :
                      item.savingsRatio >= 30 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-750'
                    }`}>
                      {item.savingsRatio}%
                    </span>
                  </td>
                </tr>
              ))}
              {monthlyReports.length > 0 && (
                <tr className="bg-gray-50 font-bold border-t border-gray-200">
                  <td className="p-4 pl-6 text-navy font-serif font-bold">Ledger Totals</td>
                  <td className="p-4 text-green-600 font-serif font-mono">${totalDonationsSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-red-500 font-serif font-mono">-${totalDeductionsSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className={`p-4 font-serif font-mono ${netSurplus >= 0 ? 'text-navy' : 'text-red-500'}`}>
                    ${netSurplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 pr-6 text-right text-gold font-mono">{overallEfficiency}%</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
