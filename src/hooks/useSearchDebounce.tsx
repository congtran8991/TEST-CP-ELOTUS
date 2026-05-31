import { useState, useEffect } from 'react';

/**
 * Hook "tất cả trong một" quản lý ô nhập liệu và tự động kích hoạt action sau khi gõ xong
 * @param initialValue Giá trị khởi tạo ban đầu lấy từ Store chính
 * @param onDebounceAction Hàm Action của SatchelJS cần kích hoạt (ví dụ: setSearchQueryAction)
 * @param delay Thời gian chờ, mặc định 300ms
 */
export function useSearchDebounce(
  initialValue: string,
  onDebounceAction: (val: string) => void,
  delay: number = 300
) {
  // Quản lý chữ hiển thị tức thì trên ô Input
  const [value, setValue] = useState(initialValue);

  // Lắng nghe và đồng bộ ngược nếu Store chính bị thay đổi/reset từ bên ngoài
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Tự động kích hoạt Action sau khi người dùng dừng gõ đủ thời gian delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onDebounceAction(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onDebounceAction]);

  // Trả ra giá trị để gắn vào thuộc tính value, và hàm để gắn vào onChange của thẻ input
  return [value, setValue] as const;
}

export default useSearchDebounce;