const form = document.getElementById('vote-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const choice = document.querySelector('input[name=os]:checked').value;
    const data = { os: choice };

    fetch('https://pusher-polling.herokuapp.com/poll', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
})

fetch('https://pusher-polling.herokuapp.com/poll')
.then(res => res.json())
.then(data => {
    const votes = data.votes;
            const totalVotes = votes.length;
            // Count vote points
            const voteCounts = votes.reduce((acc, vote) => ((acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc), {})

            let dataPoints = [
                { label: 'Windows', y: voteCounts.Windows },
                { label: 'Ubuntu', y: voteCounts.Ubuntu },
                { label: 'MacOs', y: voteCounts.MacOs },
                { label: 'Linux', y: voteCounts.Linux },
                { label: 'Other', y: voteCounts.Other }
            ];

            const chartContainer = document.querySelector('#chartContainer');

            if (chartContainer) {
                var chart = new CanvasJS.Chart('chartContainer', {
                    animationEnabled: true,
                    theme: 'theme2',
                    title: {
                        text: `Total Votes: ${totalVotes}`
                    },
                    data: [
                        {
                            type: 'column',
                            dataPoints: dataPoints
                        }
                    ]
                })
                chart.render();
            }

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('385f3f62ca9f1bc09dc1', {
                cluster: 'us2',
                encrypted: true
            });

            var channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function (data) {
                dataPoints = dataPoints.map(x => {
                    if (x.label == data.os) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }
                })
                chart.render();
            });
        })
        .catch(err => console.log(err))
