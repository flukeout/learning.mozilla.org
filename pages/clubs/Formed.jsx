var React = require('react');
var ReactDOM = require('react-dom');
var LocationSelector = require('../../components/LocationSelector.jsx');
var Select = require('react-select');


var className = "step1";

var fields = [
  name: {
    type: "text",
    label: "Name",
    placeholder: "Your full name",
  },
  location: {
    type: LocationSelector,
    label: "Location",
    placeholder: "City, Country"    
  },
  occupation: {
    type: "text",
    label: "Occupation",
    placeholder: "Student or professional at ..."
  },
  regionalCoordinator: {
    type: "choiceGropup",
    label: "Are you currently working with a Regional Coordinator?",
    options: [ "yes", "no" ],
  }
  coordinatorName: {
    type: "text",
    label: "What is your Regional Coordinator's name?",
    placeholder: "Name",
    hidden: true,
    controller: {
      field: "regionalCoordinator",
      value: "yes"
    }
  },
  hostReason: {
    type: "text",
    label: "Why do you want to host a Mozilla Club?",
    placeholder: "Describe what you want to achieve and what your goals are. Minimum length 50 words."
  },
  howDidYouHear: {
    type: Select,
    label: "How did you hear about Mozilla Clubs?",
    options: [
      "from a friend",
      "from an event",
      "Mozilla website",
      "Social media",
      "other"
    ],
    other: {
      type: "text",
      placeholder: "Let us know how  you heard about becoming a club captain"
    }
  }
];

var validators = [
  name: {
    error: "You must provide a name for your club."
  },
  location: {
    error: "You must provide a location for your club."
  },
  occupation: {
    error: "Please let us know what your occupation is."
  },
  regionalCoordinator: {
    error: "You must say whether you're working with a regional coordinator."
  },
  hostReason: [
    {
      error: "You must explain the reason for applying."
    },
    {
      validates: function(value) {
        return value.split(' ').length >= 45;
      },
      error: "Please explain the reason for applying in 50 words or more."
    }
  ],
  howDidYouHear: {
    error: "Please tell us how you heard about this program."
  }
];

var progressFields = [
  "name",
  "location",
  "occupation",
  "regionalCoordinator",
  "hostReason",
  "howDidYouHear"
];


var Formed = React.createClass({
  getInitialState: function() {
    var initial = {};
    for (name in fields) { initial[name] = null; }
    return initial;
  },

  getTotal: function() {
    var progressFields = this.props.progressFields || [];
    return progressFields.length;
  },

  getFilled: function() {
    var state = this.state;
    var optional = this.props.optional || [];
    // get the number of required fields that have a value filled in.
    return progressFields.reduce(function(a,b) {
      b = state[b];
      // A field has a value if it's not null, falsey, an empty array, and the
      // field is not optional. In any of these cases, this field doesn't count
      // (and so reduces by adding 0 to the running tally, rather than 1).
      b = b===null? 0 : b===false? 0 : b.length===0 ? 0 : optional.indexOf(b)>-1 ? 0 : 1;
      return a + b;
    }, 0);
  },

  setStateAsChange: function(newState) {
    this.setState(newState, function() {
      this.props.onChange(newState);
      if (this.state.errors && this.state.errors.length>0) {
        this.validates();
      }
    });
  },

  render: function() {
    return (
      <div className={this.props.className}>
        { ... }
        { this.renderValidationErrors() }
      </div>
    );
  },

  

/*
  updateName: function(evt) { this.setStateAsChange({ name: evt.target.value }); },
  updateLocation: function(locationdata) {
    try { locationdata = JSON.parse(locationdata); }
    catch (e) { locationdata = { location: null, latitude: null, longitude: null }; }
    this.setStateAsChange({ location: locationdata });
  },
  updateOccupation: function(evt) { this.setStateAsChange({ occupation: evt.target.value }); },
  updateRegionalCoordinator: function(evt) { this.setStateAsChange({ regionalCoordinator: evt.target.value }); },
  updateCoordinatorName: function(evt) { this.setStateAsChange({ coordinatorName: evt.target.value }); },
  updateHostReason: function(evt) { this.setStateAsChange({ hostReason: evt.target.value }); },
  updateHowDidYouHear: function(value) { this.setStateAsChange({ howDidYouHear: value }); },
  updateHowDidYouActuallyHear: function(evt) { this.setStateAsChange({ howDidYouActuallyHear: evt.target.value }); },
*/

  getData: function() {
    var data = JSON.parse(JSON.stringify(this.state));
    delete data.hidden;
    delete data.errors;
    delete data.errorElements;
    return data;
  },

  validates: function() {
    var state = this.state;
    var errors = [];
    var errorElements = [];

/*
    if (!state.name) {
      errorElements.push('name');
      errors.push("You must provide a name for your club.");
    }
    if (!state.location) {
      errorElements.push('location');
      errors.push("You must provide a location for your club.");
    }
    if (!state.occupation) {
      errorElements.push('occupation');
      errors.push("Please let us know what your occupation is.");
    }
    if (!state.regionalCoordinator) {
      errorElements.push('regionalCoordinator');
      errors.push("You must say whether you're working with a regional coordinator.");
    }
    if (!state.hostReason) {
      errorElements.push('hostReason');
      errors.push("You must explain the reason for applying.");
    }
    else if (state.hostReason && state.hostReason.split(' ').length < 45) {
      errorElements.push('hostReason');
      errors.push("Please explain the reason for applying in 50 words or more.");
    }
    if (!state.howDidYouHear) {
      errorElements.push('howDidYouHear');
      errors.push("Please tell us how you heard about this program.");
    }
*/

    this.setState({
      errors: errors,
      errorElements: errorElements
    });

    return !errors.length;
  },

  getErrorClass: function(field) {
    if (!this.state.errorElements) return false;
    var error = this.state.errorElements.indexOf(field) > -1;
    return error ? "error" : false;
  },

  renderValidationErrors: function() {
    if (!this.state.errors || this.state.errors.length === 0) return null;
    var label = this.props.validationLabel || "Unfortunately, there are some problems with your form fields:";
    return (
      <div className="alert alert-danger">
        <p>{label}</p>
        <ul>{this.state.errors.map(function(text,i) { return <li key={i}>{text}</li>; })}</ul>
      </div>
    );
  }
});

module.exports = Formed;
