import React from 'react';
import { View } from 'react-native';

import { slotSelector } from '../lib/slotSelector';
import { slotQuery } from '../lib/slotQuery';

import { ThoughtmarkCard } from './ThoughtmarkCard';
import { TaskCard } from './TaskCard';
import { AIToolsCard } from './AIToolsCard';

export const SlotGrid = () => {
  const slotTypes = ['DASHBOARD_ENTRY', 'TASKS_ENTRY', 'AI_TOOLS_ENTRY'];
  
  const renderSlot = (slotType: string) => {
    const componentName = slotSelector(slotType);
    slotQuery(slotType); // Call for logging purposes
    
    switch (componentName) {
      case 'ThoughtmarkCard':
        return <ThoughtmarkCard slotType={slotType} />;
      case 'TaskCard':
        return <TaskCard slotType={slotType} />;
      case 'AIToolsCard':
        return <AIToolsCard slotType={slotType} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ gap: 16 }}>
      {slotTypes.map((slotType, index) => (
        <React.Fragment key={index}>
          {renderSlot(slotType)}
        </React.Fragment>
      ))}
    </View>
  );
}; 