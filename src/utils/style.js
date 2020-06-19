/**
 * 样式定制
 */
export const headerRowStyle = ({ row, rowIndex }) => {
  return "background:#efefef;text-align:center;height:56px;white-space: nowrap;font-size:14px;color:#333;font-weight:bold";
};
// 询价页面用
export const enquireCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 2) {
    return "color:#666;text-align:left;font-size:14px;margin-left:55px;";
  } else {
    return "color:#666;text-align:center;font-size:14px;";
  }
};
// 投保页面用
export const insureCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  return "color:#666;text-align:center;font-size:14px;";
};
