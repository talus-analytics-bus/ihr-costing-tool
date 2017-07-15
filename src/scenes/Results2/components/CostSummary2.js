import React, { Component } from 'react';
import * as d3 from "d3";
import ReactTooltip from 'react-tooltip';
import DataTables from 'material-ui-datatables';
import styles from '../Results2.scss';
import {CostChartLegend} from './CostChartLegend2.js';
import {CostChartOptions} from './CostChartOptions2.js';
import xMarkImage from '../../../images/x.png';
import { jeeTree } from '../../../data/jeeTree.js'; /* will want to import via api */

const formatMoney = d3.format('$,.0f');
const categories = [
	{ name: 'Consumable Materials', color: '#d0d1e6' },
	{ name: 'Durable Equipment', color: '#a6bddb' },
	{ name: 'Human Capabilities', color: '#67a9cf' },
	{ name: 'Physical Infrastructure', color: '#3690c0' },
	{ name: 'Technology', color: '#02818a' },
	{ name: 'Tools and Processes', color: '#016450' }
];

const columns = [
	{ key: 'core', label: 'Core Element', sortable: true },
	{ key: 'capacity', label: 'Capacity', sortable: true },
	{ key: 'indicator_id', label: 'Indicator', sortable: true },
	{ key: 'year_1_cost', label: 'First Year Costs', sortable: true },
	{ key: 'year_2_cost', label: 'Recurring Annual Costs', sortable: true },
	{ key: 'year_5_cost', label: '5-year Costs', sortable: true },
];

const resultsData = [];
jeeTree.forEach((core) => {
	core.fixedCost = 0;
	core.recurringCost = 0;

	core.capacities.forEach((capacity) => {
		capacity.fixedCost = 0;
		capacity.recurringCost = 0;

		capacity.indicators.forEach((indicator) => {
			// add to data
			indicator.fixedCost = 1e5 * Math.random();
			indicator.recurringCost = 1e4 * Math.random();
			resultsData.push({
				core: core.name,
				capacity: capacity.name,
				indicator: indicator.name,
				indicator_id: indicator.jee_id,
				year_1_cost: formatMoney(indicator.fixedCost),
				year_2_cost: formatMoney(indicator.fixedCost + indicator.recurringCost),
				year_5_cost: formatMoney(indicator.fixedCost + 4 * indicator.recurringCost),
			});

			capacity.fixedCost += indicator.fixedCost;
			capacity.recurringCost += indicator.recurringCost;
			core.fixedCost += indicator.fixedCost;
			core.recurringCost += indicator.recurringCost;
		});
	});
});

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        fullText = text.text(),
        trimmedText = text.text().split(/\s+/).reduce((trimmed, word) => {
          const count = trimmed.reduce((length, w) => w.length + length, 0) + trimmed.length - 1;
          if (count < 50) {
            return trimmed.concat([word]);
          }
          return trimmed;
        }, []).join(' '),
        trimmedTextFinal = trimmedText.length < text.text().length ? trimmedText + '...' : trimmedText,
        words = trimmedTextFinal.split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
    if (fullText != trimmedTextFinal) {
      text.attr('data-tip', fullText);
      ReactTooltip.rebuild();
    }
  });
}

