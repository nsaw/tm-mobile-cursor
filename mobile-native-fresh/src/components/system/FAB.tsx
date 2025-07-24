import React from 'react';
import { FloatingActionButton as _FAB } from '../ui/FloatingActionButton';
import SafeComponentZone from './SafeComponentZone';

export default function FAB() {
  return <SafeComponentZone><_FAB /></SafeComponentZone>;
} 