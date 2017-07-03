import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import styles from './MapPicker.css';
import {CountryPath} from "../CountryPath/CountryPath";
import FlatButton from 'material-ui/FlatButton';

const projection = (width, height) => {
  return d3.geoMercator()
    .scale(120)
    .translate([width / 2, height / 1.5]);
}

const path = ({width = 0, height = 0}) => {
  return d3.geoPath()
    .projection(projection(width, height));
}

let pathEl, defaultZoom, zoom;

export class MapPicker extends Component {
  constructor(props) {
    super(props);

    defaultZoom = {
      transform: false,
    };

    this.state = {
      ...defaultZoom,
      features: [],
      dimensions: {},
      activeCountry: this.props.activeCountry,
    }
  }

  resetZoom = () => {
    d3.select(this.refs.svgEl).call(zoom.transform, d3.zoomIdentity);
    this.setState({
      ...defaultZoom,
    })
  }

  componentWillReceiveProps(nextProps) {
    const cMap = nextProps.countryMap;
    let checkMap, features, limit = 0;

    if (this.props.countryMap !== {} && Object.keys(cMap).length > 0) {
      features = topojson.feature(cMap, cMap.objects['countries-simplified']).features;

      this.setState({
        features
      });
      return;
    }

    checkMap = setInterval(() => {
      limit++;
      if (Object.keys(cMap).length > 0 && cMap !== this.props.countryMap) {
        features = topojson.feature(cMap, cMap.objects['countries-simplified']).features;

        this.setState({
          features
        });
        clearInterval(checkMap);
      }
      if (limit > 5) {
        clearInterval(checkMap);
      }
    }, 1000);

  }

  componentDidMount() {
    const dimensions = this.refs.divEl.getBoundingClientRect();

    this.setState({
      dimensions,
    });
    pathEl = path(dimensions);

    zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on('zoom', () => {
        this.setState({
          transform: d3.event.transform,
        })
      });
    d3.select(this.refs.svgEl).call(zoom);
  }

  selectCountry = (country) => {
    this.setState({
      activeCountry: country.ISO_A2,
    });
    this.props.handleChange(country.ISO_A2);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.activeCountry !== this.state.activeCountry) {
      this.setState({
        activeCountry: nextProps.activeCountry,
      })
    }
  }

  render() {
    const originalZoom = () => this.state.transform === defaultZoom.transform;

    return (
      <div
        className={styles.mapPicker}
        ref="divEl"
      >
        <svg
          width={this.state.dimensions.width}
          height={this.state.dimensions.height}
          ref="svgEl"
        >
          <g
            {...this.state.transform ? {transform: this.state.transform} : null}
          >
            {
              this.state.features.map((feature) =>
                <CountryPath
                  key={feature.properties.NAME_LONG}
                  d={pathEl(feature)}
                  countryDetails={feature.properties}
                  active={this.state.activeCountry === feature.properties.ISO_A2}
                  handleTouchTap={this.selectCountry}
                ></CountryPath>
              )
            }
          </g>
        </svg>
        {
          !originalZoom() &&
          <FlatButton
            label="Reset"
            onClick={this.resetZoom}
          />
        }

      </div>
    )
  }
}
