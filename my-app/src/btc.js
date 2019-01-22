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
class BtcApp extends React.Component {
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          data: [],
          type: "line",
          label: "BTC-USD",
          backgroundColor: "rgba(255,255,0,1)",
          borderColor: this.props.theme.palette.primary.main,
          pointBackgroundColor: this.props.theme.palette.secondary.main,
          pointBorderColor: this.props.theme.palette.secondary.main,
          borderWidth: "1",
          lineTension: 0.45,
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
        {
          data: [],
          type: "line",
          label: "LTC-USD",
          backgroundColor: "rgba(255,255,0,1)",
          borderColor: this.props.theme.palette.primary.main,
          pointBackgroundColor: this.props.theme.palette.secondary.main,
          pointBorderColor: this.props.theme.palette.secondary.main,
          borderWidth: "1",
          lineTension: 0.5,
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
              maxTicksLimit: 50
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
          product_ids: ["BTC-USD"]
        },
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
      // console.log(value)
      if (value.type !== "ticker" && value.product_id === "LTC-USD") {
        return;
      }
      //BTC

      const oldBtcDataSet = this.state.lineChartData.datasets[0];
      const newBtcDataSet = { ...oldBtcDataSet };
      newBtcDataSet.data.push(value.price);

      // const oldLtcDataSet = this.state.lineChartData.datasets[1];
      // const newLtcDataSet = { ...oldLtcDataSet };
      // newLtcDataSet.data.push(value.price);


      const newBtcChartData = {
        ...this.state.lineChartData,
        datasets: [newBtcDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      // const newLtcChartData = {
      //   ...this.state.lineChartData,
      //   datasets: [newLtcDataSet],
      //   labels: this.state.lineChartData.labels.concat(
      //     new Date().toLocaleTimeString()
      //   )
      // };
      this.setState({ lineChartData: newBtcChartData });

      // this.setState({ lineChartData: newLtcChartData });


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

export default withStyles(styles, { withTheme: true })(BtcApp);