/**
 * Đọc giá trị màu thực tế (Hex/RGB) của một biến CSS var() từ DOM
 * @param variableName Tên biến CSS (Ví dụ: '--bg-main')
 * @returns Chuỗi mã màu đã được làm sạch khoảng trống
 */
export const getCSSColor = (variableName: string): string => {
  // Đảm bảo code chỉ chạy trên môi trường trình duyệt (Client-side)
  if (typeof window === 'undefined') return '';

  return getComputedStyle(document.body).getPropertyValue(variableName).trim();
};