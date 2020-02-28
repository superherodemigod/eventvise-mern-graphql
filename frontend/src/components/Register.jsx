import React from 'react';

import { Mutation } from 'react-apollo';

import { ADD_USER } from "../schema.js";
import { Link, Redirect } from "react-router-dom";
import { addCookie, reload } from "../lib.js";
// import Redirect from "react-router-dom/es/Redirect";

import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap"
import classnames from "classnames"
import registerImg from "../assets/img/pages/register.jpg"
import "../assets/scss/pages/authentication.scss"

import { Form, FormGroup, Input, Label, Button } from "reactstrap"
import Checkbox from "./@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { history } from "../history"



export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            confirmPass: '',
            email: '',
            type: '',
            registered: false,
            loggedIn: false
        }
    }

    render() {
        var { login, password, email, type, registered, confirmPass } = this.state;

        return (
            // <div>
            <div style={{marginTop:"100px"}}>
                <Row className="m-0 justify-content-center" >
                    <Col
                        sm="8"
                        xl="7"
                        lg="10"
                        md="8"
                        className="d-flex justify-content-center"
                    >
                        <Card className="bg-authentication rounded-0 mb-0 w-100">
                            <Row className="m-0">
                                <Col
                                    lg="6"
                                    className="d-lg-block d-none text-center align-self-center px-1 py-0"
                                >
                                    <img className="mr-1" src={registerImg} alt="registerImg" />
                                </Col>
                                <Col lg="6" md="12" className="p-0">
                                    <Card className="rounded-0 mb-0 p-2">
                                        <CardHeader className="pb-1 pt-50">
                                            <CardTitle>
                                                <h4 className="mb-0">Create Account</h4>
                                            </CardTitle>
                                        </CardHeader>
                                        <p className="px-2 auth-title mb-0">
                                            Fill the below form to create a new account.
                                        </p>
                                        <CardBody className="pt-1 pb-50">
                                            <Form action="/" onSubmit={this.handleRegister}>
                                                <FormGroup className="form-label-group">
                                                    <Input
                                                        type="text"
                                                        placeholder="Username"
                                                        // required
                                                        // value={this.state.name}
                                                        // onChange={e => this.setState({ name: e.target.value })}
                                                        onChange={(e) => { this.setState({ login: e.target.value }) }}
                                                        value={login}
                                                        required
                                                    />
                                                    <Label>Username</Label>
                                                </FormGroup>
                                                <FormGroup className="form-label-group">
                                                    <Input
                                                        type="email"
                                                        placeholder="Email"
                                                        required
                                                        // value={this.state.email}
                                                        // onChange={e => this.setState({ email: e.target.value })}
                                                        onChange={(e) => { this.setState({ email: e.target.value }) }}
                                                        value={email}
                                                    />
                                                    <Label>Email</Label>
                                                </FormGroup>
                                                <FormGroup className="form-label-group">
                                                    <Input
                                                        type="password"
                                                        placeholder="Password"
                                                        required
                                                        // value={this.state.password}
                                                        // onChange={e => this.setState({ password: e.target.value })}
                                                        onChange={(e) => { this.setState({ password: e.target.value }) }}
                                                        value={password}
                                                    />
                                                    <Label>Password</Label>
                                                </FormGroup>
                                                <FormGroup className="form-label-group">
                                                    <Input
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        required
                                                        value={confirmPass}
                                                        onChange={e => this.setState({ confirmPass: e.target.value })}
                                                    />
                                                    <Label>Confirm Password</Label>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Checkbox
                                                        color="primary"
                                                        icon={<Check className="vx-icon" size={16} />}
                                                        label=" I accept the terms & conditions."
                                                        defaultChecked={true}
                                                    />
                                                </FormGroup>
                                                {/* <div > */}
                                                <Mutation mutation={ADD_USER} variables={{ nickname: login, password: password, email: email, type: type, tags: 'User' }}>
                                                    {(mutate, { data, loading, error }) => {
                                                        if (error) console.log(error);
                                                        if (data != undefined) {
                                                            console.log(data)
                                                            if (data.addUser.length < 60) {
                                                                return (
                                                                    <div>
                                                                        {/* <button className="auth_btn" >Sign Up</button> */}
                                                                        <Button.Ripple color="primary" onClick={() => {
                                                                            if (login.length > 0 && email.length > 0 && password.length > 0) {
                                                                                mutate();
                                                                            }
                                                                        }}>
                                                                            Register
                                                                            </Button.Ripple>
                                                                        <Button.Ripple
                                                                            color="primary"
                                                                            outline 
                                                                            onClick={() => {
                                                                                history.push("/login")
                                                                                reload()
                                                                            }}
                                                                        >
                                                                            Login
                                                                        </Button.Ripple>
                                                                        <br /><br />
                                                                        <div className="error">
                                                                            {data.addUser}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            } else if (!loading && data && login.length > 0 && email.length > 0 && password.length > 0) {
                                                                addCookie('user', data.addUser.userAuth, 9999999999999);
                                                                addCookie('user_name', this.state.login, 9999999999999);
                                                                if (registered == false) {
                                                                    setTimeout(() => {
                                                                        this.setState({
                                                                            loggedIn: true
                                                                        })
                                                                    }, 650);

                                                                    this.setState({
                                                                        registered: true
                                                                    })
                                                                }
                                                            }
                                                        }

                                                        return (
                                                            <div className="d-flex justify-content-between">
                                                                <Button.Ripple color="primary" onClick={() => {
                                                                    if (login.length > 0 && email.length > 0 && password.length > 0) {
                                                                        mutate();
                                                                    }
                                                                }}>Register
                                                                    </Button.Ripple>
                                                                <Button.Ripple
                                                                    color="primary"
                                                                    outline onClick={() => {
                                                                        history.push("/login")
                                                                        reload()
                                                                    }}
                                                                >
                                                                    Login
                                                                </Button.Ripple>
                                                            </div>
                                                        );
                                                    }}
                                                </Mutation>

                                                {/* <Link to="/login/" className="sign_link">Login</Link> */}
                                                <br /><br />
                                                {registered == true ? <div className="log-in">You are successfully registered</div> : ''}
                                                {this.state.loggedIn == true ? <div>
                                                    <Redirect to="/login" />
                                                    {window.location.replace('/login')}
                                                </div> : ''}
                                                {/* </div> */}
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    };
}
