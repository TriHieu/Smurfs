function drawTable() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Tháng');
    data.addColumn('string', 'Nhiệt độ');
    data.addColumn('string', 'Độ ẩm');
    data.addColumn('string', 'Cường độ ánh sáng');
    data.addRows([
      ['Tháng 1', '27', '35', '50'],
      ['Tháng 2', '27', '35', '50'],
      ['Tháng 3', '27', '35', '50'],
      ['Tháng 4', '27', '35', '50'],
    //   ['Bob', {
    //     v: 7000,
    //     f: '$7,000'
    //   }, true]
    ]);

    var table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data, {
        title: 'Bảng số liệu các chỉ số của trang trại',
        showRowNumber: true,
        width: 'auto',
        height: '100%'
    });
  }

function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Tháng', 'Nhiệt độ', 'Expenses'],
      ['Tháng 1',  1000,      400],
      ['Tháng 2',  1170,      460],
      ['Tháng 3',  660,       1120],
      ['Tháng 4',  1030,      540]
    ]);

    var options = {
      title: 'Biểu đồ các chỉ số của trang trại',
      curveType: 'function',
      legend: { position: 'bottom' },
      width: '500px',
        height: '300px'
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}
