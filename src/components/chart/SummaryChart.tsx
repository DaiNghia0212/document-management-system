import Chart from 'react-apexcharts'

type Props = {
  items: {
    status: string
    count: number
  }[]
}

const SummaryChart = ({ items }: Props) => {
  return (
    <>
      <Chart
        type='donut'
        width={'100%'}
        height={'100%'}
        series={items.map((item) => item.count)}
        options={{
          labels: items.map((item) => item.status),
          colors: ['var(--primary-color)', 'var(--red-color)'],
          plotOptions: {
            pie: {
              customScale: 0.9,
              expandOnClick: false,
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    showAlways: true,
                    //formatter: () => '343',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'var(--black-color)'
                  }
                }
              }
            }
          },
          legend: {
            position: 'bottom',
            offsetX: 0,
            formatter: function (legendName, opts) {
              return legendName + ' - ' + opts.w.globals.series[opts.seriesIndex]
            },
            itemMargin: {
              horizontal: 15
            }
          },
          dataLabels: {
            enabled: false
          },
          responsive: [
            {
              breakpoint: 900,
              options: {
                legend: {
                  position: 'right'
                }
              }
            },
            {
              breakpoint: 600,
              options: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          ]
        }}
      />
    </>
  )
}
export default SummaryChart
