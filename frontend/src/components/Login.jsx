import React from 'react';

import { Query } from 'react-apollo';

import { USER_AUTH } from "../schema.js";
import { Link, Redirect } from "react-router-dom";
// import {Redirect} from "react-router-dom";
// import Redirect from "react-router-dom/es/Redirect";
import { addCookie, getCookie, reload } from "../lib";

import {
    Button,
    Card,
    CardBody,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap"
import { Mail, Lock, Check, Facebook, Twitter, GitHub } from "react-feather"
import { history } from "../history"
import Checkbox from "../components/@vuexy/checkbox/CheckboxesVuexy"
import googleSvg from "../assets/img/svg/google.svg"

import loginImg from "../assets/img/pages/login.png"
import "../assets/scss/pages/authentication.scss"

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            loggedIn: false
        };

        this.auth = false
    }

    render() {
        var { login, password, auth } = this.state;

        return (
            <div style={{ marginTop: "100px" }} >
                <Row className="m-0 justify-content-center">
                    <Col
                        sm="8"
                        xl="7"
                        lg="10"
                        md="8"
                        className="d-flex justify-content-center"
                    >
                        <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
                            <Row className="m-0">
                                <Col
                                    lg="6"
                                    className="d-lg-block d-none text-center align-self-center px-1 py-0"
                                >
                                    <img src={loginImg} alt="loginImg" />
                                </Col>
                                <Col lg="6" md="12" className="p-0">
                                    <Card className="rounded-0 mb-0 px-2">
                                        <CardBody>
                                            <h4>Login</h4>
                                            <p>Welcome back, please login to your account.</p>
                                            <Form onSubmit={e => e.preventDefault()}>
                                                <FormGroup className="form-label-group position-relative has-icon-left">
                                                    <Input
                                                        type="text"
                                                        placeholder="Username"
                                                        // value={this.state.email}
                                                        // onChange={e => this.setState({ email: e.target.value })}
                                                        onChange={(e) => { this.setState({ login: e.target.value }) }}
                                                        value={login}
                                                        required
                                                    />
                                                    <div className="form-control-position">
                                                        <Mail size={15} />
                                                    </div>
                                                    <Label>Username</Label>
                                                </FormGroup>
                                                <FormGroup className="form-label-group position-relative has-icon-left">
                                                    <Input
                                                        type="password"
                                                        placeholder="Password"
                                                        // value={this.state.password}
                                                        // onChange={e => this.setState({ password: e.target.value })}
                                                        onChange={(e) => { this.setState({ password: e.target.value }) }}
                                                        value={password}
                                                        required
                                                    />
                                                    <div className="form-control-position">
                                                        <Lock size={15} />
                                                    </div>
                                                    <Label>Password</Label>
                                                </FormGroup>
                                                <FormGroup className="d-flex justify-content-between align-items-center">
                                                    <Checkbox
                                                        color="primary"
                                                        icon={<Check className="vx-icon" size={16} />}
                                                        label="Remember me"
                                                    />
                                                    <div className="float-right">
                                                        <Link to="/forgot-password">Forgot Password?</Link>
                                                    </div>
                                                </FormGroup>
                                                <div className="d-flex justify-content-between">
                                                    <Button.Ripple color="primary" outline onClick={() => {
                                                        history.push("/register")
                                                        reload()
                                                    }}>
                                                        Register
                                                    </Button.Ripple>
                                                    <Button.Ripple className="btn_login" onClick={() => {
                                                        this.auth = true;
                                                        this.forceUpdate()
                                                    }}>
                                                        Login
                                                    </Button.Ripple>
                                                </div>
                                            </Form>
                                            {this.state.loggedIn == true ? <div>
                                                <Redirect to="/dashboard" />
                                                {window.location.replace('/dashboard')}
                                            </div> : ''}
                                            <br /><br />
                                            {this.auth ? (
                                                <Query query={USER_AUTH} variables={{ login: login, password: password }} errorPolicy="all">
                                                    {({ data, loading, error }) => {
                                                        this.auth = false;
                                                        if (error) console.log(error);
                                                        if (loading) return <div></div>;
                                                        if (data != undefined) {
                                                            if (data.userAuth.length < 40) {
                                                                return (
                                                                    <div className="error">
                                                                        {data.userAuth}
                                                                    </div>
                                                                )
                                                            } else if (!loading && data) {
                                                                setTimeout(() => {
                                                                    this.setState({
                                                                        loggedIn: true
                                                                    })
                                                                }, 650);
                                                                addCookie('user', data.userAuth, 9999999999999);
                                                                addCookie('user_name', this.state.login, 9999999999999);
                                                            }
                                                        }

                                                        return (
                                                            <div className="log-in">You are successfully logged in</div>
                                                        );
                                                    }}
                                                </Query>
                                            ) : ''}
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Card >
                    </Col >
                </Row >
            </div>
        );
    };
}



