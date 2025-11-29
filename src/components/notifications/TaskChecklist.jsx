import React, { useEffect, useState } from 'react';
import { getNotifications } from 'api/notification';

const TaskChecklist = ({ userId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const res = await getNotifications(userId);
      setTasks(res.data.notifications || []);
    };

    load();
  }, [userId]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-4">
      <h3 className="text-lg font-bold mb-3">کارهای ضروری شما</h3>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm">کار ضروری ندارید.</p>
      ) : (
        tasks.map((t) => (
          <div
            key={t._id}
            className="flex items-center gap-3 p-2 border-b last:border-none">
            <input type="checkbox" className="w-4 h-4" />
            <span>{t.text}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskChecklist;
