import React from 'react';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Survey Sparrow Calendar</h1>
      </header>
      <main>
        <Calendar />
      </main>
    </div>
  );
}

export default App;