import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CalorieTrackingSection = ({ screenshots, onScreenshotsChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const categoryOptions = [
    { value: 'daily_summary', label: 'Daily Summary' },
    { value: 'meal_log', label: 'Meal Log' },
    { value: 'nutrition_breakdown', label: 'Nutrition Breakdown' },
    { value: 'weekly_report', label: 'Weekly Report' },
    { value: 'exercise_log', label: 'Exercise Log' },
    { value: 'other', label: 'Other' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newScreenshot = {
          id: Date.now() + index,
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
          category: 'daily_summary',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        };

        onScreenshotsChange([...screenshots, newScreenshot]);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateScreenshot = (id, field, value) => {
    onScreenshotsChange(screenshots.map(screenshot => 
      screenshot.id === id 
        ? { ...screenshot, [field]: value }
        : screenshot
    ));
  };

  const removeScreenshot = (id) => {
    onScreenshotsChange(screenshots.filter(screenshot => screenshot.id !== id));
  };

  const detectDateFromImage = (screenshot) => {
    // Simulate automatic date detection
    const today = new Date();
    const detectedDate = new Date(today.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    updateScreenshot(screenshot.id, 'date', detectedDate.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Calorie Tracking Screenshots</h3>
        <p className="text-sm text-muted-foreground">
          Upload screenshots from your calorie counting app to track your nutrition progress
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary hover:bg-primary/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Smartphone" size={24} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop app screenshots here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG up to 10MB • Automatic date detection available
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            iconPosition="left"
          >
            Choose Screenshots
          </Button>
        </div>
      </div>

      {/* Screenshot List */}
      {screenshots.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">
            Uploaded Screenshots ({screenshots.length})
          </h4>
          
          {screenshots.map((screenshot) => (
            <div key={screenshot.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Screenshot Preview */}
                <div className="lg:w-48 aspect-[9/16] lg:aspect-auto relative bg-muted">
                  <Image
                    src={screenshot.preview}
                    alt={screenshot.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeScreenshot(screenshot.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center animate-spring"
                  >
                    <Icon name="Trash2" size={14} className="text-white" />
                  </button>
                </div>

                {/* Screenshot Details */}
                <div className="flex-1 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {screenshot.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(screenshot.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => detectDateFromImage(screenshot)}
                      iconName="Calendar"
                      iconPosition="left"
                    >
                      Auto-detect Date
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Category"
                      options={categoryOptions}
                      value={screenshot.category}
                      onChange={(value) => updateScreenshot(screenshot.id, 'category', value)}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={screenshot.date}
                        onChange={(e) => updateScreenshot(screenshot.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={screenshot.notes}
                      onChange={(e) => updateScreenshot(screenshot.id, 'notes', e.target.value)}
                      placeholder="Add any notes about this screenshot..."
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-accent mb-2">Screenshot Tips</h4>
            <ul className="text-xs text-accent/80 space-y-1">
              <li>• Include daily summaries showing total calories and macros</li>
              <li>• Capture meal logs with timestamps for better tracking</li>
              <li>• Screenshot nutrition breakdowns to show protein, carbs, and fats</li>
              <li>• Include exercise logs if your app tracks burned calories</li>
              <li>• Weekly reports help coaches see your consistency patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieTrackingSection;