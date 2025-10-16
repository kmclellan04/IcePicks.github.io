let bankrollChart, profitChart, monthlyChart;
let currentSeasonData = null;

// Initialize charts
function initializeCharts() {
    const ctx1 = document.getElementById('bankrollChart').getContext('2d');
    bankrollChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Bankroll',
                data: [],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Bankroll: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    const ctx2 = document.getElementById('profitChart').getContext('2d');
    profitChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Daily Profit',
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Profit: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    const ctx3 = document.getElementById('monthlyChart').getContext('2d');
    monthlyChart = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Monthly Profit',
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Monthly Profit: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Get current season data based on selection
function getCurrentSeasonData() {
    const seasonSelect = document.getElementById('seasonSelect').value;
    const startDatePicker = document.getElementById('startDatePicker').value;
    
    if (seasonSelect === 'continuous') {
        // Combine 2023 and 2024 data with proper date limits
        const combined = {
            dates: [],
            betting_data: {},
            start_date: '',
            end_date: ''
        };
        
        ['2023', '2024'].forEach(season => {
            if (allSeasonsData[season]) {
                let seasonDates = allSeasonsData[season].dates;
                
                // Apply 2024 date limits if this is 2024 data
                if (season === '2024') {
                    seasonDates = seasonDates.filter(date => date >= '2024-10-23' && date <= '2025-04-12');
                }
                
                combined.dates = combined.dates.concat(seasonDates);
                
                // Add betting data for filtered dates
                seasonDates.forEach(date => {
                    if (allSeasonsData[season].betting_data[date]) {
                        combined.betting_data[date] = allSeasonsData[season].betting_data[date];
                    }
                });
            }
        });
        
        combined.dates.sort();
        combined.start_date = combined.dates[0] || '';
        combined.end_date = combined.dates[combined.dates.length - 1] || '';
        
        return combined;
    } else {
        let data = allSeasonsData[seasonSelect] || { dates: [], betting_data: {}, start_date: '', end_date: '' };
        
        // Apply 2024 date limits for 2024 season
        if (seasonSelect === '2024') {
            const filteredDates = data.dates.filter(date => date >= '2024-10-23' && date <= '2025-04-12');
            const filteredBettingData = {};
            
            filteredDates.forEach(date => {
                if (data.betting_data[date]) {
                    filteredBettingData[date] = data.betting_data[date];
                }
            });
            
            data = {
                dates: filteredDates,
                betting_data: filteredBettingData,
                start_date: '2024-10-23',
                end_date: '2025-04-12'
            };
        }
        
        // Apply additional start date filter if specified
        if (startDatePicker && seasonSelect !== 'continuous') {
            const filteredDates = data.dates.filter(date => date >= startDatePicker);
            const filteredBettingData = {};
            
            filteredDates.forEach(date => {
                if (data.betting_data[date]) {
                    filteredBettingData[date] = data.betting_data[date];
                }
            });
            
            return {
                dates: filteredDates,
                betting_data: filteredBettingData,
                start_date: filteredDates[0] || data.start_date,
                end_date: data.end_date
            };
        }
        
        return data;
    }
}

// Calculate performance metrics
function calculateMetrics(percentage, startingBankroll) {
    const seasonData = getCurrentSeasonData();
    const dailyUnitPercentage = percentage / 100;
    let currentBankroll = startingBankroll;
    const dailyResults = [];
    const monthlyData = {};
    
    let totalBets = 0;
    let totalWins = 0;
    let totalWagered = 0;
    let totalReturned = 0;
    
    // Process each day
    for (const date of seasonData.dates) {
        const games = seasonData.betting_data[date] || [];
        const dailyUnitSize = currentBankroll * dailyUnitPercentage;
        
        let dailyBet = 0;
        let dailyReturn = 0;
        let dailyWins = 0;
        let dailyBetsCount = 0;
        
        for (const game of games) {
            if (game.unit_multiplier > 0) {
                const betAmount = dailyUnitSize * game.unit_multiplier;
                const returnAmount = game.bet_won ? betAmount * game.payout : 0;
                
                dailyBet += betAmount;
                dailyReturn += returnAmount;
                dailyBetsCount++;
                totalBets++;
                
                if (game.bet_won) {
                    dailyWins++;
                    totalWins++;
                }
            }
        }
        
        const dailyProfit = dailyReturn - dailyBet;
        currentBankroll += dailyProfit;
        totalWagered += dailyBet;
        totalReturned += dailyReturn;
        
        dailyResults.push({
            date: date,
            startingBankroll: currentBankroll - dailyProfit,
            endingBankroll: currentBankroll,
            dailyProfit: dailyProfit,
            dailyBet: dailyBet,
            dailyReturn: dailyReturn,
            dailyWins: dailyWins,
            dailyBetsCount: dailyBetsCount,
            unitSize: dailyUnitSize
        });
        
        // Monthly aggregation
        const month = date.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { profit: 0, days: 0 };
        }
        monthlyData[month].profit += dailyProfit;
        monthlyData[month].days++;
    }
    
    // Calculate additional metrics
    const totalProfit = currentBankroll - startingBankroll;
    const roi = (totalProfit / startingBankroll) * 100;
    const winPercentage = totalBets > 0 ? (totalWins / totalBets) * 100 : 0;
    
    // Calculate peak bankroll
    let peakBankroll = startingBankroll;
    for (const day of dailyResults) {
        if (day.endingBankroll > peakBankroll) {
            peakBankroll = day.endingBankroll;
        }
    }
    
    // Calculate profitable days
    const profitableDays = dailyResults.filter(d => d.dailyProfit > 0).length;
    const avgDailyProfit = totalProfit / dailyResults.length;
    
    return {
        startingBankroll,
        finalBankroll: currentBankroll,
        totalProfit,
        roi,
        totalBets,
        totalWins,
        winPercentage,
        totalWagered,
        peakBankroll,
        profitableDays,
        avgDailyProfit,
        dailyResults,
        monthlyData,
        tradingDays: dailyResults.length
    };
}

