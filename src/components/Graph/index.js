import React, { Component } from 'react'
import { Chart } from "react-google-charts";

export default class Graph extends Component {
    constructor(props){
        super(props)
        this.state = {
            chartData: [],
            dataToShow:[],
            loading: true,
        }
    }
    
    addDataToChart = () => {
            const chartData = [];
            this.props.stockInfo.forEach(data => (
                chartData.push([data.date.slice(5,10), data.close, this.props.minThreshold, this.props.maxThreshold ])
            ));
            chartData.reverse().splice(0,0,['Date', 'Value', 'Min Threshold', 'Max Thershold']);
            this.setState({
                chartData,
                dataToShow: chartData,
                loading: false,
            })
        }
    
    async componentDidUpdate(prevProps) {
    if(JSON.stringify(this.props.stockInfo) !== JSON.stringify(prevProps.stockInfo)) {
        await this.addDataToChart()
    }
    }

    reduceData = (n) => {
        let data  = [...this.state.chartData].slice(-n);
        data.splice(0,0,['Date', 'Value', 'Min Threshold', 'Max Thershold']) ;
        console.log(this.state.dataToShow)
        this.setState({dataToShow: data})
    }

    render() {
        return <div>
            <div>
                {this.state.loading 
                    ? <div>Loading Data</div>
                    : (<div>
                        <Chart 
                            width={ '100%' }
                            height= {'400'}
                            chartType='LineChart'
                            loader={<div>Loading Chart</div>}
                            data={this.state.dataToShow}
                            rootProps={{ 'data-testid': '2' }}
                        />
                    </div>
                )}
            </div>
            <div>
                <button onClick={() => this.reduceData(7)}>7</button>
                <button onClick={() => this.reduceData(15)}>15</button>
                <button onClick={() => this.reduceData(30)}>30</button>
                <button onClick={() => this.reduceData(60)}>60</button>
                <button onClick={() => this.reduceData(90)}>90</button>
            </div>
        </div> 
    }
}
