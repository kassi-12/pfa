const ctx = document.getElementById('ordersChart').getContext('2d');
const ordersChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'Total Paid Orders',
            data: [0, 0, 0, 0, 182.31, 0, 0, 20.32, 0, 0, 0, 0],
            backgroundColor: 'rgba(108, 155, 207, 0.8)',
            borderColor: 'rgba(108, 155, 207, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});