import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi, ColorType, type Time } from 'lightweight-charts';
import getStore from '../../store/store';
import ChartToolbar from './ToolBar';
import { getCSSColor } from '../../utils/theme';

export const Chart: React.FC = observer(() => {
  const store = getStore();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Lưu cache symbol/interval để nhận biết khi nào cần thay máu toàn bộ dữ liệu
  const prevSymbolRef = useRef<string>('');
  const prevIntervalRef = useRef<string>('');

  // Lấy cây nến cuối cùng ra để tối ưu hóa mảng dependency
  const lastKline = store.klines[store.klines.length - 1];
  const isLight = store.theme === 'light';

  // 1. Khởi tạo Chart và Xử lý co giãn thông minh (ResizeObserver)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#161a1e' },
        textColor: '#848e9c',
        fontFamily: 'var(--font-primary)',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(43, 49, 57, 0.1)' },
        horzLines: { color: 'rgba(43, 49, 57, 0.1)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#00b4d8', width: 1, style: 3, labelBackgroundColor: '#00b4d8' },
        horzLine: { color: '#00b4d8', width: 1, style: 3, labelBackgroundColor: '#00b4d8' },
      },
      rightPriceScale: { borderColor: '#2b3139', autoScale: true },
      timeScale: { borderColor: '#2b3139', timeVisible: true, secondsVisible: false },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      handleScroll: { mouseWheel: true, pressedMouseMove: true }
    });

    const downColor = '#f84960';
    const upColor = '#02c076';

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor, downColor,
      borderUpColor: upColor, borderDownColor: downColor,
      wickUpColor: upColor, wickDownColor: downColor,
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Sử dụng ResizeObserver thay cho window resize để bắt được cả sự kiện đóng/mở Sidebar
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !chartRef.current) return;
      const { width, height } = entries[0].contentRect;
      chartRef.current.applyOptions({ width, height });
    });

    resizeObserver.observe(chartContainerRef.current);

    // Dọn dẹp bộ nhớ chống tràn (Memory Leak)
    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // ==========================================================================
  // 2. CẬP NHẬT THEME ĐỘNG (Sửa lỗi lệch pha màu khi Swap)
  // ==========================================================================
  // ==========================================================================
  // 2. CẬP NHẬT THEME ĐỘNG (Đã tối ưu hiệu năng & Sửa lỗi lệch pha màu)
  // ==========================================================================
  useEffect(() => {
    if (!chartRef.current) return;

    const currentTheme = store.theme; // 'dark' hoặc 'light'

    // Bảng map màu sắc đồng bộ 100% với file index.css (Loại bỏ toán tử ba ngôi rườm rà)
    const themeColors = {
      dark: {
        bg: '#080a0c',          // --bg-main
        text: '#848e9c',        // --color-text-secondary
        grid: 'rgba(43, 49, 57, 0.1)',
        border: 'rgba(43, 49, 57, 0.6)', // --border-color
        accent: '#00b4d8'       // --color-accent
      },
      light: {
        bg: '#f8f9fa',
        text: '#707a8a',
        grid: 'rgba(0, 0, 0, 0.05)',
        border: 'rgba(200, 204, 210, 0.6)',
        accent: '#0077b6'
      }
    }[currentTheme];

    // Thực hiện cập nhật cấu hình Canvas chỉ với 1 lượt chạy duy nhất
    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: themeColors.bg },
        textColor: themeColors.text,
      },
      grid: {
        vertLines: { color: themeColors.grid },
        horzLines: { color: themeColors.grid },
      },
      crosshair: {
        vertLine: { color: themeColors.accent, labelBackgroundColor: themeColors.accent },
        horzLine: { color: themeColors.accent, labelBackgroundColor: themeColors.accent },
      },
      rightPriceScale: { borderColor: themeColors.border },
      timeScale: { borderColor: themeColors.border },
    });

  }, [store.theme]); // Tối ưu: Chỉ lắng nghe duy nhất store.theme

  // 2. Lắng nghe và đồng bộ dữ liệu Real-time (Đã tối ưu mảng quan sát)
  useEffect(() => {
    const series = seriesRef.current;
    if (!series || store.klines.length === 0) return;

    const symbolChanged = prevSymbolRef.current !== store.selectedSymbol;
    const intervalChanged = prevIntervalRef.current !== store.selectedInterval;

    if (symbolChanged || intervalChanged) {
      // Đổi cặp tiền hoặc khung thời gian -> Vẽ lại từ đầu cả chart
      series.setData(store.klines.map(k => ({
        ...k,
        time: k.time as Time
      })));

      // Đưa đồ thị về trạng thái vừa vặn khung hình
      requestAnimationFrame(() => {
        chartRef.current?.timeScale().fitContent();
      });

      prevSymbolRef.current = store.selectedSymbol;
      prevIntervalRef.current = store.selectedInterval;
    } else if (lastKline) {
      // Chỉ cập nhật tick nến cuối cùng (Tối ưu hóa tối đa tốc độ vẽ đồ thị của TradingView)
      series.update({
        ...lastKline,
        time: lastKline.time as Time
      });
    }
    // Mảng dependency gọn gàng, loại bỏ klines.length thừa thãi
  }, [store.selectedSymbol, store.selectedInterval, store.klines.length, lastKline?.time,     // Trình theo dõi 2: Thời gian nến cuối thay đổi
  lastKline?.close]);

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChartToolbar />
      <div ref={chartContainerRef} style={{ flex: 1, position: 'relative', width: '100%', height: '100%', minHeight: '300px' }} />
    </div>
  );
});

export default Chart;