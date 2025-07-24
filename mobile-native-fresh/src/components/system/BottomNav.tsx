import React from 'react';
import { BottomNav as _BottomNav } from '../ui/BottomNav';
import SafeComponentZone from './SafeComponentZone';

export default function BottomNav() {
  return <SafeComponentZone><_BottomNav /></SafeComponentZone>;
} 