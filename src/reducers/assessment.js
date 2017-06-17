const initialState = {
  jeeTree: [],
  // this part indicates which coreCapacities and capacities are active
  // default is core: 0, capacity: 0 which means first capacity of first core capacity
  // e.g. core: 1, capacity: 3 means fourthe capacity of second core capacity is active
  active: {
    core: 0,
    capacity: 0,
    stage: 'assessment',
    completed: false,
  }
}

// helper functions
const numberOfCoreCapacities = (state) => state.jeeTree.length;

const numberOfCapacities = (state, coreCapacityIndex) => state.jeeTree[coreCapacityIndex].capacities.length;

// this gives the next capacity in the list
const nextCapacity = (state, coreIndex, capacityIndex) => {
  // active capacity is not the last one for that core capacity
  if (numberOfCapacities(state, coreIndex) > capacityIndex + 1) {
    return {
      core: coreIndex,
      capacity: capacityIndex + 1,
    }
  }
  // core capacity is not the last one
  if (numberOfCoreCapacities(state) > coreIndex + 1) {
    return {
      core: coreIndex + 1,
      capacity: 0,
    }
  }
  // only case left is core and capacity are both the last
  // we don't return anything (undefined) to signal that there is no next step
}

const prevCapacity = (state, coreIndex, capacityIndex) => {
  // active capacity is not the first one for that core capacity
  if (capacityIndex > 0) {
    return {
      core: coreIndex,
      capacity: capacityIndex - 1,
    }
  }
  // core capacity is not the first one
  if (coreIndex > 1) {
    return {
      core: coreIndex - 1,
      capacity: numberOfCoreCapacities(coreIndex - 1) - 1,
    }
  }
}

// this is the new state object given core and capacity
const assembleState = (state, core, capacity, stage = 'assessment') => ({
  ...state,
  active: {
    ...state.active,
    core,
    capacity,
    stage,
  }
});

