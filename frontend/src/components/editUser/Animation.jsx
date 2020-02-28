import React from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    CustomInput,
    Button,
    Form
} from "reactstrap"

// import { Query } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';
import { GET_PROJECTS, GET_USER } from "../../schema.js";
import { Style } from "react-style-tag";
import { getUser, isEquivalent } from "../../lib";
import { GET_USERS, GET_USER_MEDIUM, ADD_TAG, REMOVE_USER, REMOVE_USER_ANIMATION, ADD_PROJECT } from "../../schema.js";
import { reload } from "../../lib";
import Lottie from 'lottie-react-web';
class AnimationTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            title: '',
            file: '',
            uploaded: ''
        }
    }
    render() {
        // let user = getUser();
        // console.log(user, this.props.nickname);
        let { title, file, user, uploaded } = this.state;
        user = this.props.nickname
        return (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Animations</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className="user-animation-panel">

                            <Query
                                query={GET_USER}
                                variables={{ nickname: user }}>
                                {({ data, loading, error }) => {
                                    if (loading) return <div></div>;
                                    if (error) return <div></div>;

                                    return (data.getUser != null ? (
                                        data.getUser.projects.length > 0 ? (data.getUser.projects.map((project, id) => (
                                            <Col lg="4" md="6" sm="12">
                                                <Card key={id} style={{ paddingTop: "20px" }}>
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
                                                            {/* {data.getUser.type === 'DS' ? (
                                                                    <h5>
                                                                        <Link to={{ pathname: `${`/full/${project.title}`}`, state: { json: JSON.stringify([]) } }}>
                                                                            <i className="fas fa-compress"></i>
                                                                        </Link>
                                                                    </h5>
                                                                ) : ''} */}
                                                            <h5>
                                                                {project.title}
                                                            </h5>
                                                            <Mutation
                                                                mutation={REMOVE_USER_ANIMATION}
                                                                variables={{ nickname: user, animation: project.id }}>
                                                                {(mutate, { loading, error }) => {
                                                                    if (loading) return <div></div>;
                                                                    if (error) return <div></div>;

                                                                    return <Button.Ripple color="primary" outline onClick={() => {
                                                                        mutate();
                                                                        reload();
                                                                    }}>
                                                                        Remove
                                                                        </Button.Ripple>
                                                                }}
                                                            </Mutation>

                                                        </div>
                                                    </CardBody>
                                                </Card>
                                                {/* </Link> */}
                                            </Col>
                                        ))) : ''
                                    ) : '')
                                }}
                            </Query>

                        </Row>

                        <Row>
                            <Mutation mutation={ADD_PROJECT} variables={{ title: title, user: user, file: file, date: new Date() }}>
                                {(mutate, { data, loading, error }) => {
                                    return (
                                        <form className="animation-form" onSubmit={(e) => {
                                            e.preventDefault();
                                        }} >
                                            <Col md="5" sm="12" className="pt-1">
                                                <FormGroup className="form-label-group">
                                                    <Input
                                                        type="text"
                                                        id="floatingInput"
                                                        placeholder="Animation Name"
                                                        onChange={(e) => { this.setState({ title: e.target.value }) }}
                                                        value={title} />
                                                    <Label for="floatingInput">Animation Name</Label>
                                                </FormGroup>
                                            </Col>
                                            <Col md="5" sm="12">
                                                <FormGroup>
                                                    <Label for="customFile">Custom File Input</Label>
                                                    <CustomInput
                                                        type="file"
                                                        id="exampleCustomFileBrowser"
                                                        name="customFile"
                                                        onChange={(e) => { this.setState({ file: e.target.files[0] }) }}
                                                    />
                                                    {/* <input type="file" name="file" id="file" className="inputfile" onChange={(e) => { this.setState({ file: e.target.files[0] }) }} />
                                                    <label htmlFor="file"><i className="fas fa-video"></i> JSON File</label> */}
                                                </FormGroup>
                                                {/* <div>
                                                    {file != undefined && file != '' ? file.name.split('.')[0].slice(0, 13) + '..' + file.name.split('.')[1] : ''}
                                                </div> */}

                                            </Col>
                                            <Col md="2" sm="12" className="pt-2">
                                                <Button.Ripple color="primary" onClick={() => {
                                                    mutate();
                                                    setTimeout(() => {
                                                        this.setState({
                                                            uploaded: true
                                                        });
                                                        reload();
                                                    }, 650)
                                                }}>Send</Button.Ripple>
                                            </Col>
                                            {uploaded == true ? <div className="log-in">Animation successfully uploaded</div> : ''}
                                        </form>
                                    );
                                }}
                            </Mutation>

                            {/* <Col md="6" sm="12" className="pt-1">
                                <FormGroup className="form-label-group">
                                    <Input
                                        type="text"
                                        id="floatingInput"
                                        placeholder="Animation name"
                                    />
                                    <Label for="floatingInput">Label Placeholder</Label>
                                </FormGroup>
                            </Col> */}
                            {/* <Col md="6" sm="12">
                                <FormGroup>
                                    <Label for="customFile">Custom File Input</Label>
                                    <CustomInput
                                        type="file"
                                        id="exampleCustomFileBrowser"
                                        name="customFile"
                                    />
                                </FormGroup>
                            </Col> */}
                        </Row>
                    </CardBody>
                </Card>
            </div>
        );
    }
}
export default AnimationTab

//         {/* <div className="admin_users panel">
            //             <div className="panel_line"></div>
            //             <div className="admin_panel_title">Add Animation</div>
            //             <div className="admin_panel_container"></div>

            //             <Mutation mutation={ADD_PROJECT} variables={{ title: title, user: this.state.user, file: file, date: new Date() }}>
            //                 {(mutate, { data, loading, error }) => {
            //                     return (
            //                         <form onSubmit={(e) => {
            //                             e.preventDefault();
            //                         }} className="add_animation_form">
            //                             <input type="text" placeholder="Title" className="sign_input" onChange={(e) => { this.setState({ title: e.target.value }) }} value={title} />
            //                             <br /><br />
            //                             <div className="admin_json_input">
            //                                 <div>
            //                                     <input type="file" name="file" id="file" className="inputfile" onChange={(e) => { this.setState({ file: e.target.files[0] }) }} />
            //                                     <label htmlFor="file"><i className="fas fa-video"></i> JSON File</label>
            //                                 </div>
            //                                 <div>
            //                                     {file != undefined && file != '' ? file.name.split('.')[0].slice(0, 13) + '..' + file.name.split('.')[1] : ''}
            //                                 </div>
            //                             </div>
            //                             <br /><br />
            //                             <button className="auth_btn" onClick={() => {
            //                                 mutate();
            //                                 setTimeout(() => {
            //                                     this.setState({
            //                                         uploaded: true
            //                                     });
            //                                     reload();
            //                                 }, 650)
            //                             }}>Send</button>
            //                             <br /><br />
            //                             {uploaded == true ? <div className="log-in">Animation successfully uploaded</div> : ''}
            //                         </form>
            //                     );
            //                 }}
            //             </Mutation>
            //         </div>
            //          */}
