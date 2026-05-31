import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi, ColorType, type Time } from 'lightweight-charts';
import getStore from '../../store/store';
import ChartToolbar from './ToolBar';

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