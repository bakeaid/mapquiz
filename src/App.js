import React, { useState } from 'react';
import QuizMap from './components/quizmap';
import NewMap from './components/newmap';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [pokazQuizMap, setPokazQuizMap] = useState(false);

  return (
    <div style={{ marginLeft : 10, }}>
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
<Analytics />
    </div>
  );
}

export default App;
