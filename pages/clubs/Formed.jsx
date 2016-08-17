var React = require('react');
var ReactDOM = require('react-dom');
var LocationSelector = require('../../components/LocationSelector.jsx');
var Select = require('react-select');


var Formed = React.createClass({
  getInitialState: function() {
    console.log(this.props);
    var initial = {};
    var fields = this.props.fields || {};
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
    this.setState(newState, () => {
      if (this.props.onChange) {
        this.props.onChange(newState);
      }
      if (this.state.errors && this.state.errors.length>0) {
        this.validates();
      }
    });
  },

  render: function() {
    return (
      <div className={this.props.className}>
        { Object.keys(this.props.fields).map(name => this.formFields(name, this.props.fields[name])) }
        { this.renderValidationErrors() }
      </div>
    );
  },

  formFields: function(name, field) {
    var Type = field.type,
        ftype = typeof Type,
        label = field.label,
        formfield = null;

    var common = {
      key: name + 'field',
      value: this.state[name],
      onChange: e => this.update(name, e),
      placeholder: field.placeholder
    };

    var shouldHide = false;
    if (field.hidden) {
      var controller = field.controller.name;
      var controlValue = field.controller.value;
      shouldHide = this.state[controller] !== controlValue;
    }

    if (label) {
      label = <label key={name + 'label'} hidden={shouldHide}>{label}</label>
    } else { label = null; }

    if (ftype === "undefined" || Type === "text") {
      formfield = <input type={Type? Type : "text"} {...common} hidden={shouldHide}/>
    }

    if (Type === "choiceGroup") {
      var choices = field.options;
      formfield = <div className={Type} key={common.key}>{
        choices.map(value => {
          return <div><input type="radio" name={name} value={value} checked={this.state[name] === value} onChange={common.onChange}/>{value}</div>;
        })
      }
      </div>;
    }

    if (ftype === "function") {
      formfield = <Type {...field} {...common}/>
    }

    return <fieldset key={name + 'set'}>{ [label, formfield] }</fieldset>;
  },

  update: function(fieldname, e) {
    var state = {};
    state[fieldname] = e.target? e.target.value : e;
    this.setStateAsChange(state);
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
