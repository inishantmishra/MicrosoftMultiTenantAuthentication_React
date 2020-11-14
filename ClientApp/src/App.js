import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import './custom.css'

class RootApp extends Component {
    render() {
        return (
            <Layout {...this.props} >
                <Route exact path='/' component={Home} />
            </Layout>
        );
    }
}
export const App = (RootApp);
