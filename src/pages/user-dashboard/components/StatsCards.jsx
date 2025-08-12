import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCards = ({ stats }) => {
  const statsData = [
    {
      id: 'initWeight',
      title: 'وزن اولیه',
      value: `${stats.initWeight} کیلوگرم`,
      icon: 'weight',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'daysOfDiet',
      title: 'شروع دوره',
      value: `${stats.daysOfDiet} روز`,
      icon: 'Flame',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      id: 'GoalWeight',
      title: 'وزن هدف',
      value: `${stats.goalWeight} کیلوگرم`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      id: 'milestone',
      title: 'هدف بعدی',
      value: `${stats.nextMilestone} `,
      icon: 'Target',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className="bg-card rounded-lg p-4 border border-border shadow-elevation-1">
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
