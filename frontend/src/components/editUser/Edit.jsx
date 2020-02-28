import React from "react"

import {
    Card,
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
import { User, Info } from "react-feather"
import AccountTab from "./Account"
import AnimationTab from "./Animation"
import "../../assets/scss/pages/users.scss"
class Edit extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        activeTab: "1"
    }

    toggle = tab => {
        this.setState({
            activeTab: tab
        })
    }

    render() {
        let params = this.props.location.pathname.split('/')

        const nickname = params[params.length - 1];
        // console.log(nickname);
        return (
            <div style={{ margin: "20px" }}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody className="pt-2">
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: this.state.activeTab === "1"
                                            })}
                                            onClick={() => {
                                                this.toggle("1")
                                            }}
                                        >
                                            <User size={16} />
                                            <span className="align-middle ml-50">Account</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: this.state.activeTab === "2"
                                            })}
                                            onClick={() => {
                                                this.toggle("2")
                                            }}
                                        >
                                            <Info size={16} />
                                            <span className="align-middle ml-50">Animations</span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        <AccountTab nickname={nickname} />
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <AnimationTab nickname={nickname} />
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Edit
