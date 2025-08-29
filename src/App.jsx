import { useEffect, useState } from "react";
import "./App.css";

function App() {
  let [quiz, setQuiz] = useState([]);
  let [index, setIndex] = useState(0);
  let [options, setOptions] = useState([]);
  let [selected, setSelected] = useState(null);

  // ✅ shuffle function pehle define kiya
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
          shuffleOption(value[0]); // ✅ ab error nahi aayega
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
  };

  const nextQues = () => {
    if (index < quiz.length - 1) {
      let newIndex = index + 1;
      setIndex(newIndex);
      shuffleOption(quiz[newIndex]);
    } else {
      alert("🎉 Quiz Finished!");
    }
  };

  const currentQues = quiz[index];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Quiz App
        </h1>
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
