import {render} from 'react-dom';
import React from 'react';
import './index.css';
import App from './App';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

//ReactDOM.render(<App />, document.getElementById('root'));

// optional cofiguration
const options = {
    position: 'top center',
    timeout: 8000,
    offset: '100px',
    transition: 'scale'
  }
  
  const Root = () => (
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  )
  
  render(<Root />, document.getElementById('root'))

