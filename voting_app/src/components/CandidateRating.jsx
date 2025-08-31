import React from "react";

const CandidateRating = ({ fullName, image, voteCount = 0, totalVotes = 0 }) => {
  // Calculate percentage safely
  const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100) : 0;
  
  return (
    <li className="result__candidate">
      <div className="result__candidate-image">
        <img src={image} alt={fullName} />
      </div>
      <div className="result__candidate-info">
          <div>
          <h5>{fullName}</h5>
          <small>{`${voteCount} ${voteCount === 1 ? "vote" : "votes"}`}</small>
          </div>
      <div className="result__candidate-rating">
        <div className="result__candidate-loader">
          <span
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage > 0 ? '#3b82f6' : '#e5e7eb',
              transition: 'width 0.3s ease-in-out'
            }}
          ></span>
        </div>
        <small>{`${percentage.toFixed(1)}%`}</small>
      </div>
      </div>
    </li>
  );
};

export default CandidateRating;
