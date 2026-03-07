type DownloadCSVProps = {
  headers?: string[];
  data?: string[][];
  filename?: string;
};

const defaultHeaders = ['Name', 'Statistics', 'Change', 'ChangeType'];
const defaultData = [
  ['Total candidates', '3,450', '+12.1%', 'positive'],
  ['Total interviews', '100', '+100%', 'positive'],
  ['Average duration', '5.2min', '+7.7%', 'positive'],
  ['Total interviews', '1,342', '-9.8%', 'negative']
];
const defaultFilename = 'dashboard-stats.csv';

export const downloadCSV = (props?: DownloadCSVProps) => {
  const { headers = defaultHeaders, data = defaultData, filename = defaultFilename } = props || {};
  const csv = [headers.join(','), ...data.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
