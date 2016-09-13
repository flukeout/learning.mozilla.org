var React = require('react');
var ReactDOM = require('react-dom');
var Formed = require('./Formed.jsx');


// Step 2 is controlled by an "intent" field, which indicatess
// whether an applicant wants to start a new club, or integrate
// their existing club into the Mozilla program.
//
// We Use a dedicated form just for this choiceGrooup, with a
// form update listener so that changes to this field can be
// used to update the labels for all the fields in the "real"
// form, defined below.
var intent = {
  start: "Start a new club",
  integrate: "Integrate a Mozilla Club with your existing program"
};

var intentFields = {
  intent: {
    type: "choiceGroup",
    label: "Do you want to...",
    options: [intent.start, intent.integrate],
    validator: {
      error: "You need to fill in this part of the application."
    }
  }
};

// Our two sets of possible form labels:

var startlabels = {
  name: "Name your club",
  description: "Description for your club",
  meetingVenue: "Where will you meet",
  frequency: "How often will you meet?",
  ageRange: "What will the age range of your audience be?",
  clubSize: "What is the size of your club?",
  audienceType: "What occupations will your audience have?",
  meetingSubjects: "What topics/subjects will you teach?"
};

var integrateLabels = {
  name: "Name of your existing program",
  description: "Description for your existing program",
  meetingVenue: "Where do you meet",
  frequency: "How often do you meet?",
  ageRange: "What is the age range of your audience?",
  clubSize: "What is the size of your club?",
  audienceType: "What occupations does your audience have?",
  meetingSubjects: "What topics/subjects do you teach?"
};

// Our actual form definition:

var fields = {
  name: {
    type: "text",
    label: startlabels.name,
    placeholder: "Your club name.",
    validator: {
      error: "You need to fill in the name of your club."
    }
  },
  description: {
    type: "textarea",
    label: startlabels.description,
    placeholder: "Describe what you want to achieve and what your goals are. Minimum length 50 words.",
    validator: [
      {
        error: "You must describe your club."
      },
      {
        validate: function(value) {
          if (!value) {
            return false;
          }

          var count = value.trim().split(' ').length;

          return count < 45;
        },
        error: "Please describe your club using 45 words or more."
      }
    ]
  },
  meetingVenue: {
    type: "text",
    label: startlabels.meetingVenue,
    placeholder: "Name of the venue where you will meet",
    validator: {
      error: "Please let us know where your club meets."
    }
  },
  frequency: {
    type: "choiceGroup",
    label: startlabels.frequency,
    options: ["Weekly", "Biweekly", "Monthly", "Other"],
    validator: {
      error: "Please let us know how often you (will) meet."
    }
  },
  customFrequency: {
    type: "text",
    placeholder: "If \"Other\", please explain",
    controller: {
      name: "frequency",
      value: "Other"
    },
    // this field does not count towards total form completion
    metered: false,
    validator: {
      error: "If you picked \"other\" for how often you will meet, please explain why."
    }
  },
  ageRange: {
    type: "checkboxGroup",
    label: startlabels.ageRange,
    options: ["12 or below", "12-20", "21-35", "36-60", "61-older", "Other"],
    validator: {
      error: "Please let us know what kind of age your audience has."
    }
  },
  customAgeRange: {
    type: "text",
    placeholder: "If \"Other\", please explain",
    controller: {
      name: "ageRange",
      value: "Other"
    },
    // this field does not count towards total form completion
    metered: false,
    validator: {
      error: "If you picked \"other\" for your audience age range, please explain why."
    }
  },
  clubSize: {
    type: "choiceGroup",
    label: startlabels.clubSize,
    options: ["1-5", "6-15", "16-30", "31+"],
    validator: {
      error: "Please let us know how big your club is."
    }
  },
  audienceType: {
    type: "text",
    label: startlabels.audienceType,
    placeholder: "Students, professionals, community leaders, etc...",
    validator: {
      error: "Please let us know what kind of audience your club is for."
    }
  },
  meetingSubjects: {
    type: "text",
    label: startlabels.meetingSubjects,
    placeholder: "Web literacy, 21st century skills, online privacy, social media, etc...",
    validator: {
      error: "Please let us know what topics and subjects your club covers."
    }
  },
  pledgeAgreement: {
    type: "checkbox",
    label: <span>I agree to the <a target="_blank" href="https://mozilla.github.io/learning-networks/clubs/pledge/#introduction">Mozilla Club Captain Pledge</a></span>,
    validator: {
      error: "You must agree to the Club Captain Pledge before you can submit this application."
    }
  }
};

/**
 * And a still-simple-but-with-some-logic second part
 * of the application form, controlled by intent.
 */
var StepTwo = React.createClass({
  getInitialState() {
    return {
      intent: false
    };
  },
  bindIntent(intentState) {
    this.setState(intentState);
  },
  setFieldLabels(labels) {
    Object.keys(labels).forEach(key => {
      fields[key].label = labels[key];
    });
  },
  render() {
    var intentValue = this.state.intent;

    if (intentValue) {
      console.log(intentValue);
      if (intentValue === intent.start) {
        this.setFieldLabels(startlabels);
      } else if (intentValue === intent.integrate) {
        this.setFieldLabels(integrateLabels);
      }
    }

    if (!intentValue) {
      return <Formed {...{ fields: intentFields, onChange: this.bindIntent }} />;
    }

    // We always show the intent selector, in case an applicant misclicked.
    return (
      <div>
        <Formed {...{ fields: intentFields, onChange: this.bindIntent }} />
        <Formed {...{ fields, onChange: this.props.onChange, onProgress: this.props.onProgress }} />
      </div>
    );
  }
});

module.exports = StepTwo;
