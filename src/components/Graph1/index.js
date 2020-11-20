import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import 'bulma/css/bulma.css';
import '../../App.css';

export default class Graph1 extends Component {
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
            chartData.push([data.date.slice(5,10), data.close])
        ));
        chartData.reverse().splice(0,0,['Date', '']);
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
        data.splice(0,0,['Date', 'Value']) ;
        this.setState({dataToShow: data})
    }

    render() {
        return <div className='graphContainer'>
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
            <div  className='buttonsGraphs'>
                <button className='button is-link is-light' onClick={() => this.reduceData(7)}>7</button>
                <button className='button is-link is-light' onClick={() => this.reduceData(15)}>15</button>
                <button className='button is-link is-light' onClick={() => this.reduceData(30)}>30</button>
                <button className='button is-link is-light' onClick={() => this.reduceData(60)}>60</button>
                <button className='button is-link is-light' onClick={() => this.reduceData(90)}>90</button>
            </div>
        </div> 
    }
}
