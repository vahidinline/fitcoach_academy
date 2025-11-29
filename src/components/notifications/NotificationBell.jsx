import React, { useState, useEffect, useRef } from 'react';
import { getNotifications } from 'api/notification';
import { Bell } from 'lucide-react';

const NotificationBell = ({ userId }) => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const res = await getNotifications(userId);
        setList(res.data.notifications || []);
      } catch (err) {
        console.error('notification error:', err);
      }
    };

    load();
  }, [userId]);

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell Icon */}
      <button className="relative" onClick={() => setOpen((o) => !o)}>
        <Bell className="w-7 h-7 text-gray-800" />
        {list.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {list.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-3 w-72 bg-white shadow-lg rounded-xl border border-gray-100 p-3 z-50">
          {list.length === 0 ? (
            <p className="text-gray-500 text-sm">نوتیفی موجود نیست.</p>
          ) : (
            list.map((n) => (
              <div
                key={n._id}
                className="p-3 border-b last:border-none cursor-pointer hover:bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-800">{n.text}</p>
                <span className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
