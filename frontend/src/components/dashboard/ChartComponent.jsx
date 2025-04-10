import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ startDate, endDate,setTotPurchase, setTotOrder, setSalesByCategory }) => {
  const [purchase, setPurchase] = useState([]);
  const [order, setOrder] = useState([]);
  const [catPurchase, setCatPurchase] = useState([]);

  const loadPurchase = useCallback(async () => {
    const out = await axiosInstance.get("/api/purchase-year");
    const result = Array.isArray(out.data.result) ? out.data.result : [];
    setPurchase(result);
    setTotPurchase(result.reduce((a, b) => a + b, 0));
  }, [setTotPurchase]);

  const loadPurchasebyCategory = useCallback(async () => {
    try {
      const adjustedStartDate = new Date(startDate);
      adjustedStartDate.setHours(0, 0, 0, 0);
      const startStr = adjustedStartDate.toISOString();
  
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      const endStr = adjustedEndDate.toISOString();
  
      const out = await axiosInstance.get(
        `/api/categorys/sales?startDate=${startStr}&endDate=${endStr}`
      );
      console.log("📦 API response:", out.data);
      setCatPurchase(out.data.result);
      setSalesByCategory(out.data.result);
    } catch (err) {
      console.error("❌ Error fetch kategori:", err);
    }
  }, [startDate, endDate, setSalesByCategory]);
  

  const loadOrder = useCallback(async () => {
    const out = await axiosInstance.get("/api/orders-year");
    const result = Array.isArray(out.data.result) ? out.data.result : [];
    setOrder(result);
    setTotOrder(result.reduce((a, b) => a + b, 0));
  }, [setTotOrder]);

  useEffect(() => {
    loadPurchase();
    loadOrder();
    loadPurchasebyCategory();
  }, [loadPurchase, loadOrder, loadPurchasebyCategory]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Grafik penjualan Angkringan Sabira ${new Date().getFullYear()}`,
      },
    },
  };

  const labels = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Penjualan",
        data: order,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Pembelian",
        data: purchase,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

ChartComponent.propTypes = {
  setTotPurchase: PropTypes.func.isRequired,
  setTotOrder: PropTypes.func.isRequired,
  setSalesByCategory: PropTypes.func.isRequired,
};

export default ChartComponent;