// Update display
function updateDisplay() {
    const percentage = parseFloat(document.getElementById('percentageSlider').value);
    const startingBankroll = parseFloat(document.getElementById('startingBankroll').value);
    const seasonSelect = document.getElementById('seasonSelect').value;
    
    document.getElementById('percentageValue').textContent = percentage.toFixed(1);
    
    // Update data info
    const seasonData = getCurrentSeasonData();
    const dataInfo = document.getElementById('dataInfo');
    dataInfo.innerHTML = `<small>Data: ${seasonData.start_date} to ${seasonData.end_date} | ${seasonData.dates.length} trading days</small>`;
    
    const metrics = calculateMetrics(percentage, startingBankroll);
    
    // Update metrics cards with new layout
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = `
        <div class="metric-card">
            <div class="metric-value">$${metrics.finalBankroll.toLocaleString()}</div>
            <div class="metric-label">Final Bankroll</div>
        </div>
        <div class="metric-card">
            <div class="metric-value ${metrics.totalProfit >= 0 ? 'positive' : 'negative'}">$${metrics.totalProfit.toLocaleString()}</div>
            <div class="metric-label">Total Profit</div>
        </div>
        <div class="metric-card">
            <div class="metric-value ${metrics.roi >= 0 ? 'positive' : 'negative'}">${metrics.roi.toFixed(1)}%</div>
            <div class="metric-label">ROI</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">$${metrics.avgDailyProfit.toLocaleString()}</div>
            <div class="metric-label">Avg Daily Profit</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">$${metrics.peakBankroll.toLocaleString()}</div>
            <div class="metric-label">Peak Bankroll</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">$${metrics.totalWagered.toLocaleString()}</div>
            <div class="metric-label">Total Wagered</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${metrics.profitableDays} / ${metrics.tradingDays}</div>
            <div class="metric-label">Profitable Days</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${metrics.winPercentage.toFixed(1)}%</div>
            <div class="metric-label">Win Rate</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${metrics.totalWins.toLocaleString()}</div>
            <div class="metric-label">Games Won</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${metrics.totalBets.toLocaleString()}</div>
            <div class="metric-label">Games Bet</div>
        </div>
    `;
    
    // Update charts
    updateCharts(metrics);
}

