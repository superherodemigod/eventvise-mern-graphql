import React from "react"
import {
    Media,
    Row,
    Col,
    Button,
    Form,
    Input,
    Label,
    FormGroup,
    Table
} from "reactstrap"
import userImg from "../../assets/img/portrait/small/avatar-s-18.jpg"
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check, Lock } from "react-feather"

import { Mutation, Query } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { GET_USER_MEDIUM, ADD_TAG, REMOVE_USER, REMOVE_USER_ANIMATION, ADD_PROJECT, GET_USERS } from "../../schema.js";
import { reload } from "../../lib";
import { client } from '../../graphql'
class AccountTab extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        // console.log(this.props.nickname);
        return (
            <Query
                query={GET_USER_MEDIUM} variables={{ nickname: this.props.nickname }}>
                {({ data, loading, error }) => {
                    if (error) return <div></div>;
                    if (loading) return <div></div>;

                    return (
                        <Row>
                            <Col sm="12">
                                <Media className="mb-2">
                                    <Media className="mr-2 my-25" left href="#">
                                        <Media
                                            className="users-avatar-shadow rounded"
                                            object
                                            src={userImg}
                                            alt="user profile image"
                                            height="84"
                                            width="84"
                                        />
                                    </Media>
                                    <Media className="mt-2" body>
                                        <Media className="font-medium-1 text-bold-600" tag="p" heading>
                                            {data.getUser.nickname}
                                        </Media>
                                        <div className="d-flex flex-wrap">
                                            <Button.Ripple className="mr-1" color="primary" outline>
                                                Change
                                            </Button.Ripple>
                                            <Button.Ripple color="flat-danger">Remove Avatar</Button.Ripple>
                                        </div>
                                    </Media>
                                </Media>
                            </Col>
                            <Col sm="12">
                                <Form onSubmit={e => e.preventDefault()}>
                                    <Row>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label for="username">Username</Label>
                                                <Input
                                                    type="text"
                                                    defaultValue={data.getUser.nickname}
                                                    id="username"
                                                    placeholder="Username"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label for="name">Name</Label>
                                                <Input
                                                    type="text"
                                                    defaultValue={data.getUser.nickname}
                                                    id="name"
                                                    placeholder="Name"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label for="role">Role</Label>
                                                <Input type="select" name="role" id="role" defaultValue={data.getUser.tags}>
                                                    <option>User</option>
                                                    <option>Admin</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" sm="12">
                                            <FormGroup>
                                                <Label for="email">Email</Label>
                                                <Input
                                                    type="text"
                                                    defaultValue={data.getUser.email}
                                                    id="email"
                                                    placeholder="Email"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col
                                            className="d-flex justify-content-end flex-wrap mt-2"
                                            sm="12"
                                        >
                                            <Button.Ripple className="mr-1" color="primary">
                                                Save Changes
                                            </Button.Ripple>
                                            <Button.Ripple color="flat-warning">Reset</Button.Ripple>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    )
                }}
            </Query>
        )
    }
}
export default AccountTab

