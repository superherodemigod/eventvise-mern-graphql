import React from 'react';
import { Link } from "react-router-dom";
import Lottie from 'lottie-react-web';

import { Query } from 'react-apollo';

import { GET_PROJECTS } from "../schema.js";
import { Style } from "react-style-tag";
import { getUser, isEquivalent } from "../lib";
import { GET_USER } from "../schema";

import lz from 'lz-string';

import {
    Card,
    CardBody,
    CardImg,
    Row,
    Col,
    Button,
    Progress
} from "reactstrap"

export default class Main extends React.Component {
    render() {
        let user = getUser();

        return (
            <div style={{ padding: "30px" }}>
                <div className="main_animations_title">Animations</div>
                <br />
                <Row>
                    {user != '' ? (
                        <Query
                            query={GET_USER}
                            variables={{ nickname: user }}>
                            {({ data, loading, error }) => {
                                if (loading) return <div></div>;
                                if (error) return <div></div>;

                                return (data.getUser != null ? (
                                    data.getUser.projects.length > 0 ? (data.getUser.projects.map((project, id) => (
                                        <Col lg="4" md="6" sm="12">
                                            <Link to={{ pathname: `${`/animation/${project.title}`}`, state: { json: JSON.stringify([]) } }}>
                                                <Card key={id} style={{paddingTop:"20px"}}>
                                                    <div className="img-fluid mb-2">
                                                        <Lottie options={{
                                                            loop: true,
                                                            autoplay: true,
                                                            animationData: JSON.parse(project.json)
                                                        }}
                                                            width={Math.floor((window.innerWidth * 0.8) / 4)}>
                                                        </Lottie>
                                                    </div>
                                                    <CardBody>
                                                        <div className="card-btns d-flex justify-content-between mt-2">
                                                            {data.getUser.type === 'DS' ? (
                                                                <h5>
                                                                    <Link to={{ pathname: `${`/full/${project.title}`}`, state: { json: JSON.stringify([]) } }}>
                                                                        <i className="fas fa-compress"></i>
                                                                    </Link>
                                                                </h5>
                                                            ) : ''}
                                                            <h5>
                                                                {project.title}
                                                            </h5>
                                                            {/* <Button.Ripple color="primary" outline onClick={(e) => {
                                                                // e.preventDefault()
                                                            }}>
                                                                Edit
                                                            </Button.Ripple> */}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Link>
                                        </Col>
                                    ))) : ''
                                ) : '')
                            }}
                        </Query>
                    ) : ''}
                </Row>
            </div>

        );
    }
}