export const assessmentReducer = (state = initialState, action) => {
  let activeStage;

  switch(action.type) {
    case 'SET_JEE_TREE':
      return {
        ...state,
        jeeTree: action.jeeTree,
      }
    case 'SET_ACTIVE_CAPACITY':
      if (action.capacityName === '' && state.assessment.jeeTree.length > 0) {
        return {
          ...state,
          jeeTree: [
            {
              ...state.jeeTree[0],
              active: true,
              capacities: [
                {
                  ...state.jeeTree[0].capacities[0],
                  active: true,
                },
                ...state.jeeTree[0].capacities.slice(1),
              ]
            },
            ...state.jeeTree.slice(1)
          ]
        }
      }
      return state;
    case 'SET_ACTIVE_CAPACITY_LEVEL':
      const isSelectedIndicator = (indicator, action) => indicator.jee_id === action.indicator;
      const isAlreadySelected = (indicator, action) => indicator.selectedLevel === action.level;

      return {
        ...state,
        jeeTree: state.jeeTree.map((core) => ({
          ...core,
          capacities: core.capacities.map((capacity) => ({
            ...capacity,
            complete_assessment: capacity.indicators.reduce((complete, indicator) => {
              if (isSelectedIndicator(indicator, action)) {
                return !isAlreadySelected(indicator, action) && complete;
              }
              return indicator.selectedLevel !== null && complete;
            }, true),
            indicators: capacity.indicators.map((indicator) => ({
              ...indicator,
              selectedLevel: isSelectedIndicator(indicator, action) ? (isAlreadySelected(indicator, action) ? null : action.level) : indicator.selectedLevel,
            }))
          }))
        }))
      };
    case 'PREV_CAPACITY':
      // we need to shift the active capacity back by 1 and set stage to 'assessment'
      let newCapacity, newCoreCapacity;
      const activeCapacity = state.active.capacity;
      const activeCoreCapacity = state.active.core;

      if (activeCapacity > 0) {
        // not the first capacity in core capacity so we only need to decrement capacity by 1
        newCapacity = activeCapacity - 1;
        newCoreCapacity = activeCoreCapacity;
        return assembleState(state, newCoreCapacity, newCapacity);
      }

      if (activeCapacity === 0) {
        if (activeCoreCapacity === 0) {
          // active capacity and core capacity is the first so doesn't really make sense
          // we just return the original but with assessment picked
          return assembleState(0, 0);
        }
        // first capacity in core capacity but not the first core capacity
        // so we only need to decrement core capacity by 1 and set capacity to the last capacity
        // of that core capacity
        newCoreCapacity = activeCoreCapacity - 1;
        newCapacity = numberOfCapacities(state, newCoreCapacity) - 1 // subtract 1 to get index of last capacity
        return assembleState(state, newCoreCapacity, newCapacity);
      }
      break;
    case 'PROCEED_TO_COSTING':
      // we maintain active core and capacity and simply set stage to 'costing'
      return {
        ...state,
        active: {
          ...state.active,
          stage: 'costing',
        }
      }
    case 'GO_TO_CAPACITY':
      // this is also simple: we only need to set the active state to the right core and capacity indices
      // we can put a check as well if it's within the jeetree data bounds
      let outOfBounds = false;

      if (action.core >= numberOfCoreCapacities(state)) {
        outOfBounds = true;
      }
      if (action.capacity >= numberOfCapacities(state, action.core)) {
        outOfBounds = true;
      }

      if (outOfBounds) {
        // not a valid state, just return initial state
        return state;
      }

      // go to assessment stage
      return {
        ...state,
        active: {
          ...state.active,
          core: action.core,
          capacity: action.capacity,
          stage: 'assessment',
        }
      }

    case 'PREV_STEP':
      activeStage = state.active.stage;
      const prevCap = prevCapacity(state, state.active.core, state.active.capacity);

      if (action.assessmentFirst) {
        if (activeStage === 'costing') {
          if (prevCap) {
            return assembleState(state, prevCap.core, prevCap.capacity, 'costing');
          }
          return assembleState(state, numberOfCoreCapacities(state) - 1, numberOfCapacities(state, numberOfCoreCapacities(state) - 1) - 1, 'assessment');
        }
        if (prevCap) {
          return assembleState(state, prevCap.core, prevCap.capacity, 'assessment');
        }
        return state;
      }
      if (activeStage === 'costing') {
        return assembleState(state, state.active.core, state.active.capacity, 'assessment');
      }
      if (prevCap) {
        return assembleState(state, prevCap.core, prevCap.capacity, 'costing');
      }
      return state;
    case 'NEXT_STEP':
      // this is complicated
      // say A => assessment and C => costing
      // when assessmentFirst == true, then path is A1 -> A2 -> A3 -> C1 -> C2 -> C3
      // otherwise A1 -> C1 -> A2 -> C2 -> A3 -> C3
      activeStage = state.active.stage;
      const nextCap = nextCapacity(state, state.active.core, state.active.capacity);

      // let's deal with the first workflow
      if (action.assessmentFirst) {
        if (activeStage === 'assessment') {
          if (nextCap) {
            // we haven't cycled back to the start
            return assembleState(state, nextCap.core, nextCap.capacity, 'assessment');
          }
          // we've gone to the costing part now
          return assembleState(state, 0, 0, 'costing');
        }
        // we're in the costing part now
        if (nextCap) {
          return assembleState(state, nextCap.core, nextCap.capacity, 'costing');
        }
        // no next step as this is the final, we set the completed flag to true
        return {
          ...state,
          active: {
            ...state.active,
            completed: true,
          }
        }
      }

      // then we deal with the cost as you go flow
      if (activeStage === 'assessment') {
        // we simply go to costing page for same capacity
        return {
          ...state,
          active: {
            ...state.active,
            stage: 'costing',
          }
        }
      }
      // if we are in costing we go the next step if it exists
      if (nextCap) {
        return assembleState(state, nextCap.core, nextCap.capacity, 'assessment');
      }
      // last step
      return {
        ...state,
        active: {
          ...state.active,
          completed: true,
        }
      }
    case 'TOGGLE_EDITING_EXPENSE':
      return {
        ...state,
        jeeTree: state.jeeTree.map((core) => ({
          ...core,
          capacities: core.capacities.map((capacity) => ({
            ...capacity,
            indicators: capacity.indicators.map((indicator) => ({
              ...indicator,
              expenses: indicator.expenses.map((expense) => ({
                ...expense,
                editing: expense.expense_id === action.expense_id
                && expense.sophistication_level.includes(action.sophistication_level)
                && expense.sophistication_name === action.sophistication_name ? !expense.editing : expense.editing,
              }))
            }))
          }))
        }))
      }
    case 'UPDATE_EXPENSE_VALUES':
      return {
        ...state,
        jeeTree: state.jeeTree.map((core) => ({
          ...core,
          capacities: core.capacities.map((capacity) => ({
            ...capacity,
            indicators: capacity.indicators.map((indicator) => ({
              ...indicator,
              expenses: indicator.expenses.map((expense) => ({
                ...expense,
                ...action.values,
              }))
            }))
          }))
        }))
      }
    case 'SELECT_EXPENSE':
      const isSelected = ({expense_id, sophistication_level, selected}) => {
        if (expense_id === action.expense_id && sophistication_level.includes(action.sophistication_level)) {
          return !selected;
        }
        if (expense_id === action.expense_id) {
          return false;
        }
        return selected;
      }

      return {
        ...state,
        jeeTree: state.jeeTree.map((core) => ({
          ...core,
          capacities: core.capacities.map((capacity) => ({
            ...capacity,
            indicators: capacity.indicators.map((indicator) => ({
              ...indicator,
              expenses: indicator.expenses.map((expense) => ({
                ...expense,
                selected: isSelected(expense),
              }))
            }))
          }))
        }))
      }
    default:
      return state;
  }
}