export class CostSummary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeData: jeeTree,
			activeCore: '',
			activeCapacity: '',
			activeIndicator: '',
			page: 1,
			showByCategory: true,
			showTable: false,
			costCategory: '1',
			chartType: 'stacked'
		};
	}

	getDataType = () => {
		if (!this.state.activeCore) return 'core';
		if (!this.state.activeCapacity) return 'capacity';
		else if (!this.state.activeIndicator) return 'indicator';
		return 'expense';
	}

	// Build the cost chart
	buildCostChart(selector, param={}) {
		const catNames = ['Consumable Materials',
					'Durable Equipment',
					'Human Capabilities',
					'Physical Infrastructure',
					'Technology',
					'Tools and Processes'];

		// Set our margins
		var margin = {
		    top: 20,
		    right: 20,
		    bottom: 130,
		    left: 100
		};
		const width = 700 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;
		// const yGroupMax = 10000;
		// const yStackMax = 10000;

		var x0 = d3.scaleBand() // stacked
          .range([0, width])
          .padding(0.2);

		var x1 = d3.scaleBand() // grouped
            .rangeRound([0, x0.bandwidth()]);

		var color = d3.scaleOrdinal()
			.range(['#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016450'])
			.domain(catNames);

		const xAxis = d3.axisBottom();

		const y = d3.scaleLinear()
			.range([height, 0]);

		const yAxis = d3.axisLeft()
			.tickSizeOuter(10)
			.tickArguments([6])
			.tickFormat(d3.format('$.2s'))
			.tickPadding(12)
			.scale(y);

		// Add our chart to the #chart div
		var chart = d3.select(selector)
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    const xAxisG = chart.append('g')
			.attr('class', 'x-axis axis')
			.attr('transform', `translate(0, ${height})`);

		const yAxisG = chart.append('g')
			.attr('class', 'y-axis axis');

		function getRandomFractions (n) {
				var num = 1;
				const output = [];
				for (let i = 0; i < (n-1); i++) {
					const origNum = num;
					num = num * Math.random();
					output.push(origNum - num);
				}
				output.push(num);
				return output;
			}

		// add axes labels
		const xAxisLabel = chart.append('text')
			.attr('x', width / 2)
			.attr('y', height + 120)
			.style('text-anchor', 'middle')
			.style('font-weight', 'bold')
			.style('font-size', '1.5em')
			.text('Core Element');
		this.yAxisLabel = chart.append('text')
			.attr('x', -height / 2)
			.attr('y', -80)
			.attr('transform', 'rotate(-90)')
			.style('text-anchor', 'middle')
			.style('font-size', '1.5em')
			.style('font-weight', 'bold')
			.text('First Year Costs');

		chart.update = (chartType, updateData, multiplier) => {
			// get data
			// TODO pull the jeeTree data from the application state, not the static
			// jeeTree data that is currently being pulled
			let chartData;
			const dataType = this.getDataType();
			if (!this.state.activeCore) {
				xAxisLabel.text('Core Element');
				chartData = jeeTree;
			} else if (!this.state.activeCapacity) {
				xAxisLabel.text('Capacity');
				chartData = jeeTree.find(d => d.name === this.state.activeCore).capacities;
			} else if (!this.state.activeIndicator) {
				xAxisLabel.text('Indicator');
				chartData = jeeTree
					.find(d => d.name === this.state.activeCore).capacities
					.find(dd => dd.name === this.state.activeCapacity).indicators;
			} else {
				xAxisLabel.text('Expense');
				chartData = jeeTree
					.find(d => d.name === this.state.activeCore).capacities
					.find(dd => dd.name === this.state.activeCapacity).indicators
					.find(ddd => ddd.name === this.state.activeIndicator).expenses;
			}

			// prepare the data
			// get costs for each expense category
			// TODO use data from the tool, not fake data
			// Pseudocode for how real code needs to work:
			// For each entity in "chartData" (e.g., core element, core capacity, ...):
				// (1) Calculate the sum of all the selected expenses for that entity by category
				// (2) Store the costs by category in field 'catCosts' (code block below for structure of catCosts)
				// (3) Store name or jeed_id of entity (whichever it has) in field 'name' or 'jee_id'
				// (4) Store total of all the costs for the entity in field 'total'
				// (5) Push the object storing these data to dataColl
			var dataColl;
			var catCostData;
			if (updateData) {
				catCostData = [];
				chartData.forEach(function(d) {
					var newObj = {};
					// fake data generation routine:
					// get cost
					const originalCost = d.fixedCost * multiplier;
					const randomFracs = getRandomFractions(categories.length);
					for (let i = 0; i < categories.length; i++) {
						newObj[categories[i].name] = originalCost * randomFracs[i];
					}
					newObj.total = originalCost;
					if (dataType === 'indicator') {
            newObj.name = `${d.jee_id} ${d.name}`;
          }
					else newObj.name = d.name;
				   	catCostData.push(newObj)
				});
				dataColl = [];
			   	catCostData.forEach(function(d){
					var newObj = {};

					// generate stack bar heights data object
				   	var y0 = 0;

				    newObj.catCosts = catNames.map(function(name) {
					      return {
					      	name: name,
					      	y0: y0,
					      	y1: y0 += +d[name],
					      	value: +d[name]
					      };
					  });
					if (dataType === 'indicator') {
            newObj.name = d.jee_id ? `${d.jee_id} ${d.name}` : d.name;
          }
					else newObj.name = d.name;
					newObj.total = d.total;
				    dataColl.push(newObj);
			   	});
			   	this.setState({dataColl: dataColl});
			} else {
				dataColl = this.state.dataColl;
			}

			// adjust axes
      x0.domain(chartData.map(d => {
        if (dataType === 'indicator') {
          return `${d.jee_id} ${d.name}`;
        }
        return d.name;
      }));

		   	const grouped = chartType === 'grouped';
			x1.domain(catNames);
			x1.rangeRound([0, x0.bandwidth()])

		   	const curXScale = grouped ? x1 : x0;
			xAxis.scale(x0);
			xAxisG.call(xAxis);

			// update y-axis
			// var yGroupMax = d3.max(dataColl, function(d) { return d3.max(d.catCosts, function(d) { return d.value; }); });
			var yStackMax = d3.max(dataColl, function (d) {return d.total;});

			if (grouped) {
				y.domain([0, yStackMax]);
			} else {
				y.domain([0, yStackMax]);
			}
			yAxis.scale(y);
			yAxisG.call(yAxis);

			// add or remove bars based on new data
			var barGroups = chart.selectAll(".bar-group")
		      .data(dataColl);

		      const newBarGroups = barGroups.enter().append("g")
		      .attr("class", "g")
		      .attr("class", "bar-group")
		      .attr("transform", function(d) {
		        return "translate(" + x0(
              dataType === 'indicator' ? `${d.jee_id} ${d.name}` : d.name) + ",0)";
		      });

			if (!grouped) {
				var newRect = newBarGroups.selectAll(".bar")
					.data(function (d) {return d.catCosts;})
					    .enter().append("rect")
						    .attr("class", "bar")
						    .attr("width", x0.bandwidth())
						    .attr("x", function(d) { return x0(d.name || d.jee_id); }) // or jee_id!
						    .attr("y", function (d) {return y(d.y1);})
						    .attr("height", function (d) {return y(d.y0) - y(d.y1);})
						    .style("fill", function (d) {return color(d.name);})
			} else {
				var newRect = newBarGroups.selectAll(".bar")
					.data(function (d) {return d.catCosts;})
					    .enter().append("rect")
						    .attr("class", "bar")
						    .attr("width", x1.bandwidth())
					        .attr("x", function(d) { return x1(d.name || d.jee_id); })
					        .attr("y", function(d) { return y(d.value); })
					        .attr("height", function(d) { return height - y(d.value); })
					        .style("fill", function(d) { return color(d.name); })
			}
		      newBarGroups.append('text')
				.attr('class', 'value-label')
				.style('text-anchor', 'middle')
				.style('font-size', '0.9em');

			barGroups.exit().remove();

			chart.updateBarHeight(multiplier, grouped, dataColl, x0, x1);

		}

		chart.updateBarHeight = (multiplier, grouped, dataColl, x0, x1) => {
			const barGroups = chart.selectAll('.bar-group')
				.attr("transform", function(d) {
				  return "translate(" + x0(d.name || d.jee_id) + ",0)";
				});

			// adjust y axis
			yAxis.scale(y);
			yAxisG.call(yAxis);

			barGroups.data(dataColl);
			// update bar values
			if (grouped) {
				var bandwidth = x1.bandwidth();
				barGroups.selectAll('.bar')
					.data(function (d) {return d.catCosts;})
						.transition()
							.duration(500)
      						.delay(function(d, i) { return i * 10; })
							.attr('width', bandwidth)
							.attr('x', function(d){ return x1(d.name)})
						.transition()
							.attr("y", function(d) { return y(d.value); })
	       					.attr("height", function(d) { return height - y(d.value); })
			} else {
				var bandwidth = x0.bandwidth();
				barGroups.selectAll('.bar')
					.data(function (d) {return d.catCosts;})
						.transition()
							.duration(500)
      						.delay(function(d, i) { return i * 10; })
							.attr("y", function (d) {return y(d.y1);})
							.attr("height", function (d) {return y(d.y0) - y(d.y1);})
						.transition()
							.attr('width', bandwidth)
							.attr('x', function(d){ return x0(d.name)})
			}
			barGroups.selectAll('.bar').each(function(d){
		    	var contentStr ='';
		    	contentStr += d.name + ': ' + formatMoney(d.value);
		    	d3.select(this).attr('data-tip',contentStr);
			});
			ReactTooltip.rebuild();
			chart.styleChart(x0);
		}

		chart.styleChart = (x0) => {
			// chart styling
			const bandwidth = x0.bandwidth();
			chart.selectAll('.tick text')
				.style('font-size', '1.5em');
			chart.selectAll('.tick line')
				.style('fill', 'none')
				.style('stroke', 'rgba(0,0,0,1)');
			chart.selectAll('.axis path, .axis line')
				.style('fill', 'none')
				.style('stroke', '#333')
				.style('shape-rendering', 'crispEdges');
			chart.selectAll('.x-axis .tick text')
				.call(wrap, bandwidth);
			chart.selectAll('.y-axis .tick:nth-child(n+2) line')
				.style('stroke', '#ccc');
		}

		chart.update('stacked', true, 1);
		this.setState({chartType:'grouped'}, () => {
			setTimeout(function(){
				chart.update('grouped', false, 1)
			}, 1000);
		});

		return chart;

	};

	componentDidMount() {
		this.costChart = this.buildCostChart('.costChart');
		this.styleTable();
	}

	changeCore(event) {
		this.setState({activeCore: event.target.value}, () => {
			this.costChart.update(this.state.chartType, true, parseFloat(this.state.costCategory));
		});
	}

	changeCapacity(event) {
		this.setState({activeCapacity: event.target.value}, () => {
			this.costChart.update(this.state.chartType, true, parseFloat(this.state.costCategory));
		});
	}

	changeIndicator(event) {
		this.setState({activeIndicator: event.target.value}, () => {
			this.costChart.update(this.state.chartType, true, parseFloat(this.state.costCategory));
		});
	}

	removeCapacity() {
		this.setState({activeCore: '', activeCapacity: '', activeIndicator: ''}, () => {
			this.costChart.update(this.state.chartType, true, parseFloat(this.state.costCategory));
		});
	}

	removeIndicator() {
		this.setState({activeCapacity: '', activeIndicator: ''}, () => {
			this.costChart.update(this.state.chartType, true, parseFloat(this.state.costCategory));
		});
	}

	toggleByCategory() {
		this.setState({showByCategory: !this.state.showByCategory});
	}

	changeCostCategory(event) {
		event.persist();
		this.setState({costCategory: event.target.value}, () => {
			switch(event.target.value) {
				case '1':
					this.yAxisLabel.text('First Year Costs');
					break;
				case '2':
					this.yAxisLabel.text('Recurring Annual Costs');
					break;
				case '5':
					this.yAxisLabel.text('5-year Costs');
					break;
			}
		});
			this.costChart.update(this.state.chartType, true, parseFloat(event.target.value));
		// if (event.target.value === "1")
		// else if (event.target.value === "2") this.costChart.update(this.state.chartType, false, 1.5);
		// else if (event.target.value === "5") this.costChart.update(this.state.chartType, false, 5);
	}

	changeChartType(event) {
		event.persist();
		this.setState({chartType: event.target.value}, () => {
			this.costChart.update(event.target.value, false, parseFloat(this.state.costCategory));
		});
		// if (event.target.value === "stacked") this.costChart.updateChart('stacked');
		// else if (event.target.value === "grouped") this.costChart.updateChart('grouped');
	}

	styleTable() {
		d3.selectAll('td').style('white-space', 'normal');
		d3.selectAll('th:nth-child(2), td:nth-child(2)').style('width', '200px');
		d3.selectAll('th:nth-child(n+4), td:nth-child(n+4)').style('text-align', 'right');
		d3.selectAll('tbody tr:nth-child(-n+3)')
			.style('background-color', '#f2f0f7');
		d3.selectAll('tbody tr:nth-child(n+4):nth-child(-n+13)')
			.style('background-color', '#dadaeb');
		d3.selectAll('tbody tr:nth-child(n+14)')
			.style('background-color', '#bcbddc');
	}

	toggleTable() {
		this.setState({showTable: !this.state.showTable}, this.styleTable);
	}

	render() {
		return (
			<div className={styles.costSummaryContainer}>
				<h2>Breakdown of implementation costs</h2>
				<ReactTooltip />
				<div>
					<div className={styles.leftColumn}>
						<div className={styles.tableFilterContainer}>
							<div className={styles.tableFilterContainerTitle}>
								Select from the dropdowns below to view costs:
							</div>
							<div className={styles.filterBox}>
								<div className={styles.filterTitle}>Core Element:</div>
								<select className={styles.filterSelect} value={this.state.activeCore} onChange={(e) => this.changeCore(e)}>
									<option value="">All</option>
									<option value="Prevent">Prevent</option>
									<option value="Detect">Detect</option>
									<option value="Respond">Respond</option>
								</select>
							</div>
							{
								(this.state.activeCore) ?
								<div className={styles.filterBox}>
									<div className={styles.filterTitle}>Capacity:</div>
									<select className={styles.filterSelect} value={this.state.activeCapacity} onChange={(e) => this.changeCapacity(e)}>
										<option value="">All</option>
										{
											jeeTree.find(d => d.name === this.state.activeCore).capacities.map((capacity, i) =>
												<option key={i} value={capacity.name}>{capacity.name}</option>
											)
										}
									</select>
			            <img
			              alt=''
			              className={styles.filterBoxCloseIcon}
			              src={xMarkImage}
			              onClick={() => this.removeCapacity()}
			            />
								</div>
								: ''
							}
							{/*{
								(this.state.activeCapacity) ?
								<div className={styles.filterBox}>
									<div className={styles.filterTitle}>Indicator:</div>
									<select className={styles.filterSelect} value={this.state.activeIndicator} onChange={(e) => this.changeIndicator(e)}>
										<option value="">All</option>
										{
											jeeTree.find(d => d.name === this.state.activeCore).capacities.find(dd => dd.name === this.state.activeCapacity).indicators.map((indicator, j) =>
												<option key={j} value={indicator.name}>{indicator.jee_id}</option>
											)
										}
									</select>
			            <img
			              alt=''
			              className={styles.filterBoxCloseIcon}
			              src={xMarkImage}
			              onClick={() => this.removeIndicator()}
			            />
								</div>
								: ''
	}*/}
						</div>
						<CostChartOptions
									showByCategoryValue={this.state.showByCategory}
									toggleByCategory={() => this.toggleByCategory()}
									costCategory={this.state.costCategory}
									chartType={this.state.chartType}
									changeCostCategory={(e) => this.changeCostCategory(e)}
									changeChartType={(e) => this.changeChartType(e)}
								/>
					</div>
					<div className={styles.rightColumn}>
						<div className={styles.costChartContainer}>
							<svg className="costChart" width="960" height="500"></svg>
							<div className={styles.costChartUnderneath}>
								<CostChartLegend categories={categories} />
							</div>
						</div>
					</div>
				</div>
				<div className={styles.costTableToggle}>
					<div
						className={`${styles.button} ${this.state.showTable ? 'active' : ''}`}
						onClick={() => this.toggleTable()}
					>
						{this.state.showTable ? 'Hide Table' : 'Show Table'}
					</div>
					<div className={styles.button} onClick={() => this.exportTable()}>Export Table</div>
				</div>
				{
					this.state.showTable ?
					<div className={styles.costTableContainer}>
						<DataTables
							height={'auto'}
							selectable={false}
							columns={columns}
							data={resultsData}
							page={1}
							count={resultsData.length}
						/>
					</div>
					: ''
				}
			</div>
		);
	}
}
