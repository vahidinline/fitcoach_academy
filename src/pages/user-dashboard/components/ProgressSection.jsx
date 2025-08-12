import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProgressSection = ({ progressReports }) => {
  const navigate = useNavigate();

  const handleViewReport = (report) => {
    navigate('/progress-report-submission', {
      state: { viewMode: true, report },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reviewed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'needs_revision':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          فعالیت های اخیر
        </h3>
        <button
          onClick={() => navigate('/progress-report-submission')}
          className="text-sm text-primary hover:text-primary/80 animate-spring font-medium">
          مشاهده همه
        </button>
      </div>

      {progressReports.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No progress reports yet</p>
          <button
            onClick={() => navigate('/progress-report-submission')}
            className="text-primary hover:text-primary/80 animate-spring font-medium">
            اولین گزارش خود را ارسال کنید
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {progressReports.slice(0, 3).map((report) => (
            <div
              key={report.id}
              onClick={() => handleViewReport(report)}
              className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg hover:bg-muted animate-spring cursor-pointer">
              {/* Before/After Photos Preview */}
              <div className="flex space-x-2">
                {report.beforePhoto && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={report.beforePhoto}
                      alt="Before photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {report.afterPhoto && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={report.afterPhoto}
                      alt="After photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!report.beforePhoto && !report.afterPhoto && (
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Icon
                      name="Image"
                      size={16}
                      className="text-muted-foreground"
                    />
                  </div>
                )}
              </div>

              {/* Report Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-card-foreground text-sm truncate">
                    Progress Report #{report.id}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      report.status
                    )}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Submitted on {formatDate(report.submittedAt)}
                </p>
                {report.coachFeedback && (
                  <div className="flex items-center space-x-1">
                    <Icon
                      name="MessageCircle"
                      size={12}
                      className="text-primary"
                    />
                    <span className="text-xs text-primary">
                      Coach feedback available
                    </span>
                  </div>
                )}
              </div>

              <Icon
                name="ChevronRight"
                size={16}
                className="text-muted-foreground"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
