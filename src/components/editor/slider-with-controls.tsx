
"use client";

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface SliderWithControlsProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
}

export function SliderWithControls({ value, onValueChange, min, max, step }: SliderWithControlsProps) {
  const currentValue = value[0] || 0;

  const handleIncrement = () => {
    const newValue = Math.min(currentValue + step, max);
    onValueChange([newValue]);
  };

  const handleDecrement = () => {
    const newValue = Math.max(currentValue - step, min);
    onValueChange([newValue]);
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" onClick={handleDecrement} disabled={currentValue <= min}>
        <Minus className="h-4 w-4" />
      </Button>
      <Slider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
      />
      <Button variant="outline" size="icon" onClick={handleIncrement} disabled={currentValue >= max}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
