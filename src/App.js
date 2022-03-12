import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import crossOrigin from "./pages/crossOrigin";
import { Auth0Context } from "./react-auth0-spa";
import history from "./utils/history";
import "./App.css";

class App extends Component {
  static contextType = Auth0Context;
  render() {
    const { loading } = this.context;
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="App">
        <Router history={history}>
          <Switch>
            <PrivateRoute path="/" exact component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/crossOrigin" component={crossOrigin} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
