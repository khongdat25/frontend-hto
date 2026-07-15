import { useState, useEffect } from "react";

// Mock initial data if localStorage is empty
const INITIAL_SURVEYS = [
  {
    id: "survey-1",
    title: "Khảo sát nhu cầu Du học Đức 2026",
    baseUrl: "https://zalo.me/s/4590120319578198541/",
    status: "active",
    createdAt: "2026-07-01T08:00:00.000Z",
  },
  {
    id: "survey-2",
    title: "Khảo sát tuyển sinh Chương trình hè Singapore",
    baseUrl: "https://zalo.me/s/4590120319578198542/",
    status: "active",
    createdAt: "2026-07-05T14:30:00.000Z",
  },
  {
    id: "survey-3",
    title: "Khảo sát nhu cầu Visa định cư Canada",
    baseUrl: "https://zalo.me/s/4590120319578198543/",
    status: "inactive",
    createdAt: "2026-07-10T09:15:00.000Z",
  },
];

const LOCAL_STORAGE_KEY = "hto_surveys_data";

export const SurveyManagementPage = ({ currentUser }) => {
  const [surveys, setSurveys] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  
  // Form States
  const [formTitle, setFormTitle] = useState("");
  const [formBaseUrl, setFormBaseUrl] = useState("");
  const [formStatus, setFormStatus] = useState("active");
  const [error, setError] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        setSurveys(JSON.parse(storedData));
      } catch {
        setSurveys(INITIAL_SURVEYS);
      }
    } else {
      setSurveys(INITIAL_SURVEYS);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SURVEYS));
    }
  }, []);

  // Save to localStorage whenever surveys change
  const saveSurveys = (updatedSurveys) => {
    setSurveys(updatedSurveys);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSurveys));
  };

  // Open Modal for Add/Edit
  const openModal = (survey = null) => {
    if (survey) {
      setEditingSurvey(survey);
      setFormTitle(survey.title);
      setFormBaseUrl(survey.baseUrl);
      setFormStatus(survey.status);
    } else {
      setEditingSurvey(null);
      setFormTitle("");
      setFormBaseUrl("");
      setFormStatus("active");
    }
    setError("");
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSurvey(null);
    setFormTitle("");
    setFormBaseUrl("");
    setError("");
  };

  // Handle Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = formTitle.trim();
    const trimmedBaseUrl = formBaseUrl.trim();

    if (!trimmedTitle) {
      setError("Vui lòng nhập tên khảo sát.");
      return;
    }

    if (!trimmedBaseUrl || !trimmedBaseUrl.startsWith("http")) {
      setError("Đường dẫn khảo sát phải hợp lệ và bắt đầu bằng http:// hoặc https://");
      return;
    }

    if (editingSurvey) {
      // Edit mode
      const updated = surveys.map((s) =>
        s.id === editingSurvey.id
          ? {
              ...s,
              title: trimmedTitle,
              baseUrl: trimmedBaseUrl,
              status: formStatus,
            }
          : s
      );
      saveSurveys(updated);
    } else {
      // Add mode
      const newSurvey = {
        id: `survey-${Date.now()}`,
        title: trimmedTitle,
        baseUrl: trimmedBaseUrl,
        status: formStatus,
        createdAt: new Date().toISOString(),
      };
      saveSurveys([newSurvey, ...surveys]);
    }
    closeModal();
  };

  // Toggle Survey Status
  const handleToggleStatus = (id) => {
    const updated = surveys.map((s) =>
      s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    );
    saveSurveys(updated);
  };

  // Delete Survey
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa form khảo sát này không?")) {
      const updated = surveys.filter((s) => s.id !== id);
      saveSurveys(updated);
    }
  };

  // Copy Link with a dummy CTV code just to preview
  const handleCopyPreviewLink = (baseUrl) => {
    const cleanUrl = baseUrl.replace(/\/$/, "");
    const separator = cleanUrl.includes("?") ? "&" : "?";
    const previewUrl = `${cleanUrl}${separator}ctv=MA_PREVIEW`;
    navigator.clipboard.writeText(previewUrl);
    alert("Đã sao chép link preview mẫu: " + previewUrl);
  };

  // Filter and search
  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.baseUrl.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && s.status === statusFilter;
  });

  return (
    <div className="survey-management-page mx-auto w-full max-w-[1280px] bg-[#f8fbff] px-3 py-4 text-slate-900 app-dark:bg-[#151515] app-dark:text-slate-100 sm:px-4">
      {/* HEADER SECTION */}
      <section className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(30,64,175,0.06)] app-dark:border-slate-700 app-dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-xl font-black text-slate-950 app-dark:text-slate-50">
            Quản lý Form Khảo sát
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Quản lý các đường dẫn khảo sát Zalo Mini App để phân phối mã QR và link giới thiệu cho Cộng tác viên.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-750 app-dark:bg-sky-500 app-dark:shadow-none"
          type="button"
          onClick={() => openModal()}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Thêm khảo sát
        </button>
      </section>

      {/* SEARCH AND FILTER BAR */}
      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm app-dark:border-slate-700 app-dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc đường dẫn..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150 app-dark:border-slate-700 app-dark:bg-slate-950"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
              </svg>
            </span>
          </div>
          <div className="w-full sm:w-[180px]">
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 app-dark:border-slate-700 app-dark:bg-slate-950"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>
        </div>
      </section>

      {/* TABLE LIST SECTION */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(30,64,175,0.06)] app-dark:border-slate-700 app-dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500 app-dark:bg-slate-950">
              <tr>
                <th className="px-4 py-3">Tên Khảo sát</th>
                <th className="px-4 py-3">Link Gốc (Zalo App)</th>
                <th className="px-4 py-3 text-center">Trạng Thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 app-dark:divide-slate-800">
              {filteredSurveys.length > 0 ? (
                filteredSurveys.map((survey) => (
                  <tr
                    key={survey.id}
                    className="hover:bg-slate-50/50 app-dark:hover:bg-slate-950/20"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 app-dark:text-slate-50">
                      {survey.title}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="font-mono max-w-[280px] truncate block" title={survey.baseUrl}>
                          {survey.baseUrl}
                        </span>
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() => handleCopyPreviewLink(survey.baseUrl)}
                          title="Copy Link CTV Preview mẫu"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Status Switcher Toggle */}
                        <button
                          type="button"
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            survey.status === "active" ? "bg-green-500" : "bg-slate-200 app-dark:bg-slate-700"
                          }`}
                          onClick={() => handleToggleStatus(survey.id)}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              survey.status === "active" ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-black uppercase ${
                            survey.status === "active"
                              ? "bg-green-100 text-green-800 app-dark:bg-green-950/30 app-dark:text-green-400"
                              : "bg-slate-100 text-slate-800 app-dark:bg-slate-850 app-dark:text-slate-400"
                          }`}
                        >
                          {survey.status === "active" ? "Bật" : "Tắt"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(survey.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 app-dark:border-slate-750 app-dark:bg-slate-950 app-dark:text-slate-400"
                          type="button"
                          onClick={() => openModal(survey)}
                          title="Chỉnh sửa"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button
                          className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 app-dark:border-rose-900/30 app-dark:bg-rose-950/20 app-dark:text-rose-400"
                          type="button"
                          onClick={() => handleDelete(survey.id)}
                          title="Xóa"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                    Không tìm thấy form khảo sát nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* FORM DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1080] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
          <form
            className="w-full max-w-[520px] rounded-2xl bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.28)] app-dark:bg-slate-900 border border-slate-200 app-dark:border-slate-800"
            onSubmit={handleSubmit}
          >
            {/* Modal Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {editingSurvey ? "Chỉnh sửa" : "Tạo mới"}
                </span>
                <h2 className="m-0 text-lg font-black text-slate-950 app-dark:text-slate-50">
                  {editingSurvey ? "Thông tin khảo sát" : "Form khảo sát mới"}
                </h2>
              </div>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-full border-0 bg-slate-100 text-lg leading-none text-slate-800 hover:bg-slate-200 app-dark:bg-slate-800 app-dark:text-slate-200"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <label className="block text-xs font-extrabold text-slate-700 app-dark:text-slate-300">
                Tên chương trình khảo sát
                <input
                  type="text"
                  placeholder="Ví dụ: Khảo sát Du học nghề Đức khóa 10"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-150 app-dark:border-slate-700 app-dark:bg-slate-950"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </label>

              <label className="block text-xs font-extrabold text-slate-700 app-dark:text-slate-300">
                Link khảo sát gốc (Không kèm mã CTV)
                <input
                  type="url"
                  placeholder="Ví dụ: Link Google Form, Zalo Mini App, Typeform, v.v."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-150 app-dark:border-slate-700 app-dark:bg-slate-950"
                  value={formBaseUrl}
                  onChange={(e) => setFormBaseUrl(e.target.value)}
                  required
                />
              </label>

              <div className="block text-xs font-extrabold text-slate-700 app-dark:text-slate-300">
                Trạng thái
                <div className="mt-2 flex gap-4">
                  <label className="inline-flex items-center gap-2 font-medium cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formStatus === "active"}
                      onChange={() => setFormStatus("active")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    Hoạt động
                  </label>
                  <label className="inline-flex items-center gap-2 font-medium cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formStatus === "inactive"}
                      onChange={() => setFormStatus("inactive")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    Tạm dừng
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 app-dark:border-slate-700 app-dark:bg-slate-800 app-dark:text-slate-200"
                onClick={closeModal}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-750 app-dark:bg-sky-500 app-dark:shadow-none"
              >
                {editingSurvey ? "Lưu thay đổi" : "Tạo khảo sát"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
