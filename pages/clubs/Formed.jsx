var React = require('react');
var ReactDOM = require('react-dom');
var LocationSelector = require('../../components/LocationSelector.jsx');
var Select = require('react-select');

var Formed = React.createClass({

  getInitialState: function() {
    var initial = {};
    var fields = this.props.fields || {};

    this.progressFields = [];
    for (let name of fields) {
      initial[name] = null;
      if (fields[name].metered) {
        this.progressFields.push(name);
      }
    }
    initial.errors = [];
    initial.errorElements = [];
    return initial;
  },

  render: function() {
    return (
      <div className={this.props.className}>
        { Object.keys(this.props.fields).map(name => this.formFields(name, this.props.fields[name])) }
        { this.renderValidationErrors() }
      </div>
    );
  },

  update: function() {
    var state = this.state;
    // get the number of required fields that have a value filled in.
    var reduced = progressFields.reduce(function(a,b) {
      b = state[b];
      return a + this.hasFieldValue(b)? 1 : 0;
    }, 0);
    var total = this.progressFields.length;

    return reduces/total;
  },

  formFields: function(name, field) {
    var Type = field.type,
        ftype = typeof Type,
        label = field.label,
        formfield = null,
        hasError = this.state.errorElements.indexOf(name) !== -1,
        inputClass = hasError ? 'error' : '';

    var common = {
      key: name + 'field',
      value: this.state[name],
      onChange: e => this.update(name, e),
      placeholder: field.placeholder
    };

    var shouldHide = false;

    if (field.controller) {
      var controller = field.controller.name;
      var controlValue = field.controller.value;

      shouldHide = this.state[controller] !== controlValue;
    }

    if (label) {
      label = <label key={name + 'label'} hidden={shouldHide}>{label}</label>;
    } else { label = null; }

    if (!label) {
      inputClass += " nolabel";
    }

<<<<<<< HEAD
    if (ftype === "undefined" || Type === "text") {
      formfield = <input className={inputClass} type={Type? Type : "text"} {...common} hidden={shouldHide}/>;
=======
  if (ftype === "undefined" || Type === "text") {
      formfield = <input className={inputClass} type={Type? Type : "text"} {...common} hidden={shouldHide}/>
>>>>>>> 57ca7b1... .
    }

    if (Type === "choiceGroup") {
      var choices = field.options;

      formfield = <div className={Type} key={common.key}>{
        choices.map(value => {
          return <div><input className={inputClass} type="radio" name={name} value={value} checked={this.state[name] === value} onChange={common.onChange}/>{value}</div>;
        })
      }
      </div>;
    }

    if (ftype === "function") {
      formfield = <Type {...field} {...common} className={inputClass} />;
    }

    return <fieldset key={name + 'set'}>{ [label, formfield] }</fieldset>;
  },

  update: function(fieldname, e) {
    var state = {};

    state[fieldname] = e.target? e.target.value : e;
    this.setStateAsChange(fieldname, state);
  },

  setStateAsChange: function(fieldname, newState) {
    this.setState(newState, () => {
      if (this.props.onChange) {
        this.props.onChange(newState);
      }
      // if (this.state.errors && this.state.errors.length>0) {
      this.validates();
      // }
    });
  },

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
    var fields = this.props.fields || {};

    for (let name of fields) {
      this.validateField(name, errors, errorElements);
    }

    this.setState({
      errors: errors,
      errorElements: errorElements
    });

    return !errors.length;
  },

  validateField: function(name, errors, errorElements) {
    var value = this.state[name];
    var validators = this.props.fields[name].validator;

    if (!validators) {
      return;
    }

    if (!validators.forEach) {
      validators = [validators];
    }

    validators.forEach(validator => {
      var err = false;

      if (validator.validate) {
        err = validator.validate(value);
      } else {
        err = !this.hasFieldValue(this.state[name]);
      }
      if (err && this.passesControl(name)) {
        errors.push(validator.error);
        if (errorElements.indexOf(name)===-1) {
          errorElements.push(name);
        }
      }
    });
  },

  // check whether this field "counts":
  // - uncontrolled fields always count
  // - controlled fields only count if their controller has the appropriate value
  passesControl: function(name) {
    var field = this.props.fields[name];
    var control = field.controller;

    if (!control) {
      return true;
    }

    return this.state[control.name] === control.value;
  },

  // A field has a value if it's not null, falsey, an empty array, and the
  // field is not optional. In any of these cases, this field doesn't count
  // (and so reduces by adding 0 to the running tally, rather than 1).
  hasFieldValue: function(value) {
    if (value === null) {
      return false;
    }
    if (value === false) {
      return false;
    }
    if (value.length === 0) {
      return false;
    }
    return true;
  },

  getErrorClass: function(field) {
    if (!this.state.errorElements) {
      return false;
    }

    var error = this.state.errorElements.indexOf(field) > -1;

    return error ? "error" : false;
  },

  renderValidationErrors: function() {
    if (!this.state.errors || this.state.errors.length === 0) {
      return null;
    }

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
