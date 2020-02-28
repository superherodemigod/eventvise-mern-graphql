import React from "react"
import {
  NavItem,
  NavLink,
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap"
import * as Icon from "react-feather"
import { Link } from "react-router-dom"
import classnames from "classnames"
import AutoComplete from "../../../components/@vuexy/autoComplete/AutoCompleteComponent"
import { history } from "../../../history"
import { connect } from "react-redux"
import {
  loadSuggestions,
  updateStarred
} from "../../../redux/actions/navbar/Index"

class NavbarBookmarks extends React.PureComponent {
  state = {
    showBookmarks: false,
    value: "",
    noSuggestions: false,
    isStarred: false,
    suggestions: []
  }

  handleBookmarksVisibility = () => {
    this.setState({
      showBookmarks: !this.state.showBookmarks,
      value: "",
      suggestions: [],
      noSuggestions: false,
      starred: null
    })
  }

  componentDidUpdate() {
    this.props.handleAppOverlay(this.state.value)
  }

  componentDidMount() {
    let {
      bookmarks: { suggestions },
      loadSuggestions
    } = this.props
    this.setState(
      {
        suggestions: suggestions
      },
      loadSuggestions()
    )
  }

  renderBookmarks = () => {
    return this.props.bookmarks.starred.map(item => {
      const IconTag = Icon[item.icon ? item.icon : "X"]
      return (
        <React.Fragment key={item.id}>
          <NavItem className="nav-item d-none d-lg-block">
            <NavLink
              tag="span"
              id={item.target}
              className="nav-link cursor-pointer"
              onClick={() => history.push(item.link)}
            >
              <IconTag size={21} />
            </NavLink>
            <UncontrolledTooltip placement="bottom" target={item.target}>
              {item.title}
            </UncontrolledTooltip>
          </NavItem>
        </React.Fragment>
      )
    })
  }

  render() {
    let {
      bookmarks: { extraStarred, suggestions },
      sidebarVisibility,
      updateStarred,
      handleAppOverlay
    } = this.props

    const renderExtraStarred =
      extraStarred.length > 0
        ? extraStarred.map(i => {
            const IconTag = Icon[i.icon ? i.icon : null]
            return (
              <DropdownItem key={i.id} href={i.link}>
                <IconTag size={15} />
                <span className="align-middle ml-1">{i.title}</span>
              </DropdownItem>
            )
          })
        : null

    return (
      <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu mr-auto">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={sidebarVisibility}
            >
              <Icon.Menu className="ficon" />
            </NavLink>
          </NavItem>
        </ul>
        <ul className="nav navbar-nav bookmark-icons">
          {this.renderBookmarks()}
          {extraStarred.length > 0 ? (
            <NavItem>
              <NavLink tag="div">
                <UncontrolledDropdown>
                  <DropdownToggle tag="span">
                    <Icon.ChevronDown />
                  </DropdownToggle>
                  <DropdownMenu right>{renderExtraStarred}</DropdownMenu>
                </UncontrolledDropdown>
              </NavLink>
            </NavItem>
          ) : null}
          <NavItem
            className="nav-item d-none d-lg-block"
            onClick={this.handleBookmarksVisibility}
          >
            <NavLink>
              <Icon.Star className="text-warning" size={21} />
            </NavLink>
            <div
              className={classnames("bookmark-input search-input", {
                show: this.state.showBookmarks
              })}
            >
              <div className="bookmark-input-icon">
                <Icon.Search size={15} className="primary" />
              </div>

              <AutoComplete
                suggestions={suggestions}
                className="form-control"
                filterKey="title"
                autoFocus={true}
                suggestionLimit={this.state.value.length ? 6 : 100}
                clearInput={this.state.showBookmarks}
                defaultSuggestions={true}
                onChange={e => this.setState({ value : e.target.value })}
                externalClick={e => this.setState({ showBookmarks : false })}
                onKeyDown={e => {
                  if (e.keyCode === 27 || e.keyCode === 13) {
                    this.setState({
                      showBookmarks: false
                    })
                    handleAppOverlay("")
                  }
                }}
                customRender={(
                  suggestion,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover,
                  userInput
                ) => {
                  const IconTag = Icon[suggestion.icon ? suggestion.icon : "X"]
                  if (userInput.length) {
                    return (
                      <li
                        className={classnames(
                          "suggestion-item d-flex justify-content-between",
                          {
                            active:
                              filteredData.indexOf(suggestion) ===
                              activeSuggestion
                          }
                        )}
                        key={suggestion.target}
                        onClick={e => {
                          if (!this.state.showBookmarks) {
                            e.stopPropagation()
                          }
                        }}
                      >
                        <Link
                          to={suggestion.link}
                          className="component-info w-100"
                          onClick={() =>
                            this.setState({ showBookmarks: false })
                          }
                        >
                          <IconTag size={15} />
                          <span className="align-middle ml-1">
                            {suggestion.title}
                          </span>
                        </Link>
                        <Icon.Star
                          className={classnames({
                            "text-warning": suggestion.starred === true
                          })}
                          size={17}
                          onClick={e => {
                            updateStarred(suggestion)
                            e.stopPropagation()
                          }}
                        />
                      </li>
                    )
                  } else {
                    return suggestion.starred === true ? (
                      <li
                        key={suggestion.target}
                        className={classnames(
                          "suggestion-item d-flex justify-content-between",
                          {
                            active:
                              filteredData.indexOf(suggestion) ===
                              activeSuggestion
                          }
                        )}
                        onClick={e => {
                          if (!this.state.showBookmarks) {
                            e.stopPropagation()
                          }
                        }}
                      >
                        <Link
                          to={suggestion.link}
                          className="component-info w-100"
                          onClick={e => this.setState({ showBookmarks: false })}
                        >
                          <IconTag size={15} />
                          <span className="align-middle ml-1">
                            {suggestion.title}
                          </span>
                        </Link>
                        <Icon.Star
                          className={classnames({
                            "text-warning": suggestion.starred === true
                          })}
                          size={17}
                          onClick={e => {
                            updateStarred(suggestion)
                            e.stopPropagation()
                          }}
                        />
                      </li>
                    ) : null
                  }
                }}
                onSuggestionsShown={userInput => {
                  if (this.state.showBookmarks) {
                    handleAppOverlay(userInput)
                  }
                }}
              />
            </div>
          </NavItem>
        </ul>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    bookmarks: state.navbar
  }
}

export default connect(mapStateToProps, { loadSuggestions, updateStarred })(
  NavbarBookmarks
)
