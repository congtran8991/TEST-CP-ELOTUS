import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi, ColorType, type Time } from 'lightweight-charts';
import getStore from '../../store/store';
import ChartToolbar from './ToolBar'; // Import thanh toolbar vừa tách

export const Chart: React.FC = observer(() => {
  const store = getStore();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const prevSymbolRef = useRef<string>('');
  const prevIntervalRef = useRef<string>('');

  // 1. Khởi tạo cấu hình Chart Canvas ban đầu
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
        vertLines: { color: 'rgba(43, 49, 57, 0.2)' },
        horzLines: { color: 'rgba(43, 49, 57, 0.2)' },
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

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // 2. Lắng nghe và đồng bộ dữ liệu Real-time
  useEffect(() => {
    const series = seriesRef.current;
    if (!series || store.klines.length === 0) return;

    const symbolChanged = prevSymbolRef.current !== store.selectedSymbol;
    const intervalChanged = prevIntervalRef.current !== store.selectedInterval;

    if (symbolChanged || intervalChanged) {
      series.setData(store.klines.map(k => ({
        ...k,
        time: k.time as Time
      })));

      setTimeout(() => {
        chartRef.current?.timeScale().fitContent();
      }, 50);

      prevSymbolRef.current = store.selectedSymbol;
      prevIntervalRef.current = store.selectedInterval;
    } else {
      const lastKline = store.klines[store.klines.length - 1];
      series.update({
        ...lastKline,
        time: lastKline.time as Time
      });
    }

  }, [store.klines.length, store.selectedSymbol, store.selectedInterval, store.klines[store.klines.length - 1]]);

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Nhúng thanh công cụ Chart Toolbar */}
      <ChartToolbar />

      {/* Vùng không gian vẽ đồ thị Chart Canvas */}
      <div ref={chartContainerRef} style={{ flex: 1, position: 'relative', width: '100%', height: '100%', minHeight: '300px' }} />
    </div>
  );
});

export default Chart;