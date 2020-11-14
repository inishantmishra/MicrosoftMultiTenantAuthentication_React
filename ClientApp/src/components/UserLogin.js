import React, { Component } from 'react';
import { msalConfig } from '../msal/MsalConfig';
import { UserAgentApplication } from 'msal'; //it will be installed from npm
import axios from 'axios';
import {
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

export const msalAuth = new UserAgentApplication({
    auth: msalConfig
});

export const axiosInstance = {
    apiUrl: 'https://localhost:44352/api/auth/GetToken'
};

export class UserLogin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            user: {},
            renewIframe: false,
            hasError: false,
            errorMessage: null
        };
    }

    async componentWillMount() {
        msalAuth.handleRedirectCallback(() => {
            let userAccount = msalAuth.getAccount();
            console.log(userAccount);
            this.setState({
                isAuthenticated: true,
                user: userAccount
            });

        }, (authErr, accountState) => {  // on fail
            console.log(authErr);

            this.setState({
                hasError: true,
                errorMessage: authErr.errorMessage
            });
                alert(this.authErr.errorMessage);
        });

        if (msalAuth.isCallback(window.location.hash)) {
            this.setState({
                auth: {
                    renewIframe: true
                }
            });
            return;
        }

        let userAccount = msalAuth.getAccount();
        if (userAccount) {
                this.setState({
                isAuthenticated: true,
                user: userAccount
            });
        }
    }

    async componentDidMount() {

       
        const idToken = sessionStorage.getItem("msal.idtoken");
        
        if (idToken != null) {
            axios.post(axiosInstance.apiUrl,null, {
                headers: {
                    'Authorization': idToken
                }
            })
                .then((res) => {
                    sessionStorage.setItem("access_token", res.data);
                    console.log(res.data)
                })
                .catch((error) => {
                    console.error(error)
                });
        }

    }
       

    onSignIn() {
        msalAuth.loginRedirect({});
    }

    onSignOut() {
        msalAuth.logout();
    }

    render() {
        console.log(this.state.user);
        if (this.state.isAuthenticated) {
            return (
                <UncontrolledDropdown>
                    <DropdownToggle nav caret>
                        {this.state.user.name}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <h5 className="dropdown-item-text mb-0">{this.state.user.name}</h5>
                        <p className="dropdown-item-text text-muted mb-0">{this.state.user.userName}</p>
                        <DropdownItem divider />
                        <DropdownItem onClick={this.onSignOut}>Sign Out</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            );
        }
        else {
            return (<NavItem>
                <NavLink onClick={this.onSignIn} href='#'>Sign in</NavLink>
            </NavItem>);
        }
    }
}
