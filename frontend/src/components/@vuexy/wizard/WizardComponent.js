import React from "react"
import PropTypes from "prop-types"
import classnames from "classnames"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"

class VuexyWizard extends React.Component {
  state = {
    activeStep: this.props.activeStep
  }

  handleActiveStep = step => {
    this.setState({
      activeStep: step
    })
  }

  render() {
    return (
      <React.Fragment>
        <Nav
          className={`vx-wizard ${
            this.props.className ? this.props.className : ""
          }`}
          tabs
        >
          {this.props.stepsTitle.map((title, i) => {
            return (
              <NavItem
                className="step-wrapper"
                key={i}
                onClick={() => this.handleActiveStep(i)}
              >
                <NavLink
                  className={classnames(`step step-${i}`, {
                    active: this.props.activeStep === i ? true : false,
                    done: i < this.props.activeStep
                  })}
                >
                  <span className="step-text">{title}</span>
                </NavLink>
              </NavItem>
            )
          })}
        </Nav>
        <TabContent
          className={`vx-wizard-content ${
            this.props.tabPaneClass ? this.props.tabPaneClass : ""
          }`}
          activeTab={this.props.activeStep}
        >
          {this.props.stepsContent.map((content, i) => {
            return (
              <TabPane
                className={`step-content step-${i}-content`}
                key={i}
                tabId={i}
              >
                {content}
              </TabPane>
            )
          })}
        </TabContent>
      </React.Fragment>
    )
  }
}

VuexyWizard.propTypes = {
  stepsTitle: PropTypes.array,
  stepsContent: PropTypes.array,
  activeStep: PropTypes.number
}

export default VuexyWizard
