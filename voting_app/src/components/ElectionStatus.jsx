import React, { useState, useEffect } from 'react';

const ElectionStatus = ({ election, showControls = false, onStatusChange, onStartVoting }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');

  useEffect(() => {
    if (!election) return;

    const updateTimeAndStatus = () => {
      const now = new Date();
      const startTime = new Date(election.votingStartTime);
      const endTime = new Date(election.votingEndTime);

      // Update status based on current time
      let status = election.status;
      if (now < startTime && status === 'scheduled') {
        status = 'scheduled';
      } else if (now >= startTime && now <= endTime && status !== 'completed') {
        status = 'active';
      } else if (now > endTime) {
        status = 'completed';
      }

      setCurrentStatus(status);

      // Calculate time remaining
      let timeString = '';
      if (status === 'scheduled') {
        const timeToStart = startTime - now;
        if (timeToStart > 0) {
          const hours = Math.floor(timeToStart / (1000 * 60 * 60));
          const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
          timeString = `Starts in: ${hours}h ${minutes}m`;
        }
      } else if (status === 'active') {
        const timeToEnd = endTime - now;
        if (timeToEnd > 0) {
          const hours = Math.floor(timeToEnd / (1000 * 60 * 60));
          const minutes = Math.floor((timeToEnd % (1000 * 60 * 60)) / (1000 * 60));
          timeString = `${hours}h ${minutes}m left`;
        } else {
          timeString = 'Voting ended';
        }
      } else if (status === 'completed') {
        timeString = 'Voting completed';
      }

      setTimeLeft(timeString);
    };

    updateTimeAndStatus();
    const interval = setInterval(updateTimeAndStatus, 1000); // Update every second

    return () => clearInterval(interval);
  }, [election]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#f59e0b'; // Orange
      case 'active': return '#10b981'; // Green
      case 'completed': return '#6b7280'; // Gray
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'active': return 'Voting Active';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  if (!election) return null;

  return (
    <div className="election-status">
      <div className="election-status__info">
        <span 
          className="election-status__badge"
          style={{ backgroundColor: getStatusColor(currentStatus), color: 'white' }}
        >
          {getStatusText(currentStatus)}
        </span>
        {timeLeft && <span className="election-status__time">{timeLeft}</span>}
      </div>
      
      <div className="election-status__details">
        <small>
          Voting: {new Date(election.votingStartTime).toLocaleString()} - {new Date(election.votingEndTime).toLocaleString()}
        </small>
      </div>

      {showControls && (
        <div className="election-status__controls">
          {currentStatus === 'scheduled' && (
            <button 
              className="btn sm primary" 
              onClick={() => onStartVoting && onStartVoting(election._id)}
            >
              Start Voting Now
            </button>
          )}
          <select 
            value={currentStatus} 
            onChange={(e) => onStatusChange && onStatusChange(election._id, e.target.value)}
            className="status-select"
          >
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ElectionStatus;
