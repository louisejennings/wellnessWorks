Highcharts.chart('engagementReport', {
 chart: {
        type: 'bar'
    },
    title: {
        text: 'Event Engagement Analytics'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: ['5K Run','Scavenger Hunt','Bake Sale', 'Freebie Fruit Friday','Volunteer Hour', 'Easter Hunt','test','Yoga'],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Employees',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 0,
        y: 0,
        floating: true,
        borderWidth: 1,
        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'RSVP',
        data: [20, 16, 14, 22, 26, 16, 18, 20],
        color: "#00802d"
    }, {
        name: 'Attending',
        data: [18, 16, 15, 22, 20, 15, 18, 14],
        color: "#8db929"
    }]   
});