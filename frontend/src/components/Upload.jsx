import React from 'react';

import { Mutation } from 'react-apollo';

import { ADD_PROJECT } from "../schema.js";

export default class Upload extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            file: ''
        }
    }

    render() {
        var { title, file } = this.state;

        return (
            <div className="container center">
                <div className="upload-cont">
                    <h1>Upload:</h1>

                        <Mutation mutation={ADD_PROJECT} variables={{ title: title, file: file, date: new Date() }}>
                            {(mutate, { data, loading, error }) => {
                                return (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();

                                        mutate();
                                    }}>
                                        <input type="text" placeholder="Title" onChange={(e) => { this.setState({ title: e.target.value }) }} value={title}/>
                                        <br/><br/>
                                        <input type="file" name="file" id="file" className="inputfile" onChange={(e) => { console.log(e.target.files[0]); this.setState({ file: e.target.files[0] }) }}/>
                                        <label htmlFor="file"><i className="fas fa-video"></i> JSON File</label>
                                        <br/><br/>
                                        <button className="btn_send">Send</button>
                                    </form>
                                );
                            }}
                        </Mutation>
                </div>
            </div>
        );
    };
}
