import React from 'react'
import Lottie from 'lottie-react-web';
import fileDownload from 'js-file-download';

import { Mutation, Query } from 'react-apollo';
import { DOWNLOAD_PROJECT } from "../schema.js";
import { Link, Redirect } from "react-router-dom";
import { getUser, isEquivalent } from "../lib";
import { GET_USER_LIGHT } from "../schema";
import { SERVER_URL } from '../graphql';

import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Row,
    Col,
    Input,
    Form,
    Button,
    Label
} from "reactstrap"

export default class Animation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isStopped: false,
            isPaused: false,
            json: '',
            active: 'x',
            text: '',
            downloaded: false
        };

        this.layers = [];
    }

    componentDidMount() {
        let jsn = JSON.parse(this.props.location.state.json);

        let user = getUser();

        if (jsn.length == 0) {
            fetch(`${SERVER_URL}/json/` + this.props.match.params.animation + '.json')
                .then(response => response.json())
                .then((jsonData) => {
                    this.setState({
                        json: jsonData
                    });

                    this.state.json['layers'].forEach((layer, id) => {
                        if (layer['t'] != undefined && layer['nm'].match('#') == null) {
                            this.layers.unshift({
                                num: id,
                                text: layer
                            })
                        }

                        if (id + 1 == this.state.json['layers'].length) {
                            this.forceUpdate();
                        }
                    });
                })
        } else {
            fetch(`${SERVER_URL}/json/` + this.props.match.params.animation + '.json')
                .then((jsonData) => {
                    this.setState({
                        json: jsn
                    });

                    this.state.json['layers'].forEach((layer, id) => {
                        if (layer['t'] != undefined && layer['nm'].match('#') == null) {
                            this.layers.unshift({
                                num: id,
                                text: layer
                            })
                        }

                        if (id + 1 == this.state.json['layers'].length) {
                            this.forceUpdate();
                        }
                    });
                });
        }
    }

    render() {
        const { active, text, json, downloaded } = this.state;

        let user = getUser();
        console.log(user)

        return (
            <Row>
                {user == '' ? <Redirect to="/" /> : ''}
                <Col lg="6" sm="12" onClick={() => {
                    this.setState({ isPaused: !this.state.isPaused })
                }}>
                    <Lottie options={{
                        loop: true,
                        autoplay: true,
                        animationData: json
                    }}
                        height={`auto`}
                        width={`auto`}
                        isStopped={this.state.isStopped}
                        isPaused={this.state.isPaused} />
                </Col>
                <Col lg="6" sm="12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Animations</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Form className="mt-2">
                                <Row>
                                    {this.layers.map(la => {
                                        return (
                                            <Col sm="12">
                                                <FormGroup className="form-label-group">
                                                    <Input type="text" placeholder={la.text.t.d.k[0].s.t} onClick={() => {
                                                        this.setState({
                                                            active: la.num
                                                        })
                                                    }} onChange={(e) => {
                                                        json['layers'][active].t.d.k[0].s.t = e.target.value;
                                                        this.setState({
                                                            json: json
                                                        });
                                                    }} />
                                                </FormGroup>
                                            </Col>
                                        );
                                    })}
                                    <Col sm="12">
                                        <FormGroup className="form-label-group">
                                            <Button.Ripple
                                                outline
                                                color="primary"
                                                type="submit"
                                                className="mr-1 mb-1"
                                                onClick={e => e.preventDefault()}
                                            >
                                                <Link to={{ pathname: `${`/anim/${this.props.match.params.animation}`}`, state: { json: (json != '' ? JSON.stringify(json) : '[]') } }}>Update</Link>
                                            </Button.Ripple>
                                            <Mutation
                                                mutation={DOWNLOAD_PROJECT}
                                                variables={{ json: new Blob([JSON.stringify(this.state.json)], { type: "application/json" }) }}>
                                                {(mutate, { data, loading, error }) => {
                                                    if (loading) return <div className="spinning-loader"></div>;

                                                    if (data != undefined && downloaded) {
                                                        if (data.downloadProject != null) {
                                                            var file = this.dataURLtoFile('data:video/mp4;base64,' + data.downloadProject, this.props.match.params.animation + ".mp4");
                                                            fileDownload(file, this.props.match.params.animation + '.mp4');

                                                            this.setState({
                                                                downloaded: false
                                                            });
                                                        }
                                                    }

                                                    return user != '' ? (
                                                        <Query
                                                            query={GET_USER_LIGHT}
                                                            variables={{ nickname: user }}>
                                                            {({ data, loading, error }) => {
                                                                if (loading) return <div></div>;
                                                                if (error) return <div></div>;

                                                                var isEmpty = isEquivalent({}, data.getUser);

                                                                return !isEmpty ? (data.getUser.type == 'DS' ? (
                                                                    <Button.Ripple
                                                                        outline
                                                                        color="warning"
                                                                        type="reset"
                                                                        className="mb-1"
                                                                        onClick={() => {
                                                                            mutate();
                                                                            this.setState({
                                                                                downloaded: true
                                                                            });
                                                                        }}>Download as video
                                                                    </Button.Ripple>
                                                                ) : (
                                                                        <Button.Ripple
                                                                            outline
                                                                            color="warning"
                                                                            type="reset"
                                                                            className="mb-1"
                                                                            onClick={() => {
                                                                                mutate();
                                                                                this.setState({
                                                                                    downloaded: true
                                                                                });
                                                                            }}>Download
                                                                        </Button.Ripple>
                                                                    )) : ''
                                                            }}
                                                        </Query>
                                                    ) : ''
                                                }}
                                            </Mutation>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }

    downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    convertBase64ToFile(video) {
        const byteString = atob(video.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }
        const newBlob = new Blob([ab], {
            type: 'video/mp4',
        });
        return newBlob;
    };

    dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }
}
