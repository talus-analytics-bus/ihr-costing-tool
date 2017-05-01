import { connect } from 'react-redux';
import { setActiveCapacity, setActiveCapacityLevel } from '../../../../actions';
import { AssessmentMain } from './AssessmentMain';

export const mapStateToProps = (state) => {
  return {
    activeCapacity: ((state.assessment.jeeTree
      .find((core) => core.active) || {}).capacities || [])
      .find((capacity) => capacity.active)
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    setActiveCapacity: (capacityName) => {
      dispatch(setActiveCapacity(capacityName));
    },
    setActiveCapacityLevel: (indicator, level) => {
      dispatch(setActiveCapacityLevel(indicator, level));
    }
  }
}

export const AssessmentMainActive = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssessmentMain);
