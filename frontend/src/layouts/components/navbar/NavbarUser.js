import React from "react"
import {
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Media,
  Badge
} from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import axios from "axios"
import * as Icon from "react-feather"
import classnames from "classnames"
import Autocomplete from "../../../components/@vuexy/autoComplete/AutoCompleteComponent"
import { history } from "../../../history"

import { isEquivalent, logOut, reload } from '../../../lib.js';
import { Link } from "react-router-dom"

const UserDropdown = props => {
  return (
    <DropdownMenu right>
      {props.adminItem ?
        <Link to="/admin/">
          <DropdownItem tag="a" href="#">
            <Icon.Users size={14} className="mr-50" />
            <span className="align-middle">To Admin</span>
          </DropdownItem>
        </Link> : null}
      <DropdownItem tag="a" href="#">
        <Icon.User size={14} className="mr-50" />
        <span className="align-middle">Edit Profile</span>
      </DropdownItem>
      {/* <DropdownItem tag="a" href="#">
        <Icon.Mail size={14} className="mr-50" />
        <span className="align-middle">My Inbox</span>
      </DropdownItem>
      <DropdownItem tag="a" href="#">
        <Icon.CheckSquare size={14} className="mr-50" />
        <span className="align-middle">Tasks</span>
      </DropdownItem>
      <DropdownItem tag="a" href="#">
        <Icon.MessageSquare size={14} className="mr-50" />
        <span className="align-middle">Chats</span>
      </DropdownItem>
      <DropdownItem tag="a" href="#">
        <Icon.Heart size={14} className="mr-50" />
        <span className="align-middle">WishList</span>
      </DropdownItem> */}
      <DropdownItem divider />
      <DropdownItem
        tag="a"
        href="#"
        onClick={() => {
          logOut()
          // window.location.reload(false)
          history.push("/login")
          reload();
          // history.
        }}
      >
        <Icon.Power size={14} className="mr-50" />
        <span className="align-middle">Log Out</span>
      </DropdownItem>
    </DropdownMenu>
  )
}

class NavbarUser extends React.PureComponent {
  state = {
    navbarSearch: false,
    suggestions: []
  }

  componentDidMount() {
    axios.get("/api/main-search/data").then(({ data }) => {
      this.setState({ suggestions: data.searchResult })
    })
  }

  handleNavbarSearch = () => {
    this.setState({
      navbarSearch: !this.state.navbarSearch
    })
  }


  render() {
    return (
      <ul className="nav navbar-nav navbar-nav-user float-right">
        <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
          <DropdownToggle tag="a" className="nav-link dropdown-user-link">
            <div className="user-nav d-sm-flex d-none">
              <span className="user-name text-bold-600">
                {this.props.userName}
              </span>
            </div>
            <span data-tour="user">
              <img
                src={this.props.userImg}
                className="round"
                height="40"
                width="40"
                alt="avatar"
              />
            </span>
          </DropdownToggle>
          <UserDropdown {...this.props} />
        </UncontrolledDropdown>
      </ul>
    )
  }
}
export default NavbarUser
