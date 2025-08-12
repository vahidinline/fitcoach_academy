import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressNotesSection = ({ notes, onNotesChange }) => {
  const noteFields = [
    {
      key: 'achievements',
      label: 'Achievements & Milestones',
      placeholder: `Share your wins this week! Examples:\n• Completed all planned workouts\n• Hit a new personal record\n• Improved sleep quality\n• Stuck to nutrition plan for 6/7 days`,
      icon: 'Trophy',
      rows: 4
    },
    {
      key: 'challenges',
      label: 'Challenges & Obstacles',
      placeholder: `What difficulties did you face? Examples:\n• Struggled with late-night cravings\n• Missed workouts due to work schedule\n• Felt low energy during training\n• Had trouble with meal prep`,
      icon: 'AlertTriangle',
      rows: 4
    },
    {
      key: 'feelings',
      label: 'How You Feel',
      placeholder: `Describe your physical and mental state:\n• Energy levels throughout the day\n• Mood and motivation changes\n• Physical sensations (soreness, strength, etc.)\n• Confidence and body image thoughts`,
      icon: 'Heart',
      rows: 4
    },
    {
      key: 'questions',
      label: 'Questions for Your Coach',
      placeholder: `What would you like guidance on? Examples:\n• Should I increase workout intensity?\n• How can I improve my meal timing?\n• What exercises can help with my weak points?\n• How do I stay motivated on difficult days?`,
      icon: 'HelpCircle',
      rows: 4
    }
  ];

  const handleNoteChange = (key, value) => {
    onNotesChange({
      ...notes,
      [key]: value
    });
  };

  const getWordCount = (text) => {
    return text ? text.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Progress Notes</h3>
        <p className="text-sm text-muted-foreground">
          Share detailed insights about your journey to help your coach provide better guidance
        </p>
      </div>

      <div className="space-y-6">
        {noteFields.map((field) => (
          <div key={field.key} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name={field.icon} size={20} className="text-primary" />
              <label className="text-sm font-medium text-foreground">
                {field.label}
              </label>
              <span className="text-xs text-muted-foreground">
                ({getWordCount(notes[field.key] || '')} words)
              </span>
            </div>
            
            <textarea
              value={notes[field.key] || ''}
              onChange={(e) => handleNoteChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows}
              className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            
            {/* Character/Word Guidelines */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {field.key === 'questions' ? 'Be specific with your questions' : 'Be honest and detailed'}
              </span>
              <span className={`${
                getWordCount(notes[field.key] || '') < 10 
                  ? 'text-warning' 
                  : getWordCount(notes[field.key] || '') > 200 
                  ? 'text-accent' :'text-success'
              }`}>
                {getWordCount(notes[field.key] || '') < 10 
                  ? 'Add more detail' 
                  : getWordCount(notes[field.key] || '') > 200 
                  ? 'Very detailed!' :'Good detail level'
                }
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h4 className="text-sm font-medium text-foreground">Weekly Summary</h4>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Achievements</p>
            <p className="text-sm font-medium text-foreground">
              {getWordCount(notes.achievements || '')} words
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Challenges</p>
            <p className="text-sm font-medium text-foreground">
              {getWordCount(notes.challenges || '')} words
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Feelings</p>
            <p className="text-sm font-medium text-foreground">
              {getWordCount(notes.feelings || '')} words
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Questions</p>
            <p className="text-sm font-medium text-foreground">
              {getWordCount(notes.questions || '')} words
            </p>
          </div>
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="PenTool" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">Writing Tips</h4>
            <ul className="text-xs text-primary/80 space-y-1">
              <li>• Be specific with examples rather than general statements</li>
              <li>• Include both physical and mental aspects of your journey</li>
              <li>• Mention specific days or situations when relevant</li>
              <li>• Ask actionable questions that help your coach guide you better</li>
              <li>• Don't worry about perfect grammar - focus on clear communication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressNotesSection;