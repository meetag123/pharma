import { useState, useEffect } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { Pagination, Spin } from "antd";

function App() {
  const [drugs, setDrugs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);

  const fetchDrugs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: pageSize };
      if (search) params.search = search;
      if (selectedCompany) params.company = selectedCompany;

      const res = await axios.get("http://localhost:5000/api", { params });
      setDrugs(res.data.data);
      setTotal(res.data.pagination.totalCount || 0);
    } catch (err) {
      console.error("Failed to load drugs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/companies");
      setCompanies(["All Companies", ...res.data.data]);
    } catch (err) {
      console.error("Failed to load companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCompany]);

  useEffect(() => {
    fetchDrugs();
  }, [page, search, selectedCompany]);

  const clearSearch = () => setSearch("");
  const clearFilters = () => {
    setSearch("");
    setSelectedCompany("");
    setPage(1);
  };

  const getSerialNumber = (index) => (page - 1) * pageSize + index + 1;

  const handleCompanyClick = (companyName) => {
    setSelectedCompany(companyName);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-blue-600">PharmaDB</h1>
            <p className="text-gray-600">National Drug Database</p>
          </div>
          <div className="text-sm text-gray-500">{total} drugs found</div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-shrink-0 w-full md:w-auto md:flex-1 md:max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search by NDC, name, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-14 py-5 text-lg font-medium
                   bg-white border-2 border-gray-300 rounded-2xl
                   shadow-lg focus:shadow-xl
                   focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                   transition-all duration-300
                   placeholder-gray-500
                   min-w-0"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition z-10"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value || "")}
            className="w-full md:w-80 px-6 py-5 text-lg bg-white border-2 border-gray-300 rounded-2xl 
                 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                 shadow-md hover:shadow-lg transition-all duration-300"
          >
            {companies.map((company) => (
              <option
                key={company}
                value={company === "All Companies" ? "" : company}
              >
                {company}
              </option>
            ))}
          </select>

          {(search || selectedCompany) && (
            <button
              onClick={clearFilters}
              className="px-8 py-4 bg-red-400 hover:bg-red-500 text-white font-medium rounded-xl transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Loading drugs...</p>
            </div>
          ) : drugs.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl">
              No drugs found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th className="px-8 py-5 text-left font-semibold w-20">
                        Id
                      </th>
                      <th className="px-8 py-5 text-left font-semibold">
                        Code
                      </th>
                      <th className="px-8 py-5 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-8 py-5 text-left font-semibold">
                        Company
                      </th>
                      <th className="px-8 py-5 text-left font-semibold">
                        Launch Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {drugs.map((drug, index) => (
                      <tr
                        key={drug.code}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="px-8 py-5 text-center font-medium text-gray-700">
                          {getSerialNumber(index)}
                        </td>
                        <td className="px-8 py-5 font-mono text-sm text-gray-700">
                          {drug.code}
                        </td>
                        <td className="px-8 py-5 max-w-md">
                          <div className="font-semibold text-gray-900 break-words">
                            {drug.genericName}
                          </div>
                          {drug.brandName && (
                            <div className="text-sm text-blue-600 font-medium mt-1">
                              ({drug.brandName})
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <button
                            onClick={() => handleCompanyClick(drug.company)}
                            className={`font-medium transition-all hover:text-blue-600 hover:underline ${
                              selectedCompany === drug.company
                                ? "text-blue-600 underline"
                                : "text-gray-700"
                            }`}
                          >
                            {drug.company}
                          </button>
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          {new Date(drug.launchDate)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, ".")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <Pagination
                  current={page}
                  total={total}
                  pageSize={pageSize}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                  className="flex justify-center"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
