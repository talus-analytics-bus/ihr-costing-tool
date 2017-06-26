import React, { Component } from 'react';
import styles from './CapacityTable.scss';
import ReactTooltip from 'react-tooltip';
import SvgIcon from 'material-ui/SvgIcon';

const ExpandIcon = (props) => (
  <SvgIcon {...props}>
    <g transform="scale(0.05)">
      <path xmlns="http://www.w3.org/2000/svg" d="M206.121,211.332h-80.453l25.887-21.522c0.097-0.079,0.192-0.169,0.284-0.252c5.123-4.121,8.05-10.173,8.05-16.704    c0-11.842-9.651-21.486-21.504-21.499c-3.848,0-7.67,1.086-11.068,3.133c-0.144,0.081-0.289,0.168-0.431,0.265    c-1.816,1.155-3.472,2.615-4.924,4.336l-62.295,55.964c-5.918,4.021-9.438,10.63-9.438,17.769c0,5.738,2.36,11.286,6.509,15.34    c0.184,0.226,0.389,0.441,0.606,0.639l63.35,56.925c1.388,1.648,2.945,3.046,4.646,4.159c0.386,0.314,0.805,0.566,1.257,0.754    c3.247,1.844,6.869,2.815,10.525,2.815c11.858,0,21.502-9.648,21.502-21.503c0-6.508-2.913-12.546-8.026-16.677    c-0.103-0.1-0.205-0.188-0.313-0.278l-24.872-20.672h80.708c11.857,0,21.502-9.647,21.502-21.502    C227.623,220.958,217.974,211.332,206.121,211.332z"/>
      <path xmlns="http://www.w3.org/2000/svg" d="M256.74,65.316c-0.188-0.236-0.397-0.457-0.624-0.667L192.762,7.735c-1.381-1.656-2.96-3.063-4.694-4.205    c-0.366-0.288-0.771-0.524-1.19-0.708C183.616,0.971,179.995,0,176.342,0c-11.859,0-21.502,9.644-21.502,21.502    c0,6.52,2.914,12.556,8.027,16.674c0.099,0.097,0.205,0.186,0.31,0.278l24.881,20.679h-80.729    c-11.848,0-21.485,9.644-21.485,21.497c0,11.858,9.643,21.501,21.501,21.501h80.452l-25.89,21.517    c-0.101,0.082-0.199,0.168-0.283,0.252c-5.127,4.124-8.055,10.176-8.055,16.702c0.005,11.858,9.65,21.499,21.504,21.499    c3.8,0,7.573-1.049,10.913-3.039c0.199-0.101,0.395-0.215,0.582-0.342c1.827-1.166,3.481-2.625,4.924-4.356l62.295-55.964    c5.928-4.019,9.444-10.63,9.439-17.764C263.234,74.912,260.877,69.374,256.74,65.316z"/>
    </g>
  </SvgIcon>
);

export class CapacityTableHeaderCell extends Component {
  isActive = () => this.props.hasOwnProperty('active') ? this.props.active : true;

  activeText = () => this.props.longText &&
  <div className={styles.capacityHeaderCellActive}>
    <div className={styles.capacityHeaderCellHeading}>{this.props.shortText}</div>
    <div className={styles.capacityHeaderCellText}>{this.props.longText}</div>
  </div>;

  inactiveText = () => this.props.shortText &&
  <div className={styles.capacityHeaderCellInactive}>
    <i className={styles.capacityHeaderCellExpand}>
      <ExpandIcon/>
    </i>
    <p
      data-tip
      data-for={this.props.shortText}
    >
      {this.props.shortText}
    </p>
    <ReactTooltip
      id={this.props.shortText}
    >
      {this.props.longText}
    </ReactTooltip>
  </div>
  ;

  render() {
    return (
      <div
        className={`${styles.capacityHeaderCell} ${!this.isActive() ? styles.capacityCellInactive : null}`}
        onClick={this.props.handleClick}
      >
        {
          this.isActive() ?
            this.activeText() :
            this.inactiveText()
        }
      </div>
    );
  }
}
