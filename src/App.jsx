import { useEffect, useState } from "react";
import "./App.css";

function App() {
  let [quiz, setQuiz] = useState([]);
  let [index, setIndex] = useState(0);
  let [options, setOptions] = useState([]);
  let [selected, setSelected] = useState(null);
  let [score, setScore] = useState(0);
  let [finished, setFinished] = useState(false);

  const shuffleOption = (questionObj) => {
    let allOptions = [
      ...questionObj.incorrectAnswers,
      questionObj.correctAnswer,
    ];
    allOptions = allOptions.sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelected(null);
  };


  const getApiData = () => {
    fetch("https://the-trivia-api.com/v2/questions")
      .then((data) => data.json())
      .then((value) => {
        if (value.length > 0) {
          shuffleOption(value[0]);
        }
        setQuiz(value);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getApiData();
  }, []);

  if (!quiz.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="https://static.wixstatic.com/media/68315b_30dbad1140034a3da3c59278654e1655~mv2.gif"
          alt="loading"
          className="w-20"
        />
      </div>
    );
  }


  const handleSelect = (opt) => {
    setSelected(opt);
    if (opt === quiz[index].correctAnswer) {
      setScore(score + 1); 
    }
  };


  const nextQues = () => {
    if (index < quiz.length - 1) {
      let newIndex = index + 1;
      setIndex(newIndex);
      shuffleOption(quiz[newIndex]);
    } else {
      setFinished(true); 
    }
  };


  const restartQuiz = () => {
    setIndex(0);
    setScore(0);
    setFinished(false);
    shuffleOption(quiz[0]);
  };

  const currentQues = quiz[index];


  if (finished) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl text-center">
          <h1 className="text-2xl font-bold text-indigo-600 mb-4">🎉 Quiz Finished!</h1>
          <p className="text-lg font-medium text-gray-700 mb-6">
            Your Score: <span className="text-indigo-600">{score}</span> / {quiz.length}
          </p>
          <button
            onClick={restartQuiz}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  // ✅ Quiz UI
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Quiz App
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Question {index + 1} of {quiz.length}
        </p>
        <hr className="my-4" />

        <p className="text-lg font-medium text-gray-800 mb-6">
          {currentQues.question.text}
        </p>

        <div className="space-y-3">
          {options.map((opt, i) => {
            let btnStyle =
              "w-full px-4 py-2 rounded-lg border transition font-medium ";

            if (selected) {
              if (opt === currentQues.correctAnswer) {
                btnStyle += "bg-green-500 text-white";
              } else if (opt === selected) {
                btnStyle += "bg-red-500 text-white";
              } else {
                btnStyle += "bg-gray-100 text-gray-700";
              }
            } else {
              btnStyle +=
                "bg-gray-50 hover:bg-indigo-100 border-indigo-200 text-gray-700";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
                className={btnStyle}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={nextQues}
            disabled={!selected}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {index === quiz.length - 1 ? "Finish" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
