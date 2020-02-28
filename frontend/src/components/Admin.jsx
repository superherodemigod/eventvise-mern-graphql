import React from 'react';

import { Mutation, Query } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';
import { GET_USERS, GET_USER_MEDIUM, ADD_TAG, REMOVE_USER, REMOVE_USER_ANIMATION, ADD_PROJECT } from "../schema.js";
import { reload } from "../lib";
import { client } from '../graphql'

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    UncontrolledDropdown,
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Collapse,
    Spinner
} from "reactstrap"
import axios from "axios"
import { ContextLayout } from "../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
    Edit,
    Trash2,
    ChevronDown,
    Clipboard,
    Printer,
    Download,
    RotateCw,
    X
} from "react-feather"
import classnames from "classnames"
import { history } from "../history"
import "../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../assets/scss/pages/users.scss"

export default class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            title: '',
            file: '',
            uploaded: '',
            rowData: null,
            pageSize: 20,
            isVisible: true,
            reload: false,
            collapse: true,
            status: "Opened",
            role: "All",
            selectStatus: "All",
            verified: "All",
            department: "All",
            defaultColDef: {
                sortable: true
            },
            searchVal: "",
            columnDefs: [
                {
                    headerName: "Username",
                    field: "username",
                    filter: true,
                    width: 400,
                    cellRendererFramework: params => {
                        return (
                            <div
                                className="d-flex align-items-center cursor-pointer"
                                onClick={() => {
                                    // history.push("/admin/" + params.data.nickname)
                                    window.location.href = "/admin/"+params.data.nickname;
                                    // reload()
                                }}
                            >
                                <span>{params.data.nickname}</span>
                            </div>
                        )
                    }
                },
                {
                    headerName: "Email",
                    field: "email",
                    filter: true,
                    width: 400
                },
                {
                    headerName: "Name",
                    field: "name",
                    filter: true,
                    width: 400,
                    cellRendererFramework: params => {
                        return (
                            <span>{params.data.nickname}</span>
                        )
                    }
                },
                {
                    headerName: "Role",
                    field: "tags",
                    filter: true,
                    width: 400
                },
                {
                    headerName: "Actions",
                    field: "transactions",
                    width: 200,
                    cellRendererFramework: params => {
                        return (
                            <div className="actions cursor-pointer">
                                <Edit
                                    className="mr-50"
                                    size={15}
                                    onClick={() => {
                                        history.push("/admin/" + params.data.nickname)
                                        reload()
                                    }}
                                />
                                <Trash2
                                    size={15}
                                    onClick={() => {
                                        let selectedData = this.gridApi.getSelectedRows()
                                        this.gridApi.updateRowData({ remove: selectedData })
                                    }}
                                />
                            </div>
                        )
                    }
                }
            ]
        }
    }



    componentDidMount() {
        client.query({
            query: GET_USERS
        })
            .then(({ data }) => {
                this.setState({ rowData: data.getUsers })
            })
            .catch(error => console.error(error));
    }

    onGridReady = params => {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
    }

    filterSize = val => {
        if (this.gridApi) {
            this.gridApi.paginationSetPageSize(Number(val))
            this.setState({
                pageSize: val
            })
        }
    }
    updateSearchQuery = val => {
        this.gridApi.setQuickFilter(val)
        this.setState({
            searchVal: val
        })
    }


    render() {
        let { title, file, user, uploaded } = this.state;
        const { rowData, columnDefs, defaultColDef, pageSize } = this.state
        return (
            <Row className="app-user-list" style={{ margin: "20px" }}>
                <Col sm="12">
                    <Card>
                        <CardBody>
                            <div className="ag-theme-material ag-grid-table">
                                <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                                    <div className="sort-dropdown">
                                        <UncontrolledDropdown className="ag-dropdown p-1">
                                            <DropdownToggle tag="div">
                                                1 - {this.state.pageSize} of 150
                                                 <ChevronDown className="ml-50" size={15} />
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem
                                                    tag="div"
                                                    onClick={() => this.filterSize(20)}
                                                >
                                                    20
                                                 </DropdownItem>
                                                <DropdownItem
                                                    tag="div"
                                                    onClick={() => this.filterSize(50)}
                                                >
                                                    50
                                                 </DropdownItem>
                                                <DropdownItem
                                                    tag="div"
                                                    onClick={() => this.filterSize(100)}
                                                >
                                                    100
                                                 </DropdownItem>
                                                <DropdownItem
                                                    tag="div"
                                                    onClick={() => this.filterSize(150)}
                                                >
                                                    150
                                                 </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                    <div className="filter-actions d-flex">
                                        <Input
                                            className="w-50 mr-1 mb-1 mb-sm-0"
                                            type="text"
                                            placeholder="search..."
                                            onChange={e => this.updateSearchQuery(e.target.value)}
                                            value={this.state.searchVal}
                                        />
                                        <div className="dropdown actions-dropdown">
                                            <UncontrolledButtonDropdown>
                                                <DropdownToggle className="px-2 py-75" color="white">
                                                    Actions
                                                     <ChevronDown className="ml-50" size={15} />
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    <DropdownItem tag="a">
                                                        <Trash2 size={15} />
                                                        <span className="align-middle ml-50">Delete</span>
                                                    </DropdownItem>
                                                    <DropdownItem tag="a">
                                                        <Clipboard size={15} />
                                                        <span className="align-middle ml-50">Archive</span>
                                                    </DropdownItem>
                                                    <DropdownItem tag="a">
                                                        <Printer size={15} />
                                                        <span className="align-middle ml-50">Print</span>
                                                    </DropdownItem>
                                                    <DropdownItem tag="a">
                                                        <Download size={15} />
                                                        <span className="align-middle ml-50">CSV</span>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                        </div>
                                    </div>
                                </div>
                                {rowData !== null ? (
                                    <ContextLayout.Consumer>
                                        {context => (
                                            <AgGridReact
                                                gridOptions={{}}
                                                rowSelection="multiple"
                                                defaultColDef={defaultColDef}
                                                columnDefs={columnDefs}
                                                rowData={rowData}
                                                onGridReady={this.onGridReady}
                                                colResizeDefault={"shift"}
                                                animateRows={true}
                                                floatingFilter={true}
                                                pagination={true}
                                                pivotPanelShow="always"
                                                paginationPageSize={pageSize}
                                                resizable={true}
                                            // enableRtl={context.state.direction === "rtl"}
                                            />
                                        )}
                                    </ContextLayout.Consumer>
                                ) : null}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            // <div className="admin_container">
            //     <div className="admin_panel">
            //         <div className="admin_users panel">
            //             <div className="panel_line"></div>
            //             <div className="admin_panel_title">Users</div>
            //             <div className="admin_panel_container">
            //                 <Query
            //                     query={GET_USERS}>
            //                     {({ data, loading, error }) => {
            //                         if (error) return <div></div>;
            //                         if (loading) return <div></div>;
            //                         return data.getUsers.map(user => (
            //                             <div className="admin_user">
            //                                 <div>
            //                                     <span className={`admin_user_nickname ${this.state.user == user.nickname ? 'admin_user_active' : ''}`} onClick={() => {
            //                                         this.setState({
            //                                             user: user.nickname
            //                                         })
            //                                     }}>{user.nickname}</span> {user.tags != 'User' ? <span className="mod">{user.tags}</span> : ''} -
            //                                     {user.email}
            //                                 </div>
            //                                 <div>
            //                                     <div className="admin_user_option">
            //                                         {user.tags == 'Mod' ? (
            //                                             <Mutation
            //                                                 mutation={ADD_TAG}
            //                                                 variables={{ nickname: user.nickname, tag: 'User' }}>
            //                                                 {(mutate, { loading, error }) => {
            //                                                     if (loading) return <div></div>;
            //                                                     if (error) return <div></div>;

            //                                                     return <div className="mod_option" onClick={() => {
            //                                                         mutate();
            //                                                         reload();
            //                                                     }}>Remove Mod</div>
            //                                                 }}
            //                                             </Mutation>
            //                                         ) : (
            //                                                 <Mutation
            //                                                     mutation={ADD_TAG}
            //                                                     variables={{ nickname: user.nickname, tag: 'Mod' }}>
            //                                                     {(mutate, { loading, error }) => {
            //                                                         if (loading) return <div></div>;
            //                                                         if (error) return <div></div>;

            //                                                         return <div className="mod_option" onClick={() => {
            //                                                             mutate();
            //                                                             reload();
            //                                                         }}>Add Mod</div>
            //                                                     }}
            //                                                 </Mutation>
            //                                             )}
            //                                         <Mutation
            //                                             mutation={REMOVE_USER}
            //                                             variables={{ nickname: user.nickname }}>
            //                                             {(mutate, { loading, error }) => {
            //                                                 if (loading) return <div></div>;
            //                                                 if (error) return <div></div>;

            //                                                 return <div className="admin_user_remove" onClick={() => {
            //                                                     mutate();
            //                                                     reload();
            //                                                 }}>
            //                                                     Remove
            //                                                 </div>
            //                                             }}
            //                                         </Mutation>
            //                                     </div>
            //                                 </div>
            //                             </div>
            //                         ))
            //                     }}
            //                 </Query>
            //             </div>
            //         </div>
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
            //         {/* <div className="admin_users panel">
            //             <div className="panel_line"></div>
            //             <div className="admin_panel_title">User Animation</div>
            //             <div className="admin_panel_container">
            //                 {user != '' ? (
            //                     <Query
            //                         query={GET_USER_MEDIUM}
            //                         variables={{ nickname: user }}>
            //                         {({ data, loading, error }) => {
            //                             if (error) return <div></div>;
            //                             if (loading) return <div></div>;

            //                             return data.getUser.projects.map(animation => (
            //                                 <div className="admin_user">
            //                                     <div>
            //                                         <span className={`admin_user_nickname`}>{animation.title}</span>
            //                                     </div>
            //                                     <div>
            //                                         <div className="admin_user_option">
            //                                             <Mutation
            //                                                 mutation={REMOVE_USER_ANIMATION}
            //                                                 variables={{ nickname: user, animation: animation.id }}>
            //                                                 {(mutate, { loading, error }) => {
            //                                                     if (loading) return <div></div>;
            //                                                     if (error) return <div></div>;

            //                                                     return <div className="admin_user_remove" onClick={() => {
            //                                                         mutate();
            //                                                         reload();
            //                                                     }}>
            //                                                         Remove
            //                                                     </div>
            //                                                 }}
            //                                             </Mutation>
            //                                         </div>
            //                                     </div>
            //                                 </div>
            //                             ))
            //                         }}
            //                     </Query>
            //                 ) : <div className="select_user_ask">Please, select user</div>}
            //             </div>
            //         </div>
            //      */}
            //     </div>

            // </div>

        );
    }
};

