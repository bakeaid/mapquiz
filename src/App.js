import React, { useState } from 'react';
import QuizMap from './components/quizmap';
import NewMap from './components/newmap';

function App() {
  const [pokazQuizMap, setPokazQuizMap] = useState(false);

  return (
    <div style={{ margin-left: "1em" }}>
      <header className="MAP-QUIZ">
        <label>
          <input
            type="checkbox"
            checked={pokazQuizMap}
            onChange={() => setPokazQuizMap(!pokazQuizMap)}
          />
          Pokaż Wszystkie
        </label>
      </header>
      {pokazQuizMap ? <NewMap /> : <QuizMap />}
    </div>
  );
}

export default App;
