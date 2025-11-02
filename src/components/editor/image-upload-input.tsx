
"use client";

import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImageUploadInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileUpload: (file: File) => void;
}

export function ImageUploadInput({ onFileUpload, ...props }: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input type="text" {...props} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <Button variant="outline" size="icon" onClick={handleButtonClick} aria-label="Upload image">
        <Upload className="h-4 w-4" />
      </Button>
    </div>
  );
}
