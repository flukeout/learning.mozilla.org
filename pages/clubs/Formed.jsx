var React = require('react');
var ReactDOM = require('react-dom');
var LocationSelector = require('../../components/LocationSelector.jsx');
var Select = require('react-select');

var Formed = React.createClass({

  getInitialState: function() {
    var initial = {};
    var fields = this.props.fields || {};

    this.progressFields = [];
    Object.keys(fields).forEach(name => {
      initial[name] = null;
      if (fields[name].type === "checkboxGroup") {
        initial[name] = [];
      }
      if (fields[name].metered) {
        this.progressFields.push(name);
      }
    });
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

  getProgress: function() {
    var state = this.state;
    // get the number of required fields that have a value filled in.
    var reduced = progressFields.reduce(function(a,b) {
      return a + this.hasFieldValue(b, state[b])? 1 : 0;
    }, 0);
    var total = this.progressFields.length;

    return reduces/total;
  },

  formFields: function(name, field) {
    field.name = name;

    var Type = field.type,
        ftype = typeof Type,
        label = field.label,
        formfield = null,
        hasError = this.state.errorElements.indexOf(name) !== -1,
        inputClass = hasError ? 'error' : '';

    var common = {
      key: name + 'field',
      value: this.state[name],
      onChange: e => this.update(field, e),
      placeholder: field.placeholder
    };

    var shouldHide = false, choices = false;

    if (field.controller) {
      var controller = field.controller.name;
      var controlValue = field.controller.value;

      if (this.props.fields[controller].type === "checkboxGroup") {
        shouldHide = this.state[controller].indexOf(controlValue) === -1;
      } else {
        shouldHide = this.state[controller] !== controlValue;
      }
    }

    if (label) {
      label = <label key={name + 'label'} hidden={shouldHide}>{label}</label>;
    } else { label = null; }

    if (!label) {
      inputClass += " nolabel";
    }

    if (ftype === "undefined" || Type === "text") {
      formfield = <input className={inputClass} type={Type? Type : "text"} {...common} hidden={shouldHide}/>;
    } else if (Type === "textarea") {
      formfield = <textarea className={inputClass} {...common} hidden={shouldHide}/>;
    } else if (Type === "checkbox") {
      formfield = <div>
        <input className={inputClass} {...common} type={Type} hidden={shouldHide}/>
        { label }
        }
      </div>;
      label = null;
    } else if (Type === "choiceGroup") {
      choices = field.options;
      formfield = (
        <div className={Type} key={common.key}>{
          choices.map(value => {
            return <div key={value}><input className={inputClass} type="radio" name={name} value={value} checked={this.state[name] === value} onChange={common.onChange}/>{value}</div>;
          })
        }
        </div>
      );
    } else if (Type === "checkboxGroup") {
      choices = field.options;
      formfield = (
        <div className={Type} key={common.key}>{
          choices.map(value => {
            return <div key={value}><input className={inputClass} type="checkbox" name={name} value={value} checked={this.state[name].indexOf(value)>-1} onChange={common.onChange}/>{value}</div>;
          })
        }
        </div>
      );
    }

    if (ftype === "function") {
      formfield = <Type {...field} {...common} className={inputClass} />;
    }

    return <fieldset key={name + 'set'}>{ [label, formfield] }</fieldset>;
  },

  update: function(field, e) {
    var state = {};
    var fieldname = field.name;
    var value = e.target? e.target.value : undefined;

    if (field.type === "checkbox") {
      state[fieldname] = e.target? e.target.checked : false;
    } else if (field.type === "checkboxGroup") {
      var curval = this.state[fieldname];
      var pos = curval.indexOf(value);

      if (pos === -1) {
        curval.push(value);
      } else {
        curval.splice(pos,1);
      }

      state[fieldname] = curval;
    } else {
      state[fieldname] = (value !== undefined) ? value : e;
    }

    this.setStateAsChange(fieldname, state);
  },

  setStateAsChange: function(fieldname, newState) {
    console.log(fieldname, newState);
    this.setState(newState, () => {
      if (this.props.onChange) {
        this.props.onChange(newState);
      }
      this.validates();
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

    Object.keys(fields).forEach(name => {
      this.validateField(name, errors, errorElements);
    });

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
        err = !this.hasFieldValue(name, this.state[name]);
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

    var passes = false;

    if (this.props.fields[control.name].type === "checkboxGroup") {
      passes = this.state[control.name].indexOf(control.value) > -1;
    } else {
      passes = this.state[control.name] === control.value;
    }

    return passes;
  },

  // A field has a value if it's not null, falsey, an empty array, and the
  // field is not optional. In any of these cases, this field doesn't count
  // (and so reduces by adding 0 to the running tally, rather than 1).
  hasFieldValue: function(name, value) {
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
