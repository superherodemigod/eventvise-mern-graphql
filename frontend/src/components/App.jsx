import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

import logo from '../static/logo/logo.png';
import { isEquivalent, logOut } from '../lib.js';
import user from '../getUser.js';

import { Query } from 'react-apollo';
import { GET_USER_LIGHT, GET_USERS } from '../schema.js';

import { isEqual } from "lodash";

import Main from './Main.jsx';
import Upload from './Upload.jsx';
import Animation from './Animation.jsx';
import Anim from './Anim.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Admin from "./Admin.jsx";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import FullScreen from "./FullScreen.jsx";
import Edit from "./editUser/Edit.jsx";

import "./@vuexy/rippleButton/RippleButton"

import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"

import "../style.css"

import { getCookie, getUser } from "../lib";
// import { Navbar } from 'reactstrap';
import NavbarUser from '../layouts/components/navbar/NavbarUser';
import userImg from "../assets/img/portrait/small/avatar-s-11.jpg"
import createHistory from 'history/createBrowserHistory';
const history = createHistory();
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.user_ = true;
        this.tag = '';
    }

    getHeader() {
        let user = getUser();

        return (<header>
            <div>
                <Link to='/'>
                    <img src={logo} alt="Animations" />
                </Link>
            </div>
            <div className="header-login">
                {user != '' ? (
                    <Query
                        query={GET_USER_LIGHT}
                        variables={{ nickname: user }}>
                        {({ data, loading, error }) => {
                            if (loading) return <div></div>
                            if (error) {
                                if (this.user_ == true) {
                                    this.user_ = false;
                                    this.forceUpdate()
                                }
                                return (
                                    <Link to='/login/' style={{ textDecoration: `none` }} className="user-avt"><button>Sign In</button></Link>
                                )
                            }

                            var isEmpty = isEquivalent({}, data.getUser);

                            if (!isEmpty) {
                                this.tag = data.getUser.tags
                            }

                            return !isEmpty ? this.showUser(data) : ''
                        }}
                    </Query>
                ) : <Link className="user-avt" to='/login/' style={{ textDecoration: `none` }}>{this.user_ == true ? this.user_ = false : ''}<button>Sign In</button></Link>}


            </div>
        </header>);
    }

    render() {
        let user = getUser();

        return (
            <Router history={history}>
                <div>
                    <Switch>
                        <Route path="/login/" component={Login} />
                        <Route path="/register/" component={Register} />
                        <Route path="/forgot-password/" component={ForgotPassword} />
                        <Route path="/reset-password/" component={ResetPassword} />
                        <Route>
                            {this.getHeader()}
                            <Switch>
                                <Route path="/" exact component={Main} />
                                <Route path="/dashboard" exact component={Main} />
                                <Route path="/animation/:animation/" component={Animation} />
                                <Route path="/anim/:animation/" component={Anim} />

                                <Route path="/admin/:nickname" component={Edit} />
                                <Route path="/admin/" render={() => {
                                    return user != '' ? (
                                        <Query
                                            query={GET_USER_LIGHT}
                                            variables={{ nickname: user }}>
                                            {({ data, loading, error }) => {
                                                if (error) return (<div>{error}</div>);
                                                if (loading) return (<div>Loading...</div>);
                                                return data != undefined ? (!isEquivalent({}, data.getUser) ? data.getUser.tags == "Mod" ? <Admin></Admin> : <Redirect to='/' /> : '') : '';
                                            }}
                                        </Query>
                                    ) : <Redirect to='/' />
                                }
                                } />
                                <Route path="/full/:animation/" component={FullScreen} />
                                <Route path="/upload" component={Upload} />
                            </Switch>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }

    showUser(data) {
        return isEquivalent({}, data) == false ? (
            <div className="user_info_bar_link user-avt">
                {isEquivalent({}, data) == false ? (data.getUser.tags == 'Mod' ? (
                    <div>
                        <div className="user_nickname">
                            <NavbarUser
                                userName={data.getUser.nickname}
                                userImg={userImg}
                                adminItem={true}
                            />
                        </div>

                    </div>
                ) : (
                        <div className="user_nickname">
                            <NavbarUser
                                userName={data.getUser.nickname}
                                userImg={userImg}
                            />
                        </div>
                    )) : ''}
            </div>
        ) : ''
    }
}
