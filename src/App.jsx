import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { DocumentsPage } from "./components/DocumentsPage";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    const storedTheme = window.localStorage.getItem("app-theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    window.localStorage.setItem("app-theme", theme);
  }, [theme]);

  const handleToggleSidebar = (e) => {
    const togglerBtn = e?.currentTarget;
    togglerBtn?.classList?.toggle("active");

    if (window.innerWidth >= 1191) {
      const currentValue =
        document.documentElement.getAttribute("data-app-sidebar");
      const nextValue = currentValue === "full" ? "mini" : "full";
      document.documentElement.setAttribute("data-app-sidebar", nextValue);
      return;
    }

    document.querySelectorAll(".app-menubar").forEach((menubar) => {
      menubar.classList.toggle("open");
    });
  };

  const handleToggleTheme = (e) => {
    e?.preventDefault?.();
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="page-layout">
      {/* 1. Các thành phần cố định */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        onToggleTheme={handleToggleTheme}
      />
      <Sidebar
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* 2. Phần Main Content bạn vừa gửi */}
      <main className="app-wrapper">
        {currentPage === "documents" ? (
          <DocumentsPage />
        ) : (
          <div className="container-fluid">
            {/* --- HEADER: CHÀO MỪNG & HÀNH ĐỘNG --- */}
            <div className="app-page-head d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <h3 className="fw-bold mb-0">Hệ Thống Quản Trị Toàn Diện</h3>
                <p className="text-muted mb-0">
                  Chào mừng trở lại! Hôm nay có 5 nhiệm vụ mới cần xử lý.
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary shadow-sm px-4 py-2"
                  data-bs-toggle="modal"
                  data-bs-target="#addPropertyModal"
                  style={{ borderRadius: "8px", fontWeight: "600" }}
                >
                  <i className="fi fi-rr-add me-2"></i>Tạo nhiệm vụ
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary shadow-sm px-2 py-2"
                  data-bs-toggle="modal"
                  data-bs-target="#addAgentModal"
                  style={{ borderRadius: "8px", fontWeight: "600" }}
                >
                  <i className="fi fi-rr-phone-call me-2"></i>Hotline chuyên gia
                </button>
              </div>
            </div>

            <div className="row">
              {/* --- SECTION 1: CÁC CHỈ SỐ THỐNG KÊ (KPIs) --- */}
              <div className="col-xxl-6">
                <div className="row">
                  <div className="col-xxl-6 col-md-6 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-header border-0 pb-0 d-flex justify-content-between align-items-center bg-transparent">
                        <h6 className="card-title mb-0 fw-bold">
                          Tổng Nhân Sự
                        </h6>
                        <span className="badge bg-success-subtle text-success">
                          +12%
                        </span>
                      </div>
                      <div className="card-body d-flex align-items-center justify-content-between pt-1">
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md rounded-2 bg-primary-subtle text-primary me-3">
                            <i className="fi fi-rr-users-alt fs-4"></i>
                          </div>
                          <h2 className="fw-bold mb-0">1,250</h2>
                        </div>
                        <div id="Card1Chart" className="mx-n2"></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-6 col-md-6 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-header border-0 pb-0 d-flex justify-content-between align-items-center bg-transparent">
                        <h6 className="card-title mb-0 fw-bold">
                          Dự Án Hoàn Thành
                        </h6>
                        <span className="badge bg-info-subtle text-info">
                          85%
                        </span>
                      </div>
                      <div className="card-body d-flex align-items-center justify-content-between pt-1">
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md rounded-2 bg-secondary-subtle text-secondary me-3">
                            <i className="fi fi-rr-rocket-lunch fs-4"></i>
                          </div>
                          <h2 className="fw-bold mb-0">48</h2>
                        </div>
                        <div id="Card2Chart" className="mx-n2"></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-6 col-md-6 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-header border-0 pb-0 d-flex justify-content-between align-items-center bg-transparent">
                        <h6 className="card-title mb-0 fw-bold">Đánh Giá TB</h6>
                        <span className="text-warning small">
                          <i className="fi fi-ss-star me-1"></i>4.9/5
                        </span>
                      </div>
                      <div className="card-body d-flex align-items-center justify-content-between pt-1">
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md rounded-2 bg-success-subtle text-success me-3">
                            <i className="fi fi-rr-heart-arrow fs-4"></i>
                          </div>
                          <h2 className="fw-bold mb-0">98%</h2>
                        </div>
                        <div id="Card3Chart" className="mx-n2"></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-6 col-md-6 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-header border-0 pb-0 d-flex justify-content-between align-items-center bg-transparent">
                        <h6 className="card-title mb-0 fw-bold">
                          Thông Báo Mới
                        </h6>
                      </div>
                      <div className="card-body d-flex align-items-center pt-1">
                        <div className="avatar avatar-md rounded-2 bg-info-subtle text-info me-3">
                          <i className="fi fi-rr-bell fs-4"></i>
                        </div>
                        <h2 className="fw-bold mb-0">12</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- SECTION 2: BIỂU ĐỒ TĂNG TRƯỞNG CHI TIẾT --- */}
              <div className="col-xxl-6 mb-4">
                <div className="card  border-0 shadow-sm">
                  <div className="card-header border-0 pb-0 d-flex align-items-center justify-content-between bg-transparent">
                    <h6 className="card-title mb-0 fw-bold">
                      Hiệu Suất Phòng Ban (Quý 2)
                    </h6>
                    <div className="dropdown">
                      <button
                        className="btn btn-light btn-sm dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        Hàng tuần
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="#">
                            Hàng tháng
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body pt-2 pb-0">
                    <div className="mb-3 d-flex align-items-center gap-2">
                      <h2 className="mb-0 fw-bold text-primary">94.2%</h2>
                      <span className="text-success small fw-medium">
                        <i className="fi fi-rr-arrow-trend-up me-1"></i>+2.4%
                      </span>
                    </div>
                    <div
                      id="PropertySalesChart"
                      style={{ height: "180px" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* --- SECTION 3: BẢNG NHIỆM VỤ PHÒNG BAN --- */}
              <div className="col-xxl-8 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header border-0 py-3 bg-transparent">
                    <h6 className="card-title mb-0 fw-bold">
                      Trạng Thái Nhiệm Vụ Phòng Ban
                    </h6>
                  </div>
                  <div className="card-body pt-0">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0">Phòng Ban</th>
                            <th className="border-0 text-center">Tiến Độ</th>
                            <th className="border-0">Thành Viên</th>
                            <th className="border-0 text-end">Hạn Chót</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              name: "Kỹ Thuật",
                              color: "primary",
                              progress: 75,
                              lead: "Liam Smith",
                              date: "20 May",
                            },
                            {
                              name: "Marketing",
                              color: "success",
                              progress: 40,
                              lead: "Sophia Lee",
                              date: "22 May",
                            },
                            {
                              name: "Nhân Sự",
                              color: "info",
                              progress: 100,
                              lead: "Ethan Brown",
                              date: "Done",
                            },
                          ].map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="fw-bold text-dark">
                                  {item.name}
                                </div>
                                <small className="text-muted">
                                  Lead: {item.lead}
                                </small>
                              </td>
                              <td style={{ width: "200px" }}>
                                <div
                                  className="progress"
                                  style={{ height: "6px" }}
                                >
                                  <div
                                    className={`progress-bar bg-${item.color}`}
                                    style={{ width: `${item.progress}%` }}
                                  ></div>
                                </div>
                              </td>
                              <td>
                                <div className="avatar-group d-flex">
                                  <img
                                    src={`/assets/images/avatar/avatar${index + 1}.webp`}
                                    className="avatar avatar-xs rounded-circle border border-white"
                                    alt=""
                                  />
                                </div>
                              </td>
                              <td className="text-end text-muted small">
                                {item.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- SECTION 4: TIN TỨC & PHẢN HỒI (FIXED ERROR) --- */}
              <div className="col-xxl-4 mb-4">
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <div className="card-header border-0 d-flex align-items-center justify-content-between bg-transparent">
                    <h6 className="card-title mb-0 fw-bold">
                      Thông Tin Sự Kiện
                    </h6>
                    <button className="btn btn-action-primary btn-sm btn-icon">
                      <i className="fi fi-bs-menu-dots"></i>
                    </button>
                  </div>
                  {/* Thêm div bao bọc để tránh lỗi removeChild của SimpleBar */}
                  <div
                    className="card-body pt-0"
                    style={{ height: "380px" }}
                    data-simplebar
                  >
                    <div className="simplebar-content-wrapper-fix">
                      {/* Event 1 */}
                      <div className="d-flex align-items-start border-bottom py-3">
                        <div className="me-3">
                          <div
                            className="bg-primary-subtle text-primary p-2 rounded text-center"
                            style={{ width: "50px" }}
                          >
                            <h5 className="mb-0 fw-bold">12</h5>
                            <small>Th5</small>
                          </div>
                        </div>
                        <div className="w-100">
                          <h6 className="mb-1 fw-bold">Teambuilding Quý 2</h6>
                          <p className="text-muted small mb-0">
                            Địa điểm: Vũng Tàu - Thời gian: 3 ngày 2 đêm.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h6 className="fw-bold mb-3 small text-uppercase">
                          Phản hồi gần đây
                        </h6>
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src="/assets/images/avatar/avatar1.webp"
                            className="avatar avatar-md rounded-circle me-3"
                            alt=""
                          />
                          <div>
                            <h6 className="mb-0 fw-bold small">Ethan Brown</h6>
                            <p className="mb-0 text-muted extra-small">
                              Cần hỗ trợ về phần mềm CRM mới.
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src="/assets/images/avatar/avatar2.webp"
                            className="avatar avatar-md rounded-circle me-3"
                            alt=""
                          />
                          <div>
                            <h6 className="mb-0 fw-bold small">Sophia Lee</h6>
                            <p className="mb-0 text-muted extra-small">
                              Báo cáo Marketing đã được gửi cho HR.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- SECTION 5: BANNER QUẢNG BÁ --- */}
            <div className="row mb-4">
              <div className="col-12">
                <div
                  className="card border-0 shadow-sm p-0 overflow-hidden"
                  style={{ borderRadius: "15px" }}
                >
                  <div className="row g-0 align-items-center">
                    <div className="col-md-8 p-4">
                      <h4 className="fw-bold text-primary">
                        Tối Ưu Hoá Hiệu Suất Với AI
                      </h4>
                      <p className="text-muted">
                        Khám phá các công cụ mới giúp tự động hóa báo cáo và
                        quản lý nhân sự hiệu quả hơn.
                      </p>
                      <button className="btn btn-primary btn-sm px-4">
                        Tìm hiểu ngay
                      </button>
                    </div>
                    <div className="col-md-4 text-end">
                      <img
                        src="/assets/images/banner-web-korean.jpg"
                        className="img-fluid"
                        style={{ maxHeight: "150px", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Footer dùng chung */}
      <Footer />
    </div>
  );
}

export default App;
