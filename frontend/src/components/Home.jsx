import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import NavbarComponent from "./NavbarComponent.jsx";
import ChartComponent from "./dashboard/ChartComponent.jsx";
import { useEffect, useState } from "react";
import { addDays, subDays, isSameDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const [totPurchase, setTotPurchase] = useState(0);
  const [totOrder, setTotOrder] = useState(0);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [openDetail, setOpenDetail] = useState({});
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const handleToday = () => {
    const today = new Date();
    setDateRange([today, today]);
  };

  const handlePrevDay = () => {
    const prev = subDays(startDate, 1);
    setDateRange([prev, prev]);
  };

  const handleNextDay = () => {
    const next = addDays(startDate, 1);
    setDateRange([next, next]);
  };

  useEffect(() => {
    // reset detail saat tanggal berubah
    setOpenDetail({});
  }, [startDate, endDate]);

  return (
    <>
      <NavbarComponent />
      <Container>
        {/* Breadcrumb */}
        <Row className="mt-3 bg-body-tertiary rounded p-3 pb-0">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Ringkasan */}
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col xl={6} md={6} sm={12}>
            <div className="shadow-sm card bg-body border-0">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Penjualan {new Date().getFullYear()}
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  Rp {totOrder.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </Col>
          <Col xl={6} md={6} sm={12}>
            <div className="shadow-sm card bg-body border-0">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Pembelian {new Date().getFullYear()}
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  Rp {totPurchase.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Filter Tanggal & Data Penjualan */}
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col xl={6} md={6} sm={12}>
            <div className="mb-3">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <button className="btn btn-outline-primary btn-sm" onClick={handlePrevDay}>
                  &larr; Sebelumnya
                </button>
                <button className="btn btn-outline-success btn-sm" onClick={handleToday}>
                  Hari Ini
                </button>
                <button className="btn btn-outline-primary btn-sm" onClick={handleNextDay}>
                  Berikutnya &rarr;
                </button>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable={true}
                  dateFormat="yyyy-MM-dd"
                  className="form-control form-control-sm"
                />
              </div>
              <div className="mt-2">
                <small>
                  Menampilkan data dari{" "}
                  <strong>{startDate?.toLocaleDateString()}</strong> sampai{" "}
                  <strong>{endDate?.toLocaleDateString()}</strong>
                </small>
              </div>
            </div>

            <h5>
              Penjualan Kategori{" "}
              {isSameDay(startDate, endDate)
                ? `per ${startDate.toLocaleDateString("id-ID")}`
                : `dari ${startDate.toLocaleDateString("id-ID")} sampai ${endDate.toLocaleDateString("id-ID")}`}
            </h5>

            {salesByCategory.length > 0 ? (
              salesByCategory.map((item, index) => (
                <div key={index} className="mb-3 border-bottom pb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.kategoryName}</strong>: Rp{" "}
                      {item.seharga.toLocaleString("id-ID")}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        setOpenDetail((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                    >
                      {openDetail[item.id] ? "Sembunyikan" : "Lihat Detail"}
                    </button>
                  </div>

                  {openDetail[item.id] && (
                    <div className="mt-2">
                      {item.products?.length > 0 ? (
                        <table className="table table-sm table-bordered mt-2">
                          <thead className="table-light">
                            <tr>
                              <th>Nama Produk</th>
                              <th>Qty</th>
                              <th>Total Harga</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.products.map((prod, idx) => (
                              <tr key={idx}>
                                <td>{prod.productName}</td>
                                <td>{prod.qty}</td>
                                <td>Rp {prod.totalPrice.toLocaleString("id-ID")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-muted mt-1">Belum ada penjualan produk</div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="d-flex align-items-center gap-2 text-muted">
                <span className="spinner-border spinner-border-sm"></span> Memuat data...
              </div>
            )}
          </Col>
        </Row>

        {/* Chart */}
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <div className="shadow-sm card bg-body border-0">
              <div className="card-body">
                <ChartComponent
                  startDate={startDate}
                  endDate={endDate}
                  setTotPurchase={setTotPurchase}
                  setTotOrder={setTotOrder}
                  setSalesByCategory={setSalesByCategory}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
