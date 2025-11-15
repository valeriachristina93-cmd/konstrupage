
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PostPageConfig } from '@/lib/definitions';

interface LinkDisclaimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  postPages: PostPageConfig[];
  onApplyLink: (data: {
    linkType: 'url' | 'post';
    url: string;
    postIndex: number | null;
    newTab: boolean;
  }) => void;
}

export function LinkDisclaimerDialog({ isOpen, onClose, selectedText, postPages, onApplyLink }: LinkDisclaimerDialogProps) {
  const [linkType, setLinkType] = useState<'url' | 'post'>('url');
  const [url, setUrl] = useState('');
  const [postIndex, setPostIndex] = useState<number | null>(null);
  const [newTab, setNewTab] = useState(false);

  const handleApply = () => {
    onApplyLink({ linkType, url, postIndex, newTab });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lincar Texto: "{selectedText}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Link</Label>
            <Select value={linkType} onValueChange={(value) => setLinkType(value as 'url' | 'post')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url">URL Externa</SelectItem>
                <SelectItem value="post">Página de Post Interna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {linkType === 'url' ? (
            <div className="space-y-2">
              <Label htmlFor="url-input">URL Externa</Label>
              <Input id="url-input" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Página de Post</Label>
              <Select value={postIndex !== null ? String(postIndex) : ''} onValueChange={(value) => setPostIndex(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um post..." />
                </SelectTrigger>
                <SelectContent>
                  {postPages.map((post, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {post.productName || `Post ${index + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch id="new-tab-switch" checked={newTab} onCheckedChange={setNewTab} />
            <Label htmlFor="new-tab-switch">Abrir em nova guia</Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleApply}>Aplicar Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

