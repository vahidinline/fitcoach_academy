import React from 'react';

function QuizSection({ index, q, handleAnswerChange, answers }) {
  return (
    <div key={index} className="mb-6 mt-20">
      <p className="font-medium text-gray-800 mb-2">
        {index + 1}. {q.question}
      </p>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-center space-x-2 border rounded-lg p-2 gap-2 cursor-pointer transition ${
              answers[index] === i
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
            <input
              type="radio"
              name={`question-${index}`}
              value={i}
              checked={answers[index] === i}
              onChange={() => handleAnswerChange(index, i)}
              className="accent-blue-500 "
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuizSection;
