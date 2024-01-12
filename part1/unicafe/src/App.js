import { useState } from "react";

const Statistics = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const App = () => {
  
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <button onClick={() => setGood(good + 1)}>good</button>
        <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
        <button onClick={() => setBad(bad + 1)}>bad</button>
      </div>
      <h1>statistics</h1>
      <div>
        {good || neutral || bad ? (
          <table>
            <tbody>
              <Statistics text="good" value={good} />
              <Statistics text="neutral" value={neutral} />
              <Statistics text="bad" value={bad} />
              <Statistics
                text="average"
                value={(good - bad) / (good + neutral + bad)}
              />
              <Statistics
                text="positive"
                value={(good / (good + neutral + bad)) * 100 + "%"}
              />
            </tbody>
          </table>
        ) : (
          <p>No Feedback Given</p>
        )}
      </div>
    </div>
  );
};

export default App;
