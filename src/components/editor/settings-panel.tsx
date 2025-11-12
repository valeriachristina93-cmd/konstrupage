
"use client";

import React, { useState } from 'react';
import type { PageConfig, PostPageConfig } from '@/lib/definitions';
import { flagOptions, animationOptions, discountIconOptions, fontOptions } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, MessageSquare, LayoutPanelLeft, Settings2, Settings, Brush, Type, Palette, Target, Image as ImageIcon, Timer, X, AlertTriangle, Globe, HelpCircle, ChevronDown, MoveUpRight, Cookie, Plus, Trash2, Eye, Link as LinkIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageUploadInput } from './image-upload-input';
import type { ViewMode } from '@/app/(protected)/editor/page';
import { SliderWithControls } from './slider-with-controls';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';


interface SettingsPanelProps {
    pageConfig: PageConfig;
    onConfigChange: (keys: (string | number)[], value: any) => void;
    onImageUpload: (file: File, keys: (string | number)[]) => void;
    setViewMode: (mode: ViewMode) => void;
    addPostPage?: () => void;
    removePostPage?: (index: number) => void;
    onPreviewPost?: (index: number | null) => void;
}

const SettingsToggle = ({ label, checked, onCheckedChange, children }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void, children?: React.ReactNode }) => (
    <div className="flex items-center justify-between rounded-lg py-2">
        <div className="flex items-center gap-2">
            <Label className="font-normal">{label}</Label>
            {children}
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
);

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="flex items-center justify-between">
        <Label className="font-normal">{label}</Label>
        <div className="flex items-center gap-2 border rounded-md px-2">
            <input
                type="color"
                value={value}
                onChange={onChange}
                className="w-6 h-6 p-0 border-none bg-transparent"
                aria-label={label}
            />
            <span className="font-mono text-sm">{value.toUpperCase()}</span>
        </div>
    </div>
);

const AccordionSubTrigger = ({ title, onCheckedChange, checked }: { title: string, onCheckedChange: (checked: boolean) => void, checked: boolean }) => (
  <div className={cn(
    'flex w-full items-center justify-between p-3 border rounded-md bg-muted/50 dark:bg-white/5 transition-all',
    checked ? 'border-primary/50 ring-1 ring-primary/50' : 'border'
    )}>
    <AccordionTrigger className="p-0 hover:no-underline flex-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">{title}</span>
      </div>
    </AccordionTrigger>
    <Switch checked={checked} onCheckedChange={onCheckedChange} onClick={(e) => e.stopPropagation()} />
  </div>
);


export function SettingsPanel({ pageConfig, onConfigChange, onImageUpload, setViewMode, addPostPage, removePostPage, onPreviewPost }: SettingsPanelProps) {
    const { t } = useLanguage();
    const customPopupConfig = pageConfig.popups.custom;
    const [openAccordion, setOpenAccordion] = useState<string>('');
    const [openSubAccordion, setOpenSubAccordion] = useState<string>('');
    const [openContentSubAccordion, setOpenContentSubAccordion] = useState<string>('');

    const handleSubAccordionToggle = (accordionValue: string, isChecked: boolean) => {
        const path = ['popups', accordionValue, 'active'];
        onConfigChange(path, isChecked);

        if (isChecked) {
            setOpenSubAccordion(accordionValue);
        } else {
            if (openSubAccordion === accordionValue) {
                setOpenSubAccordion('');
            }
        }
    };
    
    const handleContentSubAccordionToggle = (accordionValue: 'footer' | 'disclaimer', isChecked: boolean) => {
        onConfigChange([accordionValue, 'active'], isChecked);
        if (isChecked) {
            setOpenContentSubAccordion(accordionValue);
        } else {
            if (openContentSubAccordion === accordionValue) {
                setOpenContentSubAccordion('');
            }
        }
    };

    const handleCustomizeClick = () => {
        setOpenSubAccordion('');
        setOpenAccordion('advanced');
    };

    const CustomizeLink = () => (
        <div className="pt-3 mt-3 border-t">
            <button onClick={handleCustomizeClick} className="text-sm text-primary hover:underline font-semibold flex items-center gap-1">
                <LinkIcon className="w-3 h-3"/>
                {t('customize')}
            </button>
        </div>
    );


    return (
        <TooltipProvider>
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">{t('page_settings')}</h2>
                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setOpenAccordion(''); setOpenSubAccordion(''); }}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">{t('close_all')}</span>
                </Button>
            </div>
            <ScrollArea className="flex-grow">
                <Accordion 
                    type="single" 
                    collapsible 
                    className="w-full"
                    value={openAccordion}
                    onValueChange={setOpenAccordion}
                >
                    
                    <AccordionItem value="layout" className="accordion-item-styling border-b">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <LayoutPanelLeft className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">{t('layout_and_elements')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-6 px-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="affiliateLink">{t('affiliate_link')} <span className="text-red-500 font-medium">({t('required')})</span></Label>
                                    <Input 
                                        id="affiliateLink"
                                        type="text" 
                                        placeholder="https://seu-link.com" 
                                        value={pageConfig.affiliateLink} 
                                        onChange={e => onConfigChange(['affiliateLink'], e.target.value)}
                                        className={!pageConfig.affiliateLink ? 'ring-2 ring-destructive/50' : ''}
                                    />
                                </div>
                                <SettingsToggle label={t('open_in_new_tab')} checked={pageConfig.newTab} onCheckedChange={(checked) => onConfigChange(['newTab'], checked)} />
                            </div>

                            <div className="space-y-4 p-3 border border-primary/20 bg-primary/5 rounded-md">
                                <div className="space-y-2">
                                    <Label>{t('desktop_image_url')}</Label>
                                    <ImageUploadInput
                                        value={pageConfig.desktopImage}
                                        onChange={e => onConfigChange(['desktopImage'], e.target.value)}
                                        onFileUpload={file => onImageUpload(file, ['desktopImage'])}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('mobile_image_url')}</Label>
                                     <ImageUploadInput
                                        value={pageConfig.mobileImage}
                                        onChange={e => {
                                            onConfigChange(['mobileImage'], e.target.value);
                                            setViewMode('mobile');
                                        }}
                                        onFileUpload={file => {
                                            onImageUpload(file, ['mobileImage']);
                                            setViewMode('mobile');
                                        }}
                                    />
                                </div>
                            </div>
                           
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>{t('desktop_height')} ({pageConfig.imageHeightDesktop}vh)</Label>
                                     <SliderWithControls
                                        value={[pageConfig.imageHeightDesktop]}
                                        onValueChange={(value) => onConfigChange(['imageHeightDesktop'], value[0])}
                                        min={10}
                                        max={500}
                                        step={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('mobile_height')} ({pageConfig.imageHeightMobile}vh)</Label>
                                     <SliderWithControls
                                        value={[pageConfig.imageHeightMobile]}
                                        onValueChange={(value) => onConfigChange(['imageHeightMobile'], value[0])}
                                        min={10}
                                        max={500}
                                        step={5}
                                    />
                                </div>
                            </div>
                            
                            <div className="p-3 border rounded-md">
                                <SettingsToggle label={t('dark_overlay')} checked={pageConfig.overlay.active} onCheckedChange={checked => onConfigChange(['overlay', 'active'], checked)} />
                                {pageConfig.overlay.active && (
                                    <div className="pt-4 space-y-4 border-t mt-4">
                                        <div className="space-y-2">
                                            <Label>{t('opacity')} ({pageConfig.overlay.opacity})</Label>
                                            <SliderWithControls
                                                value={[pageConfig.overlay.opacity]}
                                                onValueChange={(value) => onConfigChange(['overlay', 'opacity'], value[0])}
                                                min={0.1}
                                                max={1}
                                                step={0.1}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border rounded-md">
                                <SettingsToggle label={t('background_blur')} checked={pageConfig.blur.active} onCheckedChange={checked => onConfigChange(['blur', 'active'], checked)} />
                                {pageConfig.blur.active && (
                                    <div className="pt-4 space-y-4 border-t mt-4">
                                        <div className="space-y-2">
                                            <Label>{t('intensity')} ({pageConfig.blur.intensity}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.blur.intensity]}
                                                onValueChange={(value) => onConfigChange(['blur', 'intensity'], value[0])}
                                                min={1}
                                                max={3}
                                                step={1}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="popups" className="accordion-item-styling border-b">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <MessageSquare className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">{t('popups')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 px-4">
                           <Accordion 
                                type="single" 
                                collapsible 
                                className="w-full space-y-2"
                                value={openSubAccordion}
                                onValueChange={setOpenSubAccordion}
                            >
                                <AccordionItem value="cookies" className="border-b-0">
                                  <AccordionSubTrigger 
                                    title={t('cookie_popup')}
                                    checked={pageConfig.popups.cookies.active}
                                    onCheckedChange={(isChecked) => handleSubAccordionToggle('cookies', isChecked)}
                                  />
                                  <AccordionContent className="pt-4 space-y-4 px-3">
                                      <div className="space-y-2">
                                          <Label>{t('title')}</Label>
                                          <Input type="text" placeholder={t('popup_title')} value={pageConfig.popups.cookies.title} onChange={e => onConfigChange(['popups', 'cookies', 'title'], e.target.value)} />
                                      </div>
                                      <div className="space-y-2">
                                          <Label>{t('message')}</Label>
                                          <Textarea value={pageConfig.popups.cookies.message} onChange={e => onConfigChange(['popups', 'cookies', 'message'], e.target.value)} className="text-sm h-24" />
                                      </div>
                                      <div className="space-y-2">
                                          <Label>{t('button_text')}</Label>
                                          <Input type="text" placeholder={t('button_text')} value={pageConfig.popups.cookies.buttonText} onChange={e => onConfigChange(['popups', 'cookies', 'buttonText'], e.target.value)} />
                                      </div>
                                      <CustomizeLink />
                                  </AccordionContent>
                                </AccordionItem>


                                <AccordionItem value="ageVerification" className="border-b-0">
                                    <AccordionSubTrigger 
                                        title={t('age_verification_popup')}
                                        checked={pageConfig.popups.ageVerification.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('ageVerification', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label>{t('message')}</Label>
                                            <Textarea value={pageConfig.popups.ageVerification.message} onChange={e => onConfigChange(['popups', 'ageVerification', 'message'], e.target.value)} className="text-sm h-20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('yes_button_text')}</Label>
                                            <Input type="text" value={pageConfig.popups.ageVerification.yesButtonText} onChange={e => onConfigChange(['popups', 'ageVerification', 'yesButtonText'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('no_button_text')}</Label>
                                            <Input type="text" value={pageConfig.popups.ageVerification.noButtonText} onChange={e => onConfigChange(['popups', 'ageVerification', 'noButtonText'], e.target.value)} />
                                        </div>
                                        <ColorInput label={t('yes_button_color')} value={pageConfig.popups.ageVerification.yesButtonColor} onChange={e => onConfigChange(['popups', 'ageVerification', 'yesButtonColor'], e.target.value)} />
                                        <ColorInput label={t('no_button_color')} value={pageConfig.popups.ageVerification.noButtonColor} onChange={e => onConfigChange(['popups', 'ageVerification', 'noButtonColor'], e.target.value)} />
                                        <div className="space-y-2">
                                            <Label>{t('button_width')} ({pageConfig.popups.ageVerification.buttonWidth}%)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.popups.ageVerification.buttonWidth]}
                                                onValueChange={(value) => onConfigChange(['popups', 'ageVerification', 'buttonWidth'], value[0])}
                                                min={10}
                                                max={50}
                                                step={1}
                                            />
                                        </div>
                                        <CustomizeLink />
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="choice" className="border-b-0">
                                    <AccordionSubTrigger 
                                      title={t('choice_popup')}
                                      checked={pageConfig.popups.choice.active}
                                      onCheckedChange={(isChecked) => handleSubAccordionToggle('choice', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <Input type="text" placeholder={t('popup_title')} value={pageConfig.popups.choice.title} onChange={e => onConfigChange(['popups', 'choice', 'title'], e.target.value)} />
                                        <Textarea placeholder={t('popup_description')} value={pageConfig.popups.choice.description} onChange={e => onConfigChange(['popups', 'choice', 'description'], e.target.value)} className="text-sm h-24" />
                                        
                                        <div className="p-3 border-t mt-3">
                                        <SettingsToggle label={t('use_custom_images')} checked={pageConfig.popups.choice.useCustomImages} onCheckedChange={checked => onConfigChange(['popups', 'choice', 'useCustomImages'], checked)} />
                                        </div>

                                        {pageConfig.popups.choice.useCustomImages ? (
                                            <div className="space-y-4 pt-2">
                                                <div className='space-y-2'>
                                                    <Label>{t('left_image')}</Label>
                                                    <ImageUploadInput
                                                        value={pageConfig.popups.choice.image1Url}
                                                        onChange={e => onConfigChange(['popups', 'choice', 'image1Url'], e.target.value)}
                                                        onFileUpload={file => onImageUpload(file, ['popups', 'choice', 'image1Url'])}
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label>{t('right_image')}</Label>
                                                    <ImageUploadInput
                                                        value={pageConfig.popups.choice.image2Url}
                                                        onChange={e => onConfigChange(['popups', 'choice', 'image2Url'], e.target.value)}
                                                        onFileUpload={file => onImageUpload(file, ['popups', 'choice', 'image2Url'])}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 pt-2">
                                                <div className='space-y-2'>
                                                    <Label>{t('image_1_flag')}</Label>
                                                    <Select value={pageConfig.popups.choice.image1Url} onValueChange={value => onConfigChange(['popups', 'choice', 'image1Url'], value)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {flagOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label>{t('image_2_flag')}</Label>
                                                    <Select value={pageConfig.popups.choice.image2Url} onValueChange={value => onConfigChange(['popups', 'choice', 'image2Url'], value)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {flagOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Label>{t('custom_image_width')} ({pageConfig.popups.choice.customImageWidth}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.popups.choice.customImageWidth]}
                                                onValueChange={(value) => onConfigChange(['popups', 'choice', 'customImageWidth'], value[0])}
                                                min={50}
                                                max={250}
                                                step={10}
                                            />
                                        </div>
                                        <CustomizeLink />
                                    </AccordionContent>
                                </AccordionItem>

                                 <AccordionItem value="gender" className="border-b-0">
                                    <AccordionSubTrigger 
                                      title={t('gender_popup')}
                                      checked={pageConfig.popups.gender.active}
                                      onCheckedChange={(isChecked) => handleSubAccordionToggle('gender', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label>{t('title')}</Label>
                                            <Input type="text" placeholder={t('popup_title')} value={pageConfig.popups.gender.title} onChange={e => onConfigChange(['popups', 'gender', 'title'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('description')}</Label>
                                            <Textarea placeholder={t('popup_description')} value={pageConfig.popups.gender.description} onChange={e => onConfigChange(['popups', 'gender', 'description'], e.target.value)} className="text-sm h-24" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('male_text')}</Label>
                                            <Input type="text" value={pageConfig.popups.gender.maleText} onChange={e => onConfigChange(['popups', 'gender', 'maleText'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('female_text')}</Label>
                                            <Input type="text" value={pageConfig.popups.gender.femaleText} onChange={e => onConfigChange(['popups', 'gender', 'femaleText'], e.target.value)} />
                                        </div>

                                        <div className="p-3 border-t mt-3 space-y-3">
                                            <SettingsToggle label={t('add_other_option')} checked={pageConfig.popups.gender.includeOther} onCheckedChange={checked => onConfigChange(['popups', 'gender', 'includeOther'], checked)} />
                                            {pageConfig.popups.gender.includeOther && (
                                                <div className="space-y-2 pt-2 border-t">
                                                    <Label>{t('other_text')}</Label>
                                                    <Input type="text" value={pageConfig.popups.gender.otherText} onChange={e => onConfigChange(['popups', 'gender', 'otherText'], e.target.value)} />
                                                </div>
                                            )}
                                            <SettingsToggle label={t('use_custom_images')} checked={pageConfig.popups.gender.useCustomImages} onCheckedChange={checked => onConfigChange(['popups', 'gender', 'useCustomImages'], checked)} />
                                        </div>

                                        {pageConfig.popups.gender.useCustomImages ? (
                                            <div className="space-y-4 pt-2">
                                                <div className='space-y-2'>
                                                    <Label>{t('male_image')}</Label>
                                                    <ImageUploadInput
                                                        value={pageConfig.popups.gender.maleImageUrl}
                                                        onChange={e => onConfigChange(['popups', 'gender', 'maleImageUrl'], e.target.value)}
                                                        onFileUpload={file => onImageUpload(file, ['popups', 'gender', 'maleImageUrl'])}
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label>{t('female_image')}</Label>
                                                    <ImageUploadInput
                                                        value={pageConfig.popups.gender.femaleImageUrl}
                                                        onChange={e => onConfigChange(['popups', 'gender', 'femaleImageUrl'], e.target.value)}
                                                        onFileUpload={file => onImageUpload(file, ['popups', 'gender', 'femaleImageUrl'])}
                                                    />
                                                </div>
                                                {pageConfig.popups.gender.includeOther && (
                                                    <div className='space-y-2'>
                                                        <Label>{t('other_image')}</Label>
                                                        <ImageUploadInput
                                                            value={pageConfig.popups.gender.otherImageUrl}
                                                            onChange={e => onConfigChange(['popups', 'gender', 'otherImageUrl'], e.target.value)}
                                                            onFileUpload={file => onImageUpload(file, ['popups', 'gender', 'otherImageUrl'])}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <></>
                                        )}

                                        <div className="space-y-2">
                                            <Label>{t('icon_size')} ({pageConfig.popups.gender.iconSize}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.popups.gender.iconSize]}
                                                onValueChange={(value) => onConfigChange(['popups', 'gender', 'iconSize'], value[0])}
                                                min={24}
                                                max={128}
                                                step={4}
                                            />
                                        </div>
                                        <CustomizeLink />
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="captcha" className="border-b-0">
                                    <AccordionSubTrigger 
                                        title={t('captcha_popup')}
                                        checked={pageConfig.popups.captcha.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('captcha', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <Input type="text" placeholder={t('popup_title')} value={pageConfig.popups.captcha.title} onChange={e => onConfigChange(['popups', 'captcha', 'title'], e.target.value)} />
                                        <Textarea placeholder={t('popup_description')} value={pageConfig.popups.captcha.description} onChange={e => onConfigChange(['popups', 'captcha', 'description'], e.target.value)} className="text-sm h-24" />
                                        <div className="space-y-2">
                                            <Label>{t('captcha_type')}</Label>
                                            <Select value={pageConfig.popups.captcha.captchaType} onValueChange={value => onConfigChange(['popups', 'captcha', 'captchaType'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="checkbox">{t('checkbox')}</SelectItem>
                                                    <SelectItem value="checkbox-v2">{t('checkbox')} V2</SelectItem>
                                                    <SelectItem value="slide-v2">{t('slide')} V2</SelectItem>
                                                    <SelectItem value="slide-v3">{t('slide')} V3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {(pageConfig.popups.captcha.captchaType === 'checkbox' || pageConfig.popups.captcha.captchaType === 'checkbox-v2') && (
                                             <div className="space-y-2">
                                                <Label>{t('checkbox_text')}</Label>
                                                <Input type="text" value={pageConfig.popups.captcha.checkboxText} onChange={e => onConfigChange(['popups', 'captcha', 'checkboxText'], e.target.value)} />
                                            </div>
                                        )}
                                        {(pageConfig.popups.captcha.captchaType === 'slide-v2' || pageConfig.popups.captcha.captchaType === 'slide-v3') && (
                                            <div className="pt-4 mt-4 border-t space-y-4">
                                                <h4 className="font-semibold text-sm">{t('slider_customization')}</h4>
                                                <div className="space-y-2">
                                                    <Label>{t('slider_bar_text')}</Label>
                                                    <Input type="text" value={pageConfig.popups.captcha.sliderText} onChange={e => onConfigChange(['popups', 'captcha', 'sliderText'], e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t('slider_success_text')}</Label>
                                                    <Input type="text" value={pageConfig.popups.captcha.sliderSuccessText} onChange={e => onConfigChange(['popups', 'captcha', 'sliderSuccessText'], e.target.value)} />
                                                </div>
                                                 <div className="space-y-2">
                                                    <Label>{t('slider_bar_shape')}</Label>
                                                    <Select value={pageConfig.popups.captcha.sliderShape} onValueChange={value => onConfigChange(['popups', 'captcha', 'sliderShape'], value)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="round">{t('round')}</SelectItem>
                                                            <SelectItem value="square">{t('square')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <ColorInput label={t('button_color')} value={pageConfig.popups.captcha.sliderButtonColor} onChange={e => onConfigChange(['popups', 'captcha', 'sliderButtonColor'], e.target.value)} />
                                                <ColorInput label={t('bar_color')} value={pageConfig.popups.captcha.sliderTrackColor} onChange={e => onConfigChange(['popups', 'captcha', 'sliderTrackColor'], e.target.value)} />
                                                <ColorInput label={t('text_color')} value={pageConfig.popups.captcha.sliderTextColor} onChange={e => onConfigChange(['popups', 'captcha', 'sliderTextColor'], e.target.value)} />
                                                <ColorInput label={t('success_text_color')} value={pageConfig.popups.captcha.sliderSuccessTextColor} onChange={e => onConfigChange(['popups', 'captcha', 'sliderSuccessTextColor'], e.target.value)} />
                                            </div>
                                        )}
                                        <CustomizeLink />
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="discount" className="border-b-0">
                                    <AccordionSubTrigger 
                                        title={t('discount_popup')}
                                        checked={pageConfig.popups.discount.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('discount', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <Input type="text" placeholder={t('discount_text')} value={pageConfig.popups.discount.text} onChange={e => onConfigChange(['popups', 'discount', 'text'], e.target.value)} />
                                        <Textarea placeholder={t('offer_description')} value={pageConfig.popups.discount.description} onChange={e => onConfigChange(['popups', 'discount', 'description'], e.target.value)} className="text-sm h-24" />
                                        <div className="space-y-2">
                                            <Label>{t('icon')}</Label>
                                            <Select value={pageConfig.popups.discount.icon} onValueChange={value => onConfigChange(['popups', 'discount', 'icon'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {discountIconOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('icon_size')} ({pageConfig.popups.discount.iconSize}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.popups.discount.iconSize]}
                                                onValueChange={(value) => onConfigChange(['popups', 'discount', 'iconSize'], value[0])}
                                                min={24}
                                                max={96}
                                                step={4}
                                            />
                                        </div>
                                        <CustomizeLink />
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="exit" className="border-b-0">
                                    <AccordionSubTrigger 
                                        title={t('exit_popup')}
                                        checked={pageConfig.popups.exit.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('exit', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className='space-y-2'>
                                            <Label>{t('image_16_9')}</Label>
                                            <ImageUploadInput
                                                value={pageConfig.popups.exit.imageUrl}
                                                onChange={e => onConfigChange(['popups', 'exit', 'imageUrl'], e.target.value)}
                                                onFileUpload={file => onImageUpload(file, ['popups', 'exit', 'imageUrl'])}
                                            />
                                        </div>
                                        <div className="p-3 border rounded-md">
                                            <SettingsToggle label={t('image_only')} checked={pageConfig.popups.exit.imageOnly} onCheckedChange={checked => onConfigChange(['popups', 'exit', 'imageOnly'], checked)} />
                                        </div>
                                         {!pageConfig.popups.exit.imageOnly && (
                                            <div className="pt-4 space-y-4 border-t">
                                                 <div className="space-y-2">
                                                    <Label>{t('title')}</Label>
                                                    <Input type="text" placeholder={t('popup_title')} value={pageConfig.popups.exit.title} onChange={e => onConfigChange(['popups', 'exit', 'title'], e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t('description')}</Label>
                                                    <Textarea placeholder={t('popup_description')} value={pageConfig.popups.exit.description} onChange={e => onConfigChange(['popups', 'exit', 'description'], e.target.value)} className="text-sm h-24" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t('button_text')}</Label>
                                                    <Input type="text" placeholder={t('button_text')} value={pageConfig.popups.exit.buttonText} onChange={e => onConfigChange(['popups', 'exit', 'buttonText'], e.target.value)} />
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Label>{t('redirect_link_optional')}</Label>
                                            <Input type="text" placeholder="https://..." value={pageConfig.popups.exit.redirectLink} onChange={e => onConfigChange(['popups', 'exit', 'redirectLink'], e.target.value)} />
                                        </div>
                                        <CustomizeLink />
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="custom" className="border-b-0">
                                    <AccordionSubTrigger 
                                        title={t('custom_popup')}
                                        checked={customPopupConfig.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('custom', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-6 px-3">
                                        <div className="p-3 border rounded-md">
                                            <SettingsToggle 
                                                label={t('trigger_on_exit')} 
                                                checked={customPopupConfig.triggerOnExit} 
                                                onCheckedChange={checked => onConfigChange(['popups', 'custom', 'triggerOnExit'], checked)} 
                                            />
                                        </div>
                                        <Accordion type="single" collapsible className="w-full space-y-2">
                                            {/* Image Layout */}
                                            <AccordionItem value="image-layout">
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                                    <div className="flex items-center gap-3">
                                                    <ImageIcon className="w-4 h-4 text-slate-400" />
                                                    <span>{t('main_image_layout')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <div className="space-y-2">
                                                        <Label>{t('layout_style')}</Label>
                                                        <Select value={customPopupConfig.imageLayout} onValueChange={value => onConfigChange(['popups', 'custom', 'imageLayout'], value)}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">{t('none')}</SelectItem>
                                                                <SelectItem value="top">{t('top_image')}</SelectItem>
                                                                <SelectItem value="side">{t('side_image')}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {customPopupConfig.imageLayout !== 'none' && (
                                                        <>
                                                            <div className='space-y-2'>
                                                                <Label>{t('image_url')}</Label>
                                                                <ImageUploadInput
                                                                    value={customPopupConfig.imageUrl}
                                                                    onChange={e => onConfigChange(['popups', 'custom', 'imageUrl'], e.target.value)}
                                                                    onFileUpload={file => onImageUpload(file, ['popups', 'custom', 'imageUrl'])}
                                                                />
                                                            </div>
                                                            {customPopupConfig.imageLayout === 'side' && (
                                                                <>
                                                                    <div className="space-y-2">
                                                                        <Label>{t('image_position')}</Label>
                                                                        <Select value={customPopupConfig.imageSide} onValueChange={value => onConfigChange(['popups', 'custom', 'imageSide'], value)}>
                                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="left">{t('left')}</SelectItem>
                                                                                <SelectItem value="right">{t('right')}</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>{t('image_width')} ({customPopupConfig.imageSideWidth}%)</Label>
                                                                        <SliderWithControls
                                                                            value={[customPopupConfig.imageSideWidth]}
                                                                            onValueChange={(value) => onConfigChange(['popups', 'custom', 'imageSideWidth'], value[0])}
                                                                            min={10}
                                                                            max={90}
                                                                            step={5}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                            
                                            {/* Inner Image */}
                                            <AccordionItem value="inner-image-layout">
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <ImageIcon className="w-4 h-4 text-slate-400" />
                                                        <span>{t('inner_image')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <SettingsToggle label={t('enable_inner_image')} checked={customPopupConfig.imageInner.active} onCheckedChange={checked => onConfigChange(['popups', 'custom', 'imageInner', 'active'], checked)} />
                                                    {customPopupConfig.imageInner.active && (
                                                        <>
                                                            <div className='space-y-2'>
                                                                <Label>{t('inner_image_url')}</Label>
                                                                <ImageUploadInput
                                                                    value={customPopupConfig.imageInner.imageUrl}
                                                                    onChange={e => onConfigChange(['popups', 'custom', 'imageInner', 'imageUrl'], e.target.value)}
                                                                    onFileUpload={file => onImageUpload(file, ['popups', 'custom', 'imageInner', 'imageUrl'])}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>{t('inner_image_width')} ({customPopupConfig.imageInner.width}%)</Label>
                                                                <SliderWithControls
                                                                    value={[customPopupConfig.imageInner.width]}
                                                                    onValueChange={(value) => onConfigChange(['popups', 'custom', 'imageInner', 'width'], value[0])}
                                                                    min={10}
                                                                    max={100}
                                                                    step={5}
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Content */}
                                            <AccordionItem value="content">
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-4 h-4 text-slate-400" />
                                                        <span>{t('text_content')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <div className="space-y-2">
                                                        <Label>{t('title')}</Label>
                                                        <Input type="text" placeholder={t('popup_title')} value={customPopupConfig.title} onChange={e => onConfigChange(['popups', 'custom', 'title'], e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('description')}</Label>
                                                        <Textarea placeholder={t('popup_description_html')} value={customPopupConfig.description} onChange={e => onConfigChange(['popups', 'custom', 'description'], e.target.value)} className="text-sm h-24" />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Countdown Timer */}
                                            <AccordionItem value="countdown">
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                                    <div className="flex items-center gap-3">
                                                    <Timer className="w-4 h-4 text-slate-400" />
                                                    <span>{t('countdown_timer')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <SettingsToggle label={t('enable_countdown')} checked={customPopupConfig.countdown.active} onCheckedChange={checked => onConfigChange(['popups', 'custom', 'countdown', 'active'], checked)} />
                                                    {customPopupConfig.countdown.active && (
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label>{t('time_hhmmss')}</Label>
                                                                <Input type="text" placeholder="00:15:00" value={customPopupConfig.countdown.time} onChange={e => onConfigChange(['popups', 'custom', 'countdown', 'time'], e.target.value)} />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>{t('position')}</Label>
                                                                <Select value={customPopupConfig.countdown.position} onValueChange={value => onConfigChange(['popups', 'custom', 'countdown', 'position'], value)}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="aboveTitle">{t('above_title')}</SelectItem>
                                                                        <SelectItem value="belowText">{t('below_text')}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>{t('style')}</Label>
                                                                <Select value={customPopupConfig.countdown.style} onValueChange={value => onConfigChange(['popups', 'custom', 'countdown', 'style'], value)}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="style1">{t('simple')}</SelectItem>
                                                                        <SelectItem value="style2">{t('boxed')}</SelectItem>
                                                                        <SelectItem value="style3">{t('circled')}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>{t('font_size')} ({customPopupConfig.countdown.fontSize}px)</Label>
                                                                <SliderWithControls
                                                                    value={[customPopupConfig.countdown.fontSize]}
                                                                    onValueChange={(value) => onConfigChange(['popups', 'custom', 'countdown', 'fontSize'], value[0])}
                                                                    min={12}
                                                                    max={48}
                                                                    step={1}
                                                                />
                                                            </div>
                                                            <ColorInput label={t('countdown_color')} value={customPopupConfig.countdown.color} onChange={e => onConfigChange(['popups', 'custom', 'countdown', 'color'], e.target.value)} />
                                                            {(customPopupConfig.countdown.style === 'style2' || customPopupConfig.countdown.style === 'style3') && (
                                                                <ColorInput label={t('box_color')} value={customPopupConfig.countdown.boxColor} onChange={e => onConfigChange(['popups', 'custom', 'countdown', 'boxColor'], e.target.value)} />
                                                            )}
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Buttons */}
                                            <AccordionItem value="buttons">
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                                    <div className="flex items-center gap-3">
                                                    <Settings className="w-4 h-4 text-slate-400" />
                                                    <span>{t('buttons')}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <div className="space-y-2">
                                                        <Label>{t('main_button_text')}</Label>
                                                        <Input type="text" placeholder={t('main_button_text')} value={customPopupConfig.buttonText} onChange={e => onConfigChange(['popups', 'custom', 'buttonText'], e.target.value)} />
                                                    </div>
                                                    <div className="p-3 border rounded-md space-y-3">
                                                        <SettingsToggle label={t('enable_secondary_button')} checked={customPopupConfig.secondButton.active} onCheckedChange={checked => onConfigChange(['popups', 'custom', 'secondButton', 'active'], checked)} />
                                                        {customPopupConfig.secondButton.active && (
                                                            <div className="pt-3 border-t space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label>{t('secondary_button_text')}</Label>
                                                                    <Input type="text" placeholder={t('secondary_button_text')} value={customPopupConfig.secondButton.text} onChange={e => onConfigChange(['popups', 'custom', 'secondButton', 'text'], e.target.value)} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>{t('secondary_button_link')}</Label>
                                                                    <Input type="text" placeholder="https://link-secundario.com" value={customPopupConfig.secondButton.link} onChange={e => onConfigChange(['popups', 'custom', 'secondButton', 'link'], e.target.value)} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>{t('button_type')}</Label>
                                                                    <Select value={customPopupConfig.secondButton.style} onValueChange={value => onConfigChange(['popups', 'custom', 'secondButton', 'style'], value)}>
                                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="filled">{t('filled')}</SelectItem>
                                                                            <SelectItem value="outline">{t('outline')}</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                {customPopupConfig.secondButton.style === 'outline' && (
                                                                    <div className="space-y-2">
                                                                        <Label>{t('outline_width')} ({customPopupConfig.secondButton.outlineWidth}px)</Label>
                                                                        <SliderWithControls
                                                                            value={[customPopupConfig.secondButton.outlineWidth]}
                                                                            onValueChange={(value) => onConfigChange(['popups', 'custom', 'secondButton', 'outlineWidth'], value[0])}
                                                                            min={1}
                                                                            max={8}
                                                                            step={1}
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="space-y-2">
                                                                    <Label>{t('secondary_button_width')} ({customPopupConfig.secondButton.width}%)</Label>
                                                                    <SliderWithControls
                                                                        value={[customPopupConfig.secondButton.width]}
                                                                        onValueChange={(value) => onConfigChange(['popups', 'custom', 'secondButton', 'width'], value[0])}
                                                                        min={10}
                                                                        max={100}
                                                                        step={1}
                                                                    />
                                                                </div>
                                                                <div className="space-y-3 pt-2">
                                                                    <ColorInput label={t('main_color')} value={customPopupConfig.secondButton.color} onChange={e => onConfigChange(['popups', 'custom', 'secondButton', 'color'], e.target.value)} />
                                                                    <ColorInput label={t('text_color')} value={customPopupConfig.secondButton.textColor} onChange={e => onConfigChange(['popups', 'custom', 'secondButton', 'textColor'], e.target.value)} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('buttons_alignment')}</Label>
                                                        <Select value={customPopupConfig.buttonsAlignment} onValueChange={value => onConfigChange(['popups', 'custom', 'buttonsAlignment'], value)}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="vertical">{t('vertical')}</SelectItem>
                                                                <SelectItem value="horizontal">{t('horizontal')}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>

                     <AccordionItem value="advanced" className="accordion-item-styling border-b">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Settings2 className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">{t('popup_options')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4 px-4">
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                <AccordionItem value="button-config">
                                     <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <Brush className="w-4 h-4 text-slate-400" />
                                            <span>{t('button_config')}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label>{t('button_type')}</Label>
                                            <Select value={pageConfig.customization.button.style} onValueChange={value => onConfigChange(['customization', 'button', 'style'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="filled">{t('filled')}</SelectItem>
                                                    <SelectItem value="outline">{t('outline')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {pageConfig.customization.button.style === 'outline' && (
                                            <div className="space-y-2">
                                                <Label>{t('outline_width')} ({pageConfig.customization.button.outlineWidth}px)</Label>
                                                <SliderWithControls
                                                    value={[pageConfig.customization.button.outlineWidth]}
                                                    onValueChange={(value) => onConfigChange(['customization', 'button', 'outlineWidth'], value[0])}
                                                    min={1}
                                                    max={8}
                                                    step={1}
                                                />
                                            </div>
                                        )}
                                        <div className="space-y-3 pt-2">
                                            <ColorInput label={t('main_color')} value={pageConfig.customization.button.color} onChange={e => onConfigChange(['customization', 'button', 'color'], e.target.value)} />
                                            <ColorInput label={t('text_color')} value={pageConfig.customization.button.textColor} onChange={e => onConfigChange(['customization', 'button', 'textColor'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('button_width')} ({pageConfig.customization.button.width}%)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.button.width]}
                                                onValueChange={(value) => onConfigChange(['customization', 'button', 'width'], value[0])}
                                                min={10}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                         <div className="space-y-2">
                                            <Label>{t('button_alignment')}</Label>
                                            <Select value={pageConfig.customization.button.alignment} onValueChange={value => onConfigChange(['customization', 'button', 'alignment'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="left">{t('left')}</SelectItem>
                                                    <SelectItem value="center">{t('center')}</SelectItem>
                                                    <SelectItem value="right">{t('right')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('border_radius')} ({pageConfig.customization.button.borderRadius}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.button.borderRadius]}
                                                onValueChange={(value) => onConfigChange(['customization', 'button', 'borderRadius'], value[0])}
                                                min={0}
                                                max={30}
                                                step={1}
                                            />
                                        </div>
                                        <div className="p-3 border rounded-md">
                                            <SettingsToggle label={t('button_shadow')} checked={pageConfig.customization.button.shadow.active} onCheckedChange={checked => onConfigChange(['customization', 'button', 'shadow', 'active'], checked)} />
                                            {pageConfig.customization.button.shadow.active && (
                                                <div className="pt-4 space-y-4 border-t mt-4">
                                                    <div className="space-y-2">
                                                        <Label>{t('intensity')} ({pageConfig.customization.button.shadow.intensity}px)</Label>
                                                        <SliderWithControls
                                                            value={[pageConfig.customization.button.shadow.intensity]}
                                                            onValueChange={(value) => onConfigChange(['customization', 'button', 'shadow', 'intensity'], value[0])}
                                                            min={1}
                                                            max={20}
                                                            step={1}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="typography-config">
                                     <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <Type className="w-4 h-4 text-slate-400" />
                                            <span>{t('popup_typography')}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label>{t('font')}</Label>
                                            <Select value={pageConfig.customization.typography.fontFamily} onValueChange={value => onConfigChange(['customization', 'typography', 'fontFamily'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {fontOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3 pt-2">
                                            <ColorInput label={t('title_color')} value={pageConfig.customization.typography.titleColor} onChange={e => onConfigChange(['customization', 'typography', 'titleColor'], e.target.value)} />
                                            <ColorInput label={t('text_color')} value={pageConfig.customization.typography.textColor} onChange={e => onConfigChange(['customization', 'typography', 'textColor'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('title_size')} ({pageConfig.customization.typography.titleSize}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.typography.titleSize]}
                                                onValueChange={(value) => onConfigChange(['customization', 'typography', 'titleSize'], value[0])}
                                                min={16}
                                                max={48}
                                                step={1}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('text_size')} ({pageConfig.customization.typography.textSize}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.typography.textSize]}
                                                onValueChange={(value) => onConfigChange(['customization', 'typography', 'textSize'], value[0])}
                                                min={12}
                                                max={24}
                                                step={1}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="popup-style-config" className="border-b-0">
                                     <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <Palette className="w-4 h-4 text-slate-400" />
                                            <span>{t('popup_style')}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-6 px-3">
                                        <div className="space-y-3">
                                             <ColorInput label={t('popup_bg_color')} value={pageConfig.customization.popup.backgroundColor} onChange={e => onConfigChange(['customization', 'popup', 'backgroundColor'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('popup_width')} ({pageConfig.customization.popup.maxWidth}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.maxWidth]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'maxWidth'], value[0])}
                                                min={200}
                                                max={1000}
                                                step={10}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('vertical_spacing')} ({pageConfig.customization.popup.paddingY}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.paddingY]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'paddingY'], value[0])}
                                                min={0}
                                                max={128}
                                                step={4}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('horizontal_spacing')} ({pageConfig.customization.popup.paddingX}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.paddingX]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'paddingX'], value[0])}
                                                min={0}
                                                max={64}
                                                step={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('general_spacing')} ({pageConfig.customization.popup.gap}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.gap]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'gap'], value[0])}
                                                min={0}
                                                max={48}
                                                step={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('title_spacing')} ({pageConfig.customization.popup.titleBottomMargin}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.titleBottomMargin]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'titleBottomMargin'], value[0])}
                                                min={0}
                                                max={48}
                                                step={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('description_spacing')} ({pageConfig.customization.popup.descriptionBottomMargin}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.descriptionBottomMargin]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'descriptionBottomMargin'], value[0])}
                                                min={0}
                                                max={48}
                                                step={2}
                                            />
                                        </div>
                                         <div className="space-y-2">
                                            <Label>{t('border_radius')} ({pageConfig.customization.popup.borderRadius}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.borderRadius]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'borderRadius'], value[0])}
                                                min={0}
                                                max={40}
                                                step={2}
                                            />
                                        </div>
                                         <div className="p-3 border rounded-md">
                                            <SettingsToggle label={t('popup_contour')} checked={pageConfig.customization.popupContour.active} onCheckedChange={checked => onConfigChange(['customization', 'popupContour', 'active'], checked)} />
                                            {pageConfig.customization.popupContour.active && (
                                                <div className="pt-4 space-y-6 border-t mt-4">
                                                    <div className="space-y-3">
                                                        <ColorInput label={t('contour_color')} value={pageConfig.customization.popupContour.color} onChange={e => onConfigChange(['customization', 'popupContour', 'color'], e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('width')} ({pageConfig.customization.popupContour.width}px)</Label>
                                                        <SliderWithControls
                                                            value={[pageConfig.customization.popupContour.width]}
                                                            onValueChange={(value) => onConfigChange(['customization', 'popupContour', 'width'], value[0])}
                                                            min={1}
                                                            max={10}
                                                            step={1}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{t('contour_style')}</Label>
                                                        <Select value={pageConfig.customization.popupContour.style} onValueChange={value => onConfigChange(['customization', 'popupContour', 'style'], value)}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="solid">{t('solid')}</SelectItem>
                                                                <SelectItem value="dashed">{t('dashed')}</SelectItem>
                                                                <SelectItem value="dotted">{t('dotted')}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 border rounded-md">
                                            <SettingsToggle label={t('popup_shadow')} checked={pageConfig.customization.shadow.active} onCheckedChange={checked => onConfigChange(['customization', 'shadow', 'active'], checked)} />
                                            {pageConfig.customization.shadow.active && (
                                                <div className="pt-4 space-y-4 border-t mt-4">
                                                    <div className="space-y-2">
                                                        <Label>{t('intensity')} ({pageConfig.customization.shadow.intensity}px)</Label>
                                                        <SliderWithControls
                                                            value={[pageConfig.customization.shadow.intensity]}
                                                            onValueChange={(value) => onConfigChange(['customization', 'shadow', 'intensity'], value[0])}
                                                            min={1}
                                                            max={50}
                                                            step={1}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="behavior-config">
                                    <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <Settings className="w-4 h-4 text-slate-400" />
                                            <span>{t('behavior_animation')}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-6 px-3">
                                        <div className="space-y-2">
                                            <Label>{t('popup_position')}</Label>
                                            <Select value={pageConfig.customization.popupPosition} onValueChange={value => onConfigChange(['customization', 'popupPosition'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="top">{t('top')}</SelectItem>
                                                    <SelectItem value="center">{t('center_screen')}</SelectItem>
                                                    <SelectItem value="bottom">{t('bottom')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('popup_animation')}</Label>
                                            <Select value={pageConfig.customization.popupAnimation} onValueChange={value => onConfigChange(['customization', 'popupAnimation'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {animationOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('animation_duration')} ({pageConfig.customization.popupAnimationDuration}s)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popupAnimationDuration]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popupAnimationDuration'], value[0])}
                                                min={0.1}
                                                max={2}
                                                step={0.1}
                                            />
                                        </div>
                                        <div className="p-3 border rounded-md space-y-3">
                                            <SettingsToggle label={t('show_close_button')} checked={pageConfig.customization.showCloseButton} onCheckedChange={checked => onConfigChange(['customization', 'showCloseButton'], checked)} />
                                            {pageConfig.customization.showCloseButton && (
                                                <div className="pt-4 space-y-3 border-t mt-4">
                                                    <ColorInput label={t('close_button_color')} value={pageConfig.customization.closeButtonColor} onChange={e => onConfigChange(['customization', 'closeButtonColor'], e.target.value)} />
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="content" className="accordion-item-styling border-b">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">{t('content_seo')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4 px-4">
                             <Accordion 
                                type="single" 
                                collapsible 
                                className="w-full space-y-2"
                                value={openContentSubAccordion}
                                onValueChange={setOpenContentSubAccordion}
                            >
                                <AccordionItem value="footer" className="border-b-0">
                                    <AccordionSubTrigger 
                                      title={t('footer')}
                                      checked={pageConfig.footer.active}
                                      onCheckedChange={(isChecked) => handleContentSubAccordionToggle('footer', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                        <SettingsToggle label={t('auto_generate_pages')} checked={pageConfig.footer.autoGenerate} onCheckedChange={checked => onConfigChange(['footer', 'autoGenerate'], checked)} />
                                        
                                        {!pageConfig.footer.autoGenerate && (
                                            <>
                                                <Input type="text" placeholder={t('privacy_policy_link')} value={pageConfig.footer.privacyLink} onChange={e => onConfigChange(['footer', 'privacyLink'], e.target.value)} />
                                                <Input type="text" placeholder={t('terms_of_use_link')} value={pageConfig.footer.termsLink} onChange={e => onConfigChange(['footer', 'termsLink'], e.target.value)} />
                                            </>
                                        )}
                                        <div className="space-y-3 pt-2">
                                            <ColorInput label={t('background_color')} value={pageConfig.footer.backgroundColor} onChange={e => onConfigChange(['footer', 'backgroundColor'], e.target.value)} />
                                            <ColorInput label={t('text_color')} value={pageConfig.footer.textColor} onChange={e => onConfigChange(['footer', 'textColor'], e.target.value)} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="disclaimer" className="border-b-0">
                                    <AccordionSubTrigger 
                                      title={t('disclaimer_section')}
                                      checked={pageConfig.disclaimer.active}
                                      onCheckedChange={(isChecked) => handleContentSubAccordionToggle('disclaimer', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                        <Textarea value={pageConfig.disclaimer.text} onChange={e => onConfigChange(['disclaimer', 'text'], e.target.value)} className="text-sm h-24" />
                                        <div className="space-y-3 pt-2">
                                            <ColorInput label={t('background_color')} value={pageConfig.disclaimer.backgroundColor} onChange={e => onConfigChange(['disclaimer', 'backgroundColor'], e.target.value)} />
                                            <ColorInput label={t('text_color')} value={pageConfig.disclaimer.textColor} onChange={e => onConfigChange(['disclaimer', 'textColor'], e.target.value)} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="seo" className="border-b-0">
                                  <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-slate-400" />
                                        <h3 className='font-semibold text-sm'>{t('seo_metadata')}</h3>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                    {pageConfig.seo && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="pageTitle">{t('page_title')}</Label>
                                                <Input id="pageTitle" type="text" placeholder={t('page_title_placeholder')} value={pageConfig.seo.title} onChange={e => onConfigChange(['seo', 'title'], e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pageDescription">{t('page_description')}</Label>
                                                <Textarea id="pageDescription" placeholder={t('page_description_placeholder')} value={pageConfig.seo.description} onChange={e => onConfigChange(['seo', 'description'], e.target.value)} className="h-20" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="faviconUrl">{t('favicon_url')}</Label>
                                                <ImageUploadInput
                                                    id="faviconUrl"
                                                    value={pageConfig.seo.favicon}
                                                    onChange={e => onConfigChange(['seo', 'favicon'], e.target.value)}
                                                    onFileUpload={file => onImageUpload(file, ['seo', 'favicon'])}
                                                />
                                            </div>
                                        </>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="post-page-list" className="border-b-0">
                                    <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm bg-muted/50 dark:bg-white/5">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <h3 className='font-semibold text-sm'>{t('post_pages')}</h3>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                        {addPostPage && (
                                            <Button onClick={addPostPage} className="w-full">
                                                <Plus className="w-4 h-4 mr-2" />
                                                {t('add_new_post')}
                                            </Button>
                                        )}
                                        {pageConfig.postPages.length > 0 && (
                                            <Accordion type="multiple" className="space-y-2">
                                                {pageConfig.postPages.map((post, index) => (
                                                    <AccordionItem key={index} value={`post-${index}`} className="border rounded-md px-3">
                                                        <div className="flex items-center">
                                                            <AccordionTrigger className="flex-1 py-3">{post.productName || `Post ${index + 1}`}</AccordionTrigger>
                                                            {onPreviewPost && (
                                                                <Button variant="ghost" size="icon" onClick={() => onPreviewPost(index)} className="ml-2 h-7 w-7">
                                                                    <Eye className="h-4 w-4 text-blue-500" />
                                                                </Button>
                                                            )}
                                                            {removePostPage && (
                                                                <Button variant="ghost" size="icon" onClick={() => removePostPage(index)} className="ml-2 h-7 w-7">
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <AccordionContent className="space-y-4 pt-4 border-t">
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label>{t('product_name')}</Label>
                                                                    <Input type="text" placeholder={t('product_name')} value={post.productName} onChange={e => onConfigChange(['postPages', index, 'productName'], e.target.value)} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>{t('post_content')}</Label>
                                                                    <Textarea placeholder={t('write_your_article_here')} value={post.content} onChange={e => onConfigChange(['postPages', index, 'content'], e.target.value)} className="h-40" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>{t('post_image_url')}</Label>
                                                                    <ImageUploadInput
                                                                        value={post.imageUrl}
                                                                        onChange={e => onConfigChange(['postPages', index, 'imageUrl'], e.target.value)}
                                                                        onFileUpload={file => onImageUpload(file, ['postPages', index, 'imageUrl'])}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="configuracao" className="accordion-item-styling border-b">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Settings className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">{t('advanced_settings')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-2 px-4">
                             <div className="space-y-3 p-3 border border-destructive/30 bg-destructive/5 rounded-md text-destructive">
                                <div className="flex items-start gap-2">
                                     <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                     <div className="flex-1">
                                        <SettingsToggle 
                                            label={t('cookie_loading')} 
                                            checked={pageConfig.tracking.cookieLoader.active} 
                                            onCheckedChange={checked => onConfigChange(['tracking', 'cookieLoader', 'active'], checked)}
                                        >
                                             <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-center" side="top">
                                                    <p>{t('cookie_loading_tooltip')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </SettingsToggle>
                                     </div>
                                </div>
                                {pageConfig.tracking.cookieLoader.active && (
                                    <div className="pt-4 space-y-4 border-t mt-4 border-destructive/30">
                                        <div className="space-y-2">
                                            <Label className='text-foreground'>{t('cookie_link')}</Label>
                                            <Input 
                                                type="text" 
                                                placeholder="https://seu-link-de-cookie.com" 
                                                value={pageConfig.tracking.cookieLoader.link} 
                                                onChange={e => onConfigChange(['tracking', 'cookieLoader', 'link'], e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className='text-foreground'>{t('time')} ({pageConfig.tracking.cookieLoader.time}s)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.tracking.cookieLoader.time]}
                                                onValueChange={(value) => onConfigChange(['tracking', 'cookieLoader', 'time'], value[0])}
                                                min={1}
                                                max={10}
                                                step={1}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3 p-3 border border-destructive/30 bg-destructive/5 rounded-md text-destructive">
                                <div className="flex items-start gap-2">
                                     <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                     <div className="flex-1">
                                        <SettingsToggle 
                                            label={t('full_page_click')} 
                                            checked={pageConfig.fullPageClick}
                                            onCheckedChange={checked => onConfigChange(['fullPageClick'], checked)}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-center" side="top">
                                                    <p>{t('full_page_click_tooltip')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </SettingsToggle>
                                     </div>
                                </div>
                            </div>
                           <div className="space-y-3 p-3 border border-destructive/30 bg-destructive/5 rounded-md text-destructive">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                         <SettingsToggle 
                                            label={t('auto_redirect')} 
                                            checked={pageConfig.autoRedirect.active} 
                                            onCheckedChange={checked => onConfigChange(['autoRedirect', 'active'], checked)}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-center" side="top">
                                                    <p>{t('auto_redirect_tooltip')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </SettingsToggle>
                                    </div>
                                </div>
                                {pageConfig.autoRedirect.active && (
                                    <div className="pt-4 space-y-2 border-t mt-4 border-destructive/30">
                                        <Label className="text-foreground">{t('time')} ({pageConfig.autoRedirect.time}s)</Label>
                                        <input type="range" min="3" max="8" step="1" value={pageConfig.autoRedirect.time} onChange={e => onConfigChange(['autoRedirect', 'time'], Number(e.target.value))} />
                                    </div>
                                )}
                            </div>
                             <div className="space-y-3 p-3 border border-destructive/30 bg-destructive/5 rounded-md text-destructive">
                                <div className="flex items-start gap-2">
                                     <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                     <div className="flex-1">
                                        <SettingsToggle 
                                            label={t('custom_html')} 
                                            checked={!!pageConfig.customization.customHtml}
                                            onCheckedChange={(checked) => onConfigChange(['customization', 'customHtml'], checked ? ' ' : '')}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-center" side="top">
                                                    <p>{t('custom_html_tooltip')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </SettingsToggle>
                                     </div>
                                </div>
                                {!!pageConfig.customization.customHtml && (
                                    <Textarea placeholder="<script>...</script>" value={pageConfig.customization.customHtml} onChange={e => onConfigChange(['customization', 'customHtml'], e.target.value)} className="text-sm h-32 font-mono bg-background/50 border-destructive/20 focus-visible:ring-destructive" />
                                )}
                            </div>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                <AccordionItem value="tracking" className="border-b-0">
                                    <div className="p-3 border rounded-md bg-muted/50 dark:bg-white/5">
                                        <AccordionTrigger className="hover:no-underline p-0 w-full justify-start">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-slate-400" />
                                                <h3 className='font-semibold text-sm'>{t('tracking')}</h3>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 mt-2 border-t space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="facebookPixelId">{t('facebook_pixel_id')}</Label>
                                                <Input 
                                                    id="facebookPixelId"
                                                    type="text" 
                                                    placeholder={t('facebook_pixel_id_placeholder')} 
                                                    value={pageConfig.tracking.facebookPixelId} 
                                                    onChange={e => onConfigChange(['tracking', 'facebookPixelId'], e.target.value)}
                                                />
                                                <p className='text-xs text-muted-foreground'>{t('facebook_pixel_id_description')}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="googleAdsId">{t('google_ads_id')}</Label>
                                                <Input 
                                                    id="googleAdsId"
                                                    type="text" 
                                                    placeholder="Ex: AW-123456789" 
                                                    value={pageConfig.tracking.googleAdsId} 
                                                    onChange={e => onConfigChange(['tracking', 'googleAdsId'], e.target.value)}
                                                />
                                                <p className='text-xs text-muted-foreground'>{t('google_ads_id_description')}</p>
                                            </div>
                                        </AccordionContent>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
        </TooltipProvider>
    );
}

    