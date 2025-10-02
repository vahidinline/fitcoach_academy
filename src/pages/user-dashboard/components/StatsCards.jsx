import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import api from 'api/api';

const StatsCards = () => {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState({});
  const [status, setStatus] = useState('idle');
  const [docExists, setDocExists] = useState(false);

  console.log('userData in state', userData, docExists);

  const fetchDoc = async (id) => {
    if (!id) return;
    setStatus('loading');
    try {
      const res = await api.get(`/ShapeUpAssessment/${id}`);
      console.log('fetchDoc res', res);

      if (res.data?.data) {
        setUserData(res.data.data);
        setDocExists(true);
      } else {
        setDocExists(false);
      }
      setStatus('loaded');
    } catch (err) {
      console.error('fetchDoc error', err);
      setDocExists(false);
      setStatus('idle');
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
    if (storedUser?.id) {
      setUserId(storedUser.id);
      fetchDoc(storedUser.id);
    }
  }, []);

  const getDaysSince = (dateString) => {
    if (!dateString) return '-';
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now - created;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)); // convert ms → days
  };

  const statsData = [
    {
      id: 'initWeight',
      title: 'وزن اولیه',
      value: userData?.weight ? `${userData.weight} کیلوگرم` : '-',
      // value: `${userData.weight} کیلوگرم`,
      icon: 'weight',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'daysOfDiet',
      title: 'شروع دوره',
      value: userData?.createdAt
        ? `${getDaysSince(userData.createdAt)} روز`
        : '-',
      icon: 'Flame',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      id: 'GoalWeight',
      title: 'قد',
      value: userData?.height ? `${userData.height} سانتی متر` : '-',
      //value: `${userData ? userData.height : '-'} سانتی متر`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      id: 'milestone',
      title: 'هدف ',
      value: userData?.reason ? `${userData.reason}  ` : '-',
      // value: `${userData.reason}`,
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
