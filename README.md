# IcePicks

![IcePicks Logo](IcePick.png)

## Overview

IcePicks is a professional NHL betting analysis tool that provides comprehensive performance metrics, real-time bankroll simulation, and advanced analytics for sports betting strategies. The tool analyzes historical NHL game predictions and betting outcomes across multiple seasons to help optimize bankroll management and betting strategies.

## Features

- **Multi-Season Analysis**: Compare performance across 2023 and 2024 NHL seasons, or analyze continuous data across both seasons
- **Dynamic Bankroll Simulation**: Real-time calculation of bankroll growth with adjustable unit sizing (0.5% - 10% of bankroll)
- **Comprehensive Metrics Dashboard**: Track key performance indicators including:
  - Win rate and accuracy
  - Total profit and ROI
  - Peak bankroll and drawdowns
  - Average daily profit
  - Profitable days ratio
  - Total wagered and games analyzed
- **Interactive Visualizations**: 
  - Bankroll growth chart over time
  - Daily profit/loss bar charts
  - Monthly performance comparisons
- **Flexible Date Ranges**: Filter analysis by custom start dates within each season
- **Kelly Criterion Integration**: Built-in unit multiplier calculations based on win probability and odds

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional dependencies or installation required

### Usage

1. Open `index.html` in your web browser
2. Adjust the following parameters:
   - **Daily Unit Size**: Set your preferred percentage of bankroll to risk per unit (slider from 0.5% to 10%, default: 3.5%)
   - **Starting Bankroll**: Enter your initial bankroll amount (default: $1,000)
   - **Season**: Select which season(s) to analyze:
     - 2024 Season
     - 2023 Season
     - Continuous (both seasons combined)
   - **Start Date**: Choose a specific date to begin the analysis from (when applicable)
3. View real-time metrics and charts that update automatically

## Technology

- **Frontend**: Pure HTML5, CSS3, and JavaScript
- **Charting**: Chart.js for interactive data visualizations
- **Design**: Responsive layout that works on desktop and mobile devices
- **Data**: Embedded JSON data structure containing historical betting data

## Metrics Explained

- **Win Rate**: Percentage of correctly predicted game outcomes
- **ROI (Return on Investment)**: Total profit as a percentage of total wagered amount
- **Unit Multiplier**: Kelly Criterion-based calculation that determines bet sizing based on edge and odds
- **Profitable Days**: Number of days with positive profit vs. total trading days
- **Average Daily Profit**: Mean profit per trading day across the selected period

## Data Structure

The application uses historical NHL game data including:
- Game IDs and dates
- Predicted vs. actual winners
- Betting payouts and implied probabilities
- Win chance calculations
- Kelly Criterion unit multipliers
- Previous accuracy metrics

## License

This project is provided as-is for analysis and educational purposes.

## Author

NHL Analytics

---

*Built for professional sports betting analysis and bankroll management optimization.*