// Update charts
function updateCharts(metrics) {
    // Bankroll chart
    const dates = metrics.dailyResults.map(d => d.date);
    const bankrolls = metrics.dailyResults.map(d => d.endingBankroll);
    
    bankrollChart.data.labels = dates;
    bankrollChart.data.datasets[0].data = bankrolls;
    bankrollChart.update('none');
    
    // Daily profit chart (show last 30 days for readability)
    const recentResults = metrics.dailyResults.slice(-30);
    const dailyProfits = recentResults.map(d => d.dailyProfit);
    const dailyColors = dailyProfits.map(profit => profit >= 0 ? '#4CAF50' : '#f44336');
    
    profitChart.data.labels = recentResults.map(d => d.date);
    profitChart.data.datasets[0].data = dailyProfits;
    profitChart.data.datasets[0].backgroundColor = dailyColors;
    profitChart.update('none');
    
    // Monthly chart
    const months = Object.keys(metrics.monthlyData).sort();
    const monthlyProfits = months.map(m => metrics.monthlyData[m].profit);
    const monthlyColors = monthlyProfits.map(profit => profit >= 0 ? '#2196F3' : '#f44336');
    
    monthlyChart.data.labels = months;
    monthlyChart.data.datasets[0].data = monthlyProfits;
    monthlyChart.data.datasets[0].backgroundColor = monthlyColors;
    monthlyChart.update('none');
}

// Handle season selection change
function onSeasonChange() {
    const seasonSelect = document.getElementById('seasonSelect').value;
    const startDateContainer = document.getElementById('startDateContainer');
    const startDatePicker = document.getElementById('startDatePicker');
    
    if (seasonSelect === 'continuous') {
        startDateContainer.style.display = 'none';
    } else {
        startDateContainer.style.display = 'block';
        
        // Set min and max dates based on season with proper limits
        const seasonData = allSeasonsData[seasonSelect];
        if (seasonData) {
            let minDate = seasonData.start_date;
            let maxDate = seasonData.end_date;
            let defaultDate = seasonData.start_date;
            
            // Apply 2024 date limits
            if (seasonSelect === '2024') {
                minDate = '2024-10-23';
                defaultDate = '2024-10-23';
                
                // Filter available dates to only show valid ones
                const validDates = seasonData.dates.filter(date => date >= '2024-10-23' && date <= '2025-04-12');
                if (validDates.length > 0) {
                    minDate = validDates[0];
                    maxDate = validDates[validDates.length - 1];
                    defaultDate = validDates[0];
                }
            } else if (seasonSelect === '2023') {
                // For 2023, use all available dates
                if (seasonData.dates.length > 0) {
                    minDate = seasonData.dates[0];
                    maxDate = seasonData.dates[seasonData.dates.length - 1];
                    defaultDate = seasonData.dates[0];
                }
            }
            
            startDatePicker.min = minDate;
            startDatePicker.max = maxDate;
            startDatePicker.value = defaultDate;
            
            // Add a small note about available date range
            const label = startDateContainer.querySelector('label');
            if (label) {
                label.innerHTML = `<strong>Start Date:</strong><br><small>Available: ${minDate} to ${maxDate}</small>`;
            }
        }
    }
    
    updateDisplay();
}

// Event listeners
document.getElementById('percentageSlider').addEventListener('input', updateDisplay);
document.getElementById('startingBankroll').addEventListener('input', updateDisplay);
document.getElementById('seasonSelect').addEventListener('change', onSeasonChange);
document.getElementById('startDatePicker').addEventListener('change', updateDisplay);

// Initialize
window.addEventListener('load', function() {
    initializeCharts();
    onSeasonChange(); // This will call updateDisplay
});
