const CHOOSE_COUNTRY = 'CHOOSE_COUNTRY';
const CHOOSE_CURRENCY = 'CHOOSE_CURRENCY';

const SET_COUNTRIES = 'SET_COUNTRIES';
const SET_CURRENCIES = 'SET_CURRENCIES';
const SET_COUNTRY_MAP = 'SET_COUNTRY_MAP';
const SET_JEE_TREE = 'SET_JEE_TREE';

const SET_COUNTRY_DETAILS = 'SET_COUNTRY_DETAILS';
const SET_COUNTRY_INFO_VALUE = 'SET_COUNTRY_INFO_VALUE';
const TOGGLE_EDIT = 'TOGGLE_EDIT';
const TOGGLE_SHOW_ADVANCED = 'TOGGLE_SHOW_ADVANCED';
const VALIDATE_COUNTRY_INFO = 'VALIDATE_COUNTRY_INFO';

const SET_ASSESSMENT_FIRST = 'SET_ASSESSMENT_FIRST';

const SET_ACTIVE_CAPACITY = 'SET_ACTIVE_CAPACITY';
const SET_ACTIVE_CAPACITY_LEVEL = 'SET_ACTIVE_CAPACITY_LEVEL';
const PREV_CAPACITY = 'PREV_CAPACITY';
const PROCEED_TO_COSTING = 'PROCEED_TO_COSTING';
const PREV_STEP = 'PREV_STEP';
const NEXT_STEP = 'NEXT_STEP';
const GO_TO_CAPACITY = 'GO_TO_CAPACITY';

const TOGGLE_EDITING_EXPENSE = 'TOGGLE_EDITING_EXPENSE';
const UPDATE_EXPENSE_VALUES = 'UPDATE_EXPENSE_VALUES';
const SELECT_EXPENSE = 'SELECT_EXPENSE';

export const chooseCountry = (country, details) => ({
  type: CHOOSE_COUNTRY,
  country,
  details
});

export const setCountries = (countries) => ({
  type: SET_COUNTRIES,
  countries,
})

export const chooseCurrency = (currency, details) => ({
  type: CHOOSE_CURRENCY,
  currency,
  details
});

export const setCurrencies = (currencies) => ({
  type: SET_CURRENCIES,
  currencies,
})

export const setCountryMap = (countryMap) => ({
  type: SET_COUNTRY_MAP,
  countryMap,
})

export const setJeeTree = (jeeTree) => ({
  type: SET_JEE_TREE,
  jeeTree,
})

export const setCountryDetails = (details) => ({
  type: SET_COUNTRY_DETAILS,
  details,
})

export const toggleEdit = (target) => ({
  type: TOGGLE_EDIT,
  target,
})

export const setCountryInfoValue = (target, value, valueType = 'value') => ({
  type: SET_COUNTRY_INFO_VALUE,
  target,
  value,
  valueType,
})

export const toggleShowAdvanced = () => ({
  type: TOGGLE_SHOW_ADVANCED,
})

export const validateCountryInfo = (target) => ({
  type: VALIDATE_COUNTRY_INFO,
  target,
});

export const setAssessmentFirst = (assessmentFirst) => ({
  type: SET_ASSESSMENT_FIRST,
  assessmentFirst,
})

export const setActiveCapacity = (capacityName = '') => ({
  type: SET_ACTIVE_CAPACITY,
  capacityName,
})

export const setActiveCapacityLevel = (indicator, level) => ({
  type: SET_ACTIVE_CAPACITY_LEVEL,
  indicator,
  level,
})

export const prevCapacity = () => ({
  type: PREV_CAPACITY,
});

export const proceedToCosting = () => ({
  type: PROCEED_TO_COSTING,
});

export const prevStep = (assessmentFirst) => ({
  type: PREV_STEP,
  assessmentFirst,
});

export const nextStep = (assessmentFirst) => ({
  type: NEXT_STEP,
  assessmentFirst,
});

export const goToCapacity = (core, capacity) => ({
  type: GO_TO_CAPACITY,
  core,
  capacity,
});

export const toggleEditingExpense = (expense_id, sophistication_level, sophistication_name) => ({
  type: TOGGLE_EDITING_EXPENSE,
  expense_id,
  sophistication_level,
  sophistication_name,
})

export const updateExpenseValues = (expense_id, sophistication_level, values) => ({
  type: UPDATE_EXPENSE_VALUES,
  expense_id,
  sophistication_level,
  values,
})

export const selectExpense = (expense_id, sophistication_level, target) => ({
  type: SELECT_EXPENSE,
  expense_id,
  sophistication_level,
  target,
})
