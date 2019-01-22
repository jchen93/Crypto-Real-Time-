import React from "react";
// import { render } from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import Chart from "./chart";

const styles = theme => ({
  "chart-container": {
    height: 300
  }
});

//The states describes the structure of our state in our app
class LtcApp extends React.Component {
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          data: [],
          type: "line",
          label: "LTC-USD",
          backgroundColor: "rgba(51,0,255,1)",
          borderColor: this.props.theme.palette.primary.main,
          pointBackgroundColor: this.props.theme.palette.secondary.main,
          pointBorderColor: this.props.theme.palette.secondary.main,
          borderWidth: "1",
          lineTension: 0.2,
          options:{
            animation: {
              duration: 0, // general animation time
            },
            hover: {
                animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0,
          }
        },
      ]
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 100
            }
          }
        ]
      }
    }
  };

  //

  componentDidMount() {
    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["LTC-USD"]
        },
      ]
    };

    this.websock = new WebSocket("wss://ws-feed.pro.coinbase.com");

    this.websock.onopen = () => {
      this.websock.send(JSON.stringify(subscribe));
    };

    this.websock.onmessage = e => {
      const value = JSON.parse(e.data);
      if (value.type !== "ticker") {
        return;
      }

    //   LTC
    // console.log(this.state.lineChartData.datasets)
      const oldLtcDataSet = this.state.lineChartData.datasets[0]
      const newLtcDataSet = {...oldLtcDataSet };
      newLtcDataSet.data.push(value.price);

      const newLtcChartData = {
        ...this.state.lineChartData,
        datasets: [newLtcDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      this.setState({ lineChartData: newLtcChartData });

    };
  }

  componentWillUnmount() {
    this.websock.close();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes["chart-container"]}>
        <Chart
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
        />
      </div>
      
    );
  }
}

export default withStyles(styles, { withTheme: true })(LtcApp);