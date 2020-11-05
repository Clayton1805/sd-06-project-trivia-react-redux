import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Gamepage from './pages/Gamepage';

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/gamepage" component={ Gamepage } />
        <Route exact path="/" component={ Login } />
      </Switch>
    </div>
  );
}
