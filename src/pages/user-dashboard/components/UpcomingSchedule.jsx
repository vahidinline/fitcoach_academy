import React from 'react';
import Icon from '../../../components/AppIcon';

const UpcomingSchedule = ({ schedule }) => {
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'workout':
        return 'text-primary bg-primary/10';
      case 'nutrition':
        return 'text-accent bg-accent/10';
      case 'check-in':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Today's Schedule</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
        </div>
      </div>

      {schedule.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Calendar" size={20} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No scheduled activities today</p>
          <p className="text-xs text-muted-foreground mt-1">Enjoy your rest day!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg ${getTypeColor(item.type)} flex items-center justify-center`}>
                  <Icon 
                    name={item.type === 'workout' ? 'Dumbbell' : item.type === 'nutrition' ? 'Apple' : 'CheckCircle'} 
                    size={16} 
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-card-foreground text-sm truncate">
                    {item.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(item.time)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>

              {item.completed && (
                <div className="flex-shrink-0">
                  <Icon name="Check" size={16} className="text-success" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingSchedule;