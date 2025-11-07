
"use client";

import React, { useState } from 'react';
import type { PageConfig } from '@/lib/definitions';
import { flagOptions, animationOptions, discountIconOptions, fontOptions } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, MessageSquare, LayoutPanelLeft, Settings2, Settings, Brush, Type, Palette, Target, Image as ImageIcon, Timer, X, AlertTriangle, Globe, HelpCircle, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageUploadInput } from './image-upload-input';
import type { ViewMode } from '@/app/(protected)/editor/page';
import { SliderWithControls } from './slider-with-controls';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface SettingsPanelProps {
    pageConfig: PageConfig;
    onConfigChange: (keys: (string | number)[], value: any) => void;
    onImageUpload: (file: File, keys: (string | number)[]) => void;
    setViewMode: (mode: ViewMode) => void;
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
  <div className='flex w-full items-center justify-between p-3 border rounded-md'>
    <AccordionTrigger className="p-0 hover:no-underline flex-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">{title}</span>
      </div>
    </AccordionTrigger>
    <Switch checked={checked} onCheckedChange={onCheckedChange} onClick={(e) => e.stopPropagation()} />
  </div>
);


export function SettingsPanel({ pageConfig, onConfigChange, onImageUpload, setViewMode }: SettingsPanelProps) {
    const customPopupConfig = pageConfig.popups.custom;
    const [openAccordion, setOpenAccordion] = useState<string>('');
    const [openSubAccordion, setOpenSubAccordion] = useState<string>('');


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


    return (
        <TooltipProvider>
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Configurações da Página</h2>
                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setOpenAccordion(''); setOpenSubAccordion(''); }}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar tudo</span>
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
                                <span className="font-semibold">Layout e Elementos</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-6 px-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="affiliateLink">Link de Afiliado <span className="text-red-500 font-medium">(Obrigatório)</span></Label>
                                    <Input 
                                        id="affiliateLink"
                                        type="text" 
                                        placeholder="https://seu-link.com" 
                                        value={pageConfig.affiliateLink} 
                                        onChange={e => onConfigChange(['affiliateLink'], e.target.value)}
                                        className={!pageConfig.affiliateLink ? 'ring-2 ring-destructive/50' : ''}
                                    />
                                </div>
                                <SettingsToggle label="Abrir em nova guia" checked={pageConfig.newTab} onCheckedChange={(checked) => onConfigChange(['newTab'], checked)} />
                            </div>

                            <div className="space-y-4 p-3 border border-primary/20 bg-primary/5 rounded-md">
                                <div className="space-y-2">
                                    <Label>Imagem Desktop (URL)</Label>
                                    <ImageUploadInput
                                        value={pageConfig.desktopImage}
                                        onChange={e => onConfigChange(['desktopImage'], e.target.value)}
                                        onFileUpload={file => onImageUpload(file, ['desktopImage'])}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Imagem Mobile (URL)</Label>
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
                                    <Label>Altura Desktop ({pageConfig.imageHeightDesktop}vh)</Label>
                                     <SliderWithControls
                                        value={[pageConfig.imageHeightDesktop]}
                                        onValueChange={(value) => onConfigChange(['imageHeightDesktop'], value[0])}
                                        min={10}
                                        max={200}
                                        step={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Altura Mobile ({pageConfig.imageHeightMobile}vh)</Label>
                                     <SliderWithControls
                                        value={[pageConfig.imageHeightMobile]}
                                        onValueChange={(value) => onConfigChange(['imageHeightMobile'], value[0])}
                                        min={10}
                                        max={200}
                                        step={5}
                                    />
                                </div>
                            </div>
                            
                            <div className="p-3 border rounded-md">
                                <SettingsToggle label="Sobreposição Escura" checked={pageConfig.overlay.active} onCheckedChange={checked => onConfigChange(['overlay', 'active'], checked)} />
                                {pageConfig.overlay.active && (
                                    <div className="pt-4 space-y-4 border-t mt-4">
                                        <div className="space-y-2">
                                            <Label>Opacidade ({pageConfig.overlay.opacity})</Label>
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
                                <SettingsToggle label="Desfoque de Fundo" checked={pageConfig.blur.active} onCheckedChange={checked => onConfigChange(['blur', 'active'], checked)} />
                                {pageConfig.blur.active && (
                                    <div className="pt-4 space-y-4 border-t mt-4">
                                        <div className="space-y-2">
                                            <Label>Intensidade ({pageConfig.blur.intensity}px)</Label>
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
                                <span className="font-semibold">Pop-ups</span>
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
                                <AccordionItem value="cookies" className="border-b">
                                  <AccordionSubTrigger 
                                    title="Pop-up de Cookies"
                                    checked={pageConfig.popups.cookies.active}
                                    onCheckedChange={(isChecked) => handleSubAccordionToggle('cookies', isChecked)}
                                  />
                                  <AccordionContent className="pt-4 space-y-4 px-3">
                                      <Textarea value={pageConfig.popups.cookies.message} onChange={e => onConfigChange(['popups', 'cookies', 'message'], e.target.value)} className="text-sm h-24" />
                                      <div className="space-y-2">
                                          <Label>Texto do Botão</Label>
                                          <Input type="text" placeholder="Texto do Botão" value={pageConfig.popups.cookies.buttonText} onChange={e => onConfigChange(['popups', 'cookies', 'buttonText'], e.target.value)} />
                                      </div>
                                  </AccordionContent>
                                </AccordionItem>


                                <AccordionItem value="ageVerification" className="border-b">
                                    <AccordionSubTrigger 
                                        title="Pop-up Verificação de Idade"
                                        checked={pageConfig.popups.ageVerification.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('ageVerification', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label>Mensagem</Label>
                                            <Textarea value={pageConfig.popups.ageVerification.message} onChange={e => onConfigChange(['popups', 'ageVerification', 'message'], e.target.value)} className="text-sm h-20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Texto do Botão 'Sim'</Label>
                                            <Input type="text" value={pageConfig.popups.ageVerification.yesButtonText} onChange={e => onConfigChange(['popups', 'ageVerification', 'yesButtonText'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Texto do Botão 'Não'</Label>
                                            <Input type="text" value={pageConfig.popups.ageVerification.noButtonText} onChange={e => onConfigChange(['popups', 'ageVerification', 'noButtonText'], e.target.value)} />
                                        </div>
                                        <ColorInput label="Cor do Botão 'Sim'" value={pageConfig.popups.ageVerification.yesButtonColor} onChange={e => onConfigChange(['popups', 'ageVerification', 'yesButtonColor'], e.target.value)} />
                                        <ColorInput label="Cor do Botão 'Não'" value={pageConfig.popups.ageVerification.noButtonColor} onChange={e => onConfigChange(['popups', 'ageVerification', 'noButtonColor'], e.target.value)} />
                                        <div className="space-y-2">
                                            <Label>Largura dos Botões ({pageConfig.popups.ageVerification.buttonWidth}%)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.popups.ageVerification.buttonWidth]}
                                                onValueChange={(value) => onConfigChange(['popups', 'ageVerification', 'buttonWidth'], value[0])}
                                                min={10}
                                                max={50}
                                                step={1}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="choice" className="border-b">
                                    <AccordionSubTrigger 
                                      title="Pop-up de Escolha"
                                      checked={pageConfig.popups.choice.active}
                                      onCheckedChange={(isChecked) => handleSubAccordionToggle('choice', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <Input type="text" placeholder="Título do Pop-up" value={pageConfig.popups.choice.title} onChange={e => onConfigChange(['popups', 'choice', 'title'], e.target.value)} />
                                        <Textarea placeholder="Descrição do Pop-up" value={pageConfig.popups.choice.description} onChange={e => onConfigChange(['popups', 'choice', 'description'], e.target.value)} className="text-sm h-24" />
                                        
                                        <div className="p-3 border-t mt-3">
                                        <SettingsToggle label="Usar Imagens Personalizadas" checked={pageConfig.popups.choice.useCustomImages} onCheckedChange={checked => onConfigChange(['popups', 'choice', 'useCustomImages'], checked)} />
                                        </div>

                                        {pageConfig.popups.choice.useCustomImages ? (
                                            <div className="space-y-4 pt-2">
                                                <div className='space-y-2'>
                                                    <Label>Imagem da Esquerda</Label>
                                                    <ImageUploadInput
                                                        value={pageConfig.popups.choice.image1Url}
                                                        onChange={e => onConfigChange(['popups', 'choice', 'image1Url'], e.target.value)}
                                                        onFileUpload={file => onImageUpload(file, ['popups', 'choice', 'image1Url'])}
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label>Imagem da Direita</Label>
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
                                                    <Label>Imagem 1 (Bandeira)</Label>
                                                    <Select value={pageConfig.popups.choice.image1Url} onValueChange={value => onConfigChange(['popups', 'choice', 'image1Url'], value)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {flagOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label>Imagem 2 (Bandeira)</Label>
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
                                            <Label>Largura da Imagem ({pageConfig.popups.choice.customImageWidth}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.popups.choice.customImageWidth]}
                                                onValueChange={(value) => onConfigChange(['popups', 'choice', 'customImageWidth'], value[0])}
                                                min={50}
                                                max={250}
                                                step={10}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="captcha" className="border-b">
                                    <AccordionSubTrigger 
                                        title="Pop-up Captcha"
                                        checked={pageConfig.popups.captcha.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('captcha', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <Input type="text" placeholder="Título do Pop-up" value={pageConfig.popups.captcha.title} onChange={e => onConfigChange(['popups', 'captcha', 'title'], e.target.value)} />
                                        <Textarea placeholder="Descrição do Pop-up" value={pageConfig.popups.captcha.description} onChange={e => onConfigChange(['popups', 'captcha', 'description'], e.target.value)} className="text-sm h-24" />
                                        <div className="space-y-2">
                                            <Label>Tipo de Captcha</Label>
                                            <Select value={pageConfig.popups.captcha.captchaType} onValueChange={value => onConfigChange(['popups', 'captcha', 'captchaType'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                    <SelectItem value="checkbox-v2">Checkbox V2</SelectItem>
                                                    <SelectItem value="slide">Deslizar até o fim</SelectItem>
                                                    <SelectItem value="slide-v2">Deslizar V2</SelectItem>
                                                    <SelectItem value="slide-v3">Deslizar V3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="discount" className="border-b">
                                    <AccordionSubTrigger 
                                        title="Pop-up de Desconto"
                                        checked={pageConfig.popups.discount.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('discount', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <Input type="text" placeholder="Texto do desconto" value={pageConfig.popups.discount.text} onChange={e => onConfigChange(['popups', 'discount', 'text'], e.target.value)} />
                                        <Textarea placeholder="Descrição da oferta" value={pageConfig.popups.discount.description} onChange={e => onConfigChange(['popups', 'discount', 'description'], e.target.value)} className="text-sm h-24" />
                                        <div className="space-y-2">
                                            <Label>Ícone</Label>
                                            <Select value={pageConfig.popups.discount.icon} onValueChange={value => onConfigChange(['popups', 'discount', 'icon'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {discountIconOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tamanho do Ícone ({pageConfig.popups.discount.iconSize}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.popups.discount.iconSize]}
                                                onValueChange={(value) => onConfigChange(['popups', 'discount', 'iconSize'], value[0])}
                                                min={24}
                                                max={96}
                                                step={4}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="exit" className="border-b">
                                    <AccordionSubTrigger 
                                        title="Pop-up de Saída"
                                        checked={pageConfig.popups.exit.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('exit', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className='space-y-2'>
                                            <Label>Imagem (16:9)</Label>
                                            <ImageUploadInput
                                                value={pageConfig.popups.exit.imageUrl}
                                                onChange={e => onConfigChange(['popups', 'exit', 'imageUrl'], e.target.value)}
                                                onFileUpload={file => onImageUpload(file, ['popups', 'exit', 'imageUrl'])}
                                            />
                                        </div>
                                        <Input type="text" placeholder="Link de Redirecionamento (Opcional)" value={pageConfig.popups.exit.redirectLink} onChange={e => onConfigChange(['popups', 'exit', 'redirectLink'], e.target.value)} />
                                        <div className="p-3 border rounded-md">
                                            <SettingsToggle label="Somente Imagem" checked={pageConfig.popups.exit.imageOnly} onCheckedChange={checked => onConfigChange(['popups', 'exit', 'imageOnly'], checked)} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="custom" className="border-b-0">
                                    <AccordionSubTrigger 
                                        title="Pop-up Personalizado"
                                        checked={customPopupConfig.active}
                                        onCheckedChange={(isChecked) => handleSubAccordionToggle('custom', isChecked)}
                                    />
                                    <AccordionContent className="pt-4 space-y-6 px-3">
                                        <Accordion type="single" collapsible className="w-full space-y-2">
                                            {/* Image Layout */}
                                            <AccordionItem value="image-layout">
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                                    <div className="flex items-center gap-3">
                                                    <ImageIcon className="w-4 h-4 text-primary/80" />
                                                    <span>Layout da Imagem Principal</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <div className="space-y-2">
                                                        <Label>Estilo do Layout</Label>
                                                        <Select value={customPopupConfig.imageLayout} onValueChange={value => onConfigChange(['popups', 'custom', 'imageLayout'], value)}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">Nenhum</SelectItem>
                                                                <SelectItem value="top">Imagem no Topo</SelectItem>
                                                                <SelectItem value="side">Imagem Lateral</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {customPopupConfig.imageLayout !== 'none' && (
                                                        <>
                                                            <div className='space-y-2'>
                                                                <Label>URL da Imagem</Label>
                                                                <ImageUploadInput
                                                                    value={customPopupConfig.imageUrl}
                                                                    onChange={e => onConfigChange(['popups', 'custom', 'imageUrl'], e.target.value)}
                                                                    onFileUpload={file => onImageUpload(file, ['popups', 'custom', 'imageUrl'])}
                                                                />
                                                            </div>
                                                            {customPopupConfig.imageLayout === 'side' && (
                                                                <>
                                                                    <div className="space-y-2">
                                                                        <Label>Posição da Imagem</Label>
                                                                        <Select value={customPopupConfig.imageSide} onValueChange={value => onConfigChange(['popups', 'custom', 'imageSide'], value)}>
                                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="left">Esquerda</SelectItem>
                                                                                <SelectItem value="right">Direita</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>Largura da Imagem ({customPopupConfig.imageSideWidth}%)</Label>
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
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <ImageIcon className="w-4 h-4 text-primary/80" />
                                                        <span>Imagem Interna</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <SettingsToggle label="Ativar Imagem Interna" checked={customPopupConfig.imageInner.active} onCheckedChange={checked => onConfigChange(['popups', 'custom', 'imageInner', 'active'], checked)} />
                                                    {customPopupConfig.imageInner.active && (
                                                        <>
                                                            <div className='space-y-2'>
                                                                <Label>URL da Imagem Interna</Label>
                                                                <ImageUploadInput
                                                                    value={customPopupConfig.imageInner.imageUrl}
                                                                    onChange={e => onConfigChange(['popups', 'custom', 'imageInner', 'imageUrl'], e.target.value)}
                                                                    onFileUpload={file => onImageUpload(file, ['popups', 'custom', 'imageInner', 'imageUrl'])}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Largura da Imagem Interna ({customPopupConfig.imageInner.width}%)</Label>
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
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-4 h-4 text-primary/80" />
                                                        <span>Conteúdo do Texto</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <div className="space-y-2">
                                                        <Label>Título</Label>
                                                        <Input type="text" placeholder="Título do Pop-up" value={customPopupConfig.title} onChange={e => onConfigChange(['popups', 'custom', 'title'], e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Descrição</Label>
                                                        <Textarea placeholder="Descrição do pop-up. Você pode usar <b> e <a> tags." value={customPopupConfig.description} onChange={e => onConfigChange(['popups', 'custom', 'description'], e.target.value)} className="text-sm h-24" />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Countdown Timer */}
                                            <AccordionItem value="countdown">
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                                    <div className="flex items-center gap-3">
                                                    <Timer className="w-4 h-4 text-primary/80" />
                                                    <span>Contador Regressivo</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <SettingsToggle label="Ativar Contador" checked={customPopupConfig.countdown.active} onCheckedChange={checked => onConfigChange(['popups', 'custom', 'countdown', 'active'], checked)} />
                                                    {customPopupConfig.countdown.active && (
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label>Tempo (HH:MM:SS)</Label>
                                                                <Input type="text" placeholder="00:15:00" value={customPopupConfig.countdown.time} onChange={e => onConfigChange(['popups', 'custom', 'countdown', 'time'], e.target.value)} />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Posição</Label>
                                                                <Select value={customPopupConfig.countdown.position} onValueChange={value => onConfigChange(['popups', 'custom', 'countdown', 'position'], value)}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="aboveTitle">Acima do Título</SelectItem>
                                                                        <SelectItem value="belowText">Abaixo do Texto</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Estilo</Label>
                                                                <Select value={customPopupConfig.countdown.style} onValueChange={value => onConfigChange(['popups', 'custom', 'countdown', 'style'], value)}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="style1">Simples</SelectItem>
                                                                        <SelectItem value="style2">Em caixas</SelectItem>
                                                                        <SelectItem value="style3">Círculos</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Tamanho da Fonte ({customPopupConfig.countdown.fontSize}px)</Label>
                                                                <SliderWithControls
                                                                    value={[customPopupConfig.countdown.fontSize]}
                                                                    onValueChange={(value) => onConfigChange(['popups', 'custom', 'countdown', 'fontSize'], value[0])}
                                                                    min={12}
                                                                    max={48}
                                                                    step={1}
                                                                />
                                                            </div>
                                                            <ColorInput label="Cor do Contador" value={customPopupConfig.countdown.color} onChange={e => onConfigChange(['popups', 'custom', 'countdown', 'color'], e.target.value)} />
                                                            {(customPopupConfig.countdown.style === 'style2' || customPopupConfig.countdown.style === 'style3') && (
                                                                <ColorInput label="Cor da Caixa" value={customPopupConfig.countdown.boxColor} onChange={e => onConfigChange(['popups', 'custom', 'countdown', 'boxColor'], e.target.value)} />
                                                            )}
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Buttons */}
                                            <AccordionItem value="buttons">
                                                <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                                    <div className="flex items-center gap-3">
                                                    <Settings className="w-4 h-4 text-primary/80" />
                                                    <span>Botões</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-4 space-y-4 px-3">
                                                    <div className="space-y-2">
                                                        <Label>Texto do Botão Principal</Label>
                                                        <Input type="text" placeholder="Texto do Botão Principal" value={customPopupConfig.buttonText} onChange={e => onConfigChange(['popups', 'custom', 'buttonText'], e.target.value)} />
                                                    </div>
                                                    <div className="p-3 border rounded-md space-y-3">
                                                        <SettingsToggle label="Ativar Botão Secundário" checked={customPopupConfig.secondButton.active} onCheckedChange={checked => onConfigChange(['popups', 'custom', 'secondButton', 'active'], checked)} />
                                                        {customPopupConfig.secondButton.active && (
                                                            <div className="pt-3 border-t space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label>Texto do Botão Secundário</Label>
                                                                    <Input type="text" placeholder="Texto do Botão Secundário" value={customPopupConfig.secondButton.text} onChange={e => onConfigChange(['popups', 'custom', 'secondButton', 'text'], e.target.value)} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Link do Botão Secundário</Label>
                                                                    <Input type="text" placeholder="https://link-secundario.com" value={customPopupConfig.secondButton.link} onChange={e => onConfigChange(['popups', 'custom', 'secondButton', 'link'], e.target.value)} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Tipo de Botão</Label>
                                                                    <Select value={customPopupConfig.secondButton.style} onValueChange={value => onConfigChange(['popups', 'custom', 'secondButton', 'style'], value)}>
                                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="filled">Normal</SelectItem>
                                                                            <SelectItem value="outline">Contorno</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                {customPopupConfig.secondButton.style === 'outline' && (
                                                                    <div className="space-y-2">
                                                                        <Label>Largura do Contorno ({customPopupConfig.secondButton.outlineWidth}px)</Label>
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
                                                                    <Label>Largura do Botão Secundário ({customPopupConfig.secondButton.width}%)</Label>
                                                                    <SliderWithControls
                                                                        value={[customPopupConfig.secondButton.width]}
                                                                        onValueChange={(value) => onConfigChange(['popups', 'custom', 'secondButton', 'width'], value[0])}
                                                                        min={10}
                                                                        max={100}
                                                                        step={1}
                                                                    />
                                                                </div>
                                                                <div className="space-y-3 pt-2">
                                                                    <ColorInput label="Cor Principal" value={customPopupConfig.secondButton.color} onChange={e => onConfigChange(['popups', 'custom', 'secondButton', 'color'], e.target.value)} />
                                                                    <ColorInput label="Cor do Texto" value={customPopupConfig.secondButton.textColor} onChange={e => onConfigChange(['popups', 'custom', 'secondButton', 'textColor'], e.target.value)} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Alinhamento dos Botões</Label>
                                                        <Select value={customPopupConfig.buttonsAlignment} onValueChange={value => onConfigChange(['popups', 'custom', 'buttonsAlignment'], value)}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="vertical">Vertical</SelectItem>
                                                                <SelectItem value="horizontal">Horizontal</SelectItem>
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
                    
                     <AccordionItem value="content" className="accordion-item-styling border-b">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">Conteúdo e SEO</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4 px-4">
                            <div className="p-3 border rounded-md space-y-3">
                                <SettingsToggle label="Rodapé" checked={pageConfig.footer.active} onCheckedChange={checked => onConfigChange(['footer', 'active'], checked)} />
                                {pageConfig.footer.active && (
                                    <>
                                        <Input type="text" placeholder="Link Política de Privacidade" value={pageConfig.footer.privacyLink} onChange={e => onConfigChange(['footer', 'privacyLink'], e.target.value)} />
                                        <Input type="text" placeholder="Link Termos de Uso" value={pageConfig.footer.termsLink} onChange={e => onConfigChange(['footer', 'termsLink'], e.target.value)} />
                                        <div className="space-y-3 pt-2">
                                            <ColorInput label="Cor do Fundo" value={pageConfig.footer.backgroundColor} onChange={e => onConfigChange(['footer', 'backgroundColor'], e.target.value)} />
                                            <ColorInput label="Cor do Texto" value={pageConfig.footer.textColor} onChange={e => onConfigChange(['footer', 'textColor'], e.target.value)} />
                                        </div>
                                    </>
                                )}
                            </div>
                             <div className="p-3 border rounded-md space-y-3">
                                <SettingsToggle label="Seção Disclaimer" checked={pageConfig.disclaimer.active} onCheckedChange={checked => onConfigChange(['disclaimer', 'active'], checked)} />
                                {pageConfig.disclaimer.active && (
                                    <>
                                        <Textarea value={pageConfig.disclaimer.text} onChange={e => onConfigChange(['disclaimer', 'text'], e.target.value)} className="text-sm h-24" />
                                        <div className="space-y-3 pt-2">
                                            <ColorInput label="Cor do Fundo" value={pageConfig.disclaimer.backgroundColor} onChange={e => onConfigChange(['disclaimer', 'backgroundColor'], e.target.value)} />
                                            <ColorInput label="Cor do Texto" value={pageConfig.disclaimer.textColor} onChange={e => onConfigChange(['disclaimer', 'textColor'], e.target.value)} />
                                        </div>
                                    </>
                                )}
                            </div>
                             <Accordion type="single" collapsible className="w-full space-y-2">
                                <AccordionItem value="seo" className="border-b-0">
                                  <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-primary/80" />
                                        <h3 className='font-semibold text-sm'>SEO e Metadados</h3>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pt-4 mt-2 border-t space-y-4 px-3">
                                    {pageConfig.seo && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="pageTitle">Título da Página</Label>
                                                <Input id="pageTitle" type="text" placeholder="Título que aparece na aba" value={pageConfig.seo.title} onChange={e => onConfigChange(['seo', 'title'], e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pageDescription">Descrição da Página (Meta Description)</Label>
                                                <Textarea id="pageDescription" placeholder="Descrição para os motores de busca" value={pageConfig.seo.description} onChange={e => onConfigChange(['seo', 'description'], e.target.value)} className="h-20" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="faviconUrl">URL do Favicon</Label>
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
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="configuracao" className="accordion-item-styling border-b">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Settings className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">Configuração Avançada</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-2 px-4">
                            <div className="space-y-3 p-3 border border-destructive/30 bg-destructive/5 rounded-md text-destructive">
                                <div className="flex items-start gap-2">
                                     <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                     <div className="flex-1">
                                        <SettingsToggle 
                                            label="Clique Total na Página" 
                                            checked={pageConfig.fullPageClick}
                                            onCheckedChange={checked => onConfigChange(['fullPageClick'], checked)}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-center" side="top">
                                                    <p>Ao ativar, qualquer clique na página redireciona para o link de afiliado. Use com cuidado, pois pode impactar negativamente a experiência do usuário e as métricas de suas campanhas.</p>
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
                                            label="Redirecionamento Automático" 
                                            checked={pageConfig.autoRedirect.active} 
                                            onCheckedChange={checked => onConfigChange(['autoRedirect', 'active'], checked)}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-center" side="top">
                                                    <p>O redirecionamento automático pode afetar a experiência do usuário e as taxas de rejeição. Use com moderação.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </SettingsToggle>
                                    </div>
                                </div>
                                {pageConfig.autoRedirect.active && (
                                    <div className="pt-4 space-y-2 border-t mt-4 border-destructive/30">
                                        <Label className="text-foreground">Tempo ({pageConfig.autoRedirect.time}s)</Label>
                                        <input type="range" min="3" max="8" step="1" value={pageConfig.autoRedirect.time} onChange={e => onConfigChange(['autoRedirect', 'time'], Number(e.target.value))} />
                                    </div>
                                )}
                            </div>
                             <div className="space-y-3 p-3 border border-destructive/30 bg-destructive/5 rounded-md text-destructive">
                                <div className="flex items-start gap-2">
                                     <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                     <div className="flex-1">
                                        <SettingsToggle 
                                            label="HTML Personalizado" 
                                            checked={!!pageConfig.customization.customHtml}
                                            onCheckedChange={(checked) => onConfigChange(['customization', 'customHtml'], checked ? ' ' : '')}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-center" side="top">
                                                    <p>Ao utilizar este recurso, dependendo do uso, você pode sofrer bloqueios em suas contas de anúncios (Facebook Ads, Google Ads) ou danificar a página gerada. Use com conhecimento.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </SettingsToggle>
                                     </div>
                                </div>
                                {!!pageConfig.customization.customHtml && (
                                    <Textarea placeholder="<style>...</style> ou <script>...</script>" value={pageConfig.customization.customHtml} onChange={e => onConfigChange(['customization', 'customHtml'], e.target.value)} className="text-sm h-32 font-mono bg-background/50 border-destructive/20 focus-visible:ring-destructive" />
                                )}
                            </div>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                <AccordionItem value="tracking" className="border-b-0">
                                    <div className="p-3 border rounded-md">
                                        <AccordionTrigger className="hover:no-underline p-0 w-full justify-start">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4" />
                                                <h3 className='font-semibold text-sm'>Rastreamento</h3>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 mt-2 border-t space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="facebookPixelId">ID do Pixel do Facebook</Label>
                                                <Input 
                                                    id="facebookPixelId"
                                                    type="text" 
                                                    placeholder="Cole apenas o número de ID do seu Pixel" 
                                                    value={pageConfig.tracking.facebookPixelId} 
                                                    onChange={e => onConfigChange(['tracking', 'facebookPixelId'], e.target.value)}
                                                />
                                                <p className='text-xs text-muted-foreground'>Irá disparar um evento de PageView.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="googleAdsId">ID da Tag do Google (Google Ads)</Label>
                                                <Input 
                                                    id="googleAdsId"
                                                    type="text" 
                                                    placeholder="Ex: AW-123456789" 
                                                    value={pageConfig.tracking.googleAdsId} 
                                                    onChange={e => onConfigChange(['tracking', 'googleAdsId'], e.target.value)}
                                                />
                                                <p className='text-xs text-muted-foreground'>Irá configurar sua tag para remarketing (equivale a um PageView).</p>
                                            </div>
                                        </AccordionContent>
                                    </div>
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
                                <span className="font-semibold">Opções do Pop-up</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4 px-4">
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                <AccordionItem value="button-config">
                                     <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                        <div className="flex items-center gap-3">
                                            <Brush className="w-4 h-4 text-primary/80" />
                                            <span>Configuração do Botão</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label>Tipo de Botão</Label>
                                            <Select value={pageConfig.customization.button.style} onValueChange={value => onConfigChange(['customization', 'button', 'style'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="filled">Normal</SelectItem>
                                                    <SelectItem value="outline">Contorno</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {pageConfig.customization.button.style === 'outline' && (
                                            <div className="space-y-2">
                                                <Label>Largura do Contorno ({pageConfig.customization.button.outlineWidth}px)</Label>
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
                                            <ColorInput label="Cor Principal" value={pageConfig.customization.button.color} onChange={e => onConfigChange(['customization', 'button', 'color'], e.target.value)} />
                                            <ColorInput label="Cor do Texto" value={pageConfig.customization.button.textColor} onChange={e => onConfigChange(['customization', 'button', 'textColor'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Largura do Botão ({pageConfig.customization.button.width}%)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.button.width]}
                                                onValueChange={(value) => onConfigChange(['customization', 'button', 'width'], value[0])}
                                                min={10}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                         <div className="space-y-2">
                                            <Label>Alinhamento do Botão</Label>
                                            <Select value={pageConfig.customization.button.alignment} onValueChange={value => onConfigChange(['customization', 'button', 'alignment'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="left">Esquerda</SelectItem>
                                                    <SelectItem value="center">Centro</SelectItem>
                                                    <SelectItem value="right">Direita</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Raio da Borda ({pageConfig.customization.button.borderRadius}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.button.borderRadius]}
                                                onValueChange={(value) => onConfigChange(['customization', 'button', 'borderRadius'], value[0])}
                                                min={0}
                                                max={30}
                                                step={1}
                                            />
                                        </div>
                                        <div className="p-3 border rounded-md">
                                            <SettingsToggle label="Sombra do Botão" checked={pageConfig.customization.button.shadow.active} onCheckedChange={checked => onConfigChange(['customization', 'button', 'shadow', 'active'], checked)} />
                                            {pageConfig.customization.button.shadow.active && (
                                                <div className="pt-4 space-y-4 border-t mt-4">
                                                    <div className="space-y-2">
                                                        <Label>Intensidade ({pageConfig.customization.button.shadow.intensity}px)</Label>
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
                                     <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                        <div className="flex items-center gap-3">
                                            <Type className="w-4 h-4 text-primary/80" />
                                            <span>Tipografia do Pop-up</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className="space-y-2">
                                            <Label>Fonte</Label>
                                            <Select value={pageConfig.customization.typography.fontFamily} onValueChange={value => onConfigChange(['customization', 'typography', 'fontFamily'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {fontOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3 pt-2">
                                            <ColorInput label="Cor do Título" value={pageConfig.customization.typography.titleColor} onChange={e => onConfigChange(['customization', 'typography', 'titleColor'], e.target.value)} />
                                            <ColorInput label="Cor do Texto" value={pageConfig.customization.typography.textColor} onChange={e => onConfigChange(['customization', 'typography', 'textColor'], e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tamanho do Título ({pageConfig.customization.typography.titleSize}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.typography.titleSize]}
                                                onValueChange={(value) => onConfigChange(['customization', 'typography', 'titleSize'], value[0])}
                                                min={16}
                                                max={48}
                                                step={1}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tamanho do Texto ({pageConfig.customization.typography.textSize}px)</Label>
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
                                <AccordionItem value="popup-style-config">
                                     <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                        <div className="flex items-center gap-3">
                                            <Palette className="w-4 h-4 text-primary/80" />
                                            <span>Estilo do Pop-up</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-6 px-3">
                                        <div className="space-y-2">
                                            <Label>Largura do Pop-up ({pageConfig.customization.popup.maxWidth}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.maxWidth]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'maxWidth'], value[0])}
                                                min={200}
                                                max={1000}
                                                step={10}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Espaçamento Vertical ({pageConfig.customization.popup.paddingY}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.paddingY]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'paddingY'], value[0])}
                                                min={0}
                                                max={128}
                                                step={4}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Espaçamento Horizontal ({pageConfig.customization.popup.paddingX}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.paddingX]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'paddingX'], value[0])}
                                                min={0}
                                                max={64}
                                                step={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Espaçamento Geral ({pageConfig.customization.popup.gap}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.gap]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'gap'], value[0])}
                                                min={0}
                                                max={48}
                                                step={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Espaçamento do Título ({pageConfig.customization.popup.titleBottomMargin}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.titleBottomMargin]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'titleBottomMargin'], value[0])}
                                                min={0}
                                                max={48}
                                                step={2}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Espaçamento da Descrição ({pageConfig.customization.popup.descriptionBottomMargin}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.descriptionBottomMargin]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'descriptionBottomMargin'], value[0])}
                                                min={0}
                                                max={48}
                                                step={2}
                                            />
                                        </div>
                                         <div className="space-y-2">
                                            <Label>Arredondamento da Borda ({pageConfig.customization.popup.borderRadius}px)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popup.borderRadius]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popup', 'borderRadius'], value[0])}
                                                min={0}
                                                max={40}
                                                step={2}
                                            />
                                        </div>

                                        <div className="space-y-3 pt-2">
                                             <ColorInput label="Cor do Fundo do Pop-up" value={pageConfig.customization.popup.backgroundColor} onChange={e => onConfigChange(['customization', 'popup', 'backgroundColor'], e.target.value)} />
                                        </div>
                                         <div className="p-3 border rounded-md">
                                            <SettingsToggle label="Contorno do Pop-up" checked={pageConfig.customization.popupContour.active} onCheckedChange={checked => onConfigChange(['customization', 'popupContour', 'active'], checked)} />
                                            {pageConfig.customization.popupContour.active && (
                                                <div className="pt-4 space-y-6 border-t mt-4">
                                                    <div className="space-y-3">
                                                        <ColorInput label="Cor do Contorno" value={pageConfig.customization.popupContour.color} onChange={e => onConfigChange(['customization', 'popupContour', 'color'], e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Largura ({pageConfig.customization.popupContour.width}px)</Label>
                                                        <SliderWithControls
                                                            value={[pageConfig.customization.popupContour.width]}
                                                            onValueChange={(value) => onConfigChange(['customization', 'popupContour', 'width'], value[0])}
                                                            min={1}
                                                            max={10}
                                                            step={1}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Estilo do Contorno</Label>
                                                        <Select value={pageConfig.customization.popupContour.style} onValueChange={value => onConfigChange(['customization', 'popupContour', 'style'], value)}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="solid">Sólido</SelectItem>
                                                                <SelectItem value="dashed">Tracejado</SelectItem>
                                                                <SelectItem value="dotted">Pontilhado</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 border rounded-md">
                                            <SettingsToggle label="Sombra do Pop-up" checked={pageConfig.customization.shadow.active} onCheckedChange={checked => onConfigChange(['customization', 'shadow', 'active'], checked)} />
                                            {pageConfig.customization.shadow.active && (
                                                <div className="pt-4 space-y-4 border-t mt-4">
                                                    <div className="space-y-2">
                                                        <Label>Intensidade ({pageConfig.customization.shadow.intensity}px)</Label>
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
                                    <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                        <div className="flex items-center gap-3">
                                            <Settings className="w-4 h-4 text-primary/80" />
                                            <span>Comportamento e Animação</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-6 px-3">
                                        <div className="space-y-2">
                                            <Label>Posição do Pop-up</Label>
                                            <Select value={pageConfig.customization.popupPosition} onValueChange={value => onConfigChange(['customization', 'popupPosition'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="top">Topo</SelectItem>
                                                    <SelectItem value="center">Centro da Tela</SelectItem>
                                                    <SelectItem value="bottom">Inferior</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Animação do Pop-up</Label>
                                            <Select value={pageConfig.customization.popupAnimation} onValueChange={value => onConfigChange(['customization', 'popupAnimation'], value)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {animationOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Duração da Animação ({pageConfig.customization.popupAnimationDuration}s)</Label>
                                            <SliderWithControls
                                                value={[pageConfig.customization.popupAnimationDuration]}
                                                onValueChange={(value) => onConfigChange(['customization', 'popupAnimationDuration'], value[0])}
                                                min={0.1}
                                                max={2}
                                                step={0.1}
                                            />
                                        </div>
                                        <div className="p-3 border rounded-md space-y-3">
                                            <SettingsToggle label="Mostrar botão de fechar" checked={pageConfig.customization.showCloseButton} onCheckedChange={checked => onConfigChange(['customization', 'showCloseButton'], checked)} />
                                            {pageConfig.customization.showCloseButton && (
                                                <div className="pt-4 space-y-3 border-t mt-4">
                                                    <ColorInput label="Cor do Botão de Fechar" value={pageConfig.customization.closeButtonColor} onChange={e => onConfigChange(['customization', 'closeButtonColor'], e.target.value)} />
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
        </TooltipProvider>
    );
}

    

    

    

    
