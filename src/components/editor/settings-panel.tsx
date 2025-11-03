
"use client";

import React from 'react';
import type { PageConfig } from '@/lib/definitions';
import { languageOptions } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, MessageSquare, LayoutPanelLeft, Settings2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageUploadInput } from './image-upload-input';
import type { ViewMode } from '@/app/(protected)/editor/page';
import { SliderWithControls } from './slider-with-controls';


interface SettingsPanelProps {
    pageConfig: PageConfig;
    onConfigChange: (keys: (string | number)[], value: any) => void;
    onImageUpload: (file: File, keys: (string | number)[]) => void;
    setViewMode: (mode: ViewMode) => void;
}

const SettingsToggle = ({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <div className="flex items-center justify-between rounded-lg py-2">
        <Label className="font-normal">{label}</Label>
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


export function SettingsPanel({ pageConfig, onConfigChange, onImageUpload, setViewMode }: SettingsPanelProps) {
    return (
        <>
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Configurações da Página</h2>
            </div>
            <ScrollArea className="flex-grow">
                <Accordion type="multiple" defaultValue={['layout']} className="w-full">
                    
                    <AccordionItem value="layout">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <LayoutPanelLeft className="w-5 h-5 text-primary" />
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
                                                max={50}
                                                step={1}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="popups">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Pop-ups</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 px-4">
                            <Accordion type="multiple" className="w-full space-y-2">
                                <div className="p-3 border rounded-md space-y-3">
                                    <SettingsToggle label="Pop-up de Cookies" checked={pageConfig.popups.cookies.active} onCheckedChange={checked => onConfigChange(['popups', 'cookies', 'active'], checked)} />
                                    {pageConfig.popups.cookies.active && (
                                      <>
                                        <Textarea value={pageConfig.popups.cookies.message} onChange={e => onConfigChange(['popups', 'cookies', 'message'], e.target.value)} className="text-sm h-24" />
                                        <div className="space-y-2">
                                            <Label>Texto do Botão</Label>
                                            <Input type="text" placeholder="Texto do Botão" value={pageConfig.popups.cookies.buttonText} onChange={e => onConfigChange(['popups', 'cookies', 'buttonText'], e.target.value)} />
                                        </div>
                                      </>
                                    )}
                                </div>
                                <div className="p-3 border rounded-md">
                                    <SettingsToggle label="Pop-up Verificação de Idade" checked={pageConfig.popups.ageVerification.active} onCheckedChange={checked => onConfigChange(['popups', 'ageVerification', 'active'], checked)} />
                                </div>
                                <div className="p-3 border rounded-md space-y-3">
                                    <SettingsToggle label="Pop-up de Escolha" checked={pageConfig.popups.choice.active} onCheckedChange={checked => onConfigChange(['popups', 'choice', 'active'], checked)} />
                                    {pageConfig.popups.choice.active && (
                                        <>
                                            <Input type="text" placeholder="Título do Pop-up" value={pageConfig.popups.choice.title} onChange={e => onConfigChange(['popups', 'choice', 'title'], e.target.value)} />
                                            <Textarea placeholder="Descrição do Pop-up" value={pageConfig.popups.choice.description} onChange={e => onConfigChange(['popups', 'choice', 'description'], e.target.value)} className="text-sm h-24" />
                                            <div className='space-y-2'>
                                                <Label>Imagem 1 (URL)</Label>
                                                <ImageUploadInput
                                                    value={pageConfig.popups.choice.image1Url}
                                                    onChange={e => onConfigChange(['popups', 'choice', 'image1Url'], e.target.value)}
                                                    onFileUpload={file => onImageUpload(file, ['popups', 'choice', 'image1Url'])}
                                                />
                                            </div>
                                             <div className='space-y-2'>
                                                <Label>Imagem 2 (URL)</Label>
                                                <ImageUploadInput
                                                    value={pageConfig.popups.choice.image2Url}
                                                    onChange={e => onConfigChange(['popups', 'choice', 'image2Url'], e.target.value)}
                                                    onFileUpload={file => onImageUpload(file, ['popups', 'choice', 'image2Url'])}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                 <div className="p-3 border rounded-md space-y-3">
                                    <SettingsToggle label="Pop-up Captcha" checked={pageConfig.popups.captcha.active} onCheckedChange={checked => onConfigChange(['popups', 'captcha', 'active'], checked)} />
                                    {pageConfig.popups.captcha.active && (
                                        <>
                                            <Input type="text" placeholder="Título do Pop-up" value={pageConfig.popups.captcha.title} onChange={e => onConfigChange(['popups', 'captcha', 'title'], e.target.value)} />
                                            <Textarea placeholder="Descrição do Pop-up" value={pageConfig.popups.captcha.description} onChange={e => onConfigChange(['popups', 'captcha', 'description'], e.target.value)} className="text-sm h-24" />
                                        </>
                                    )}
                                </div>
                                <div className="p-3 border rounded-md space-y-3">
                                    <SettingsToggle label="Pop-up de Desconto" checked={pageConfig.popups.discount.active} onCheckedChange={checked => onConfigChange(['popups', 'discount', 'active'], checked)} />
                                    {pageConfig.popups.discount.active && (
                                        <>
                                            <Input type="text" placeholder="Texto do desconto" value={pageConfig.popups.discount.text} onChange={e => onConfigChange(['popups', 'discount', 'text'], e.target.value)} />
                                            <SettingsToggle label="Mostrar Ícone" checked={pageConfig.popups.discount.icon} onCheckedChange={checked => onConfigChange(['popups', 'discount', 'icon'], checked)} />
                                        </>
                                    )}
                                </div>
                                <div className="p-3 border rounded-md space-y-3">
                                    <SettingsToggle label="Pop-up de Saída" checked={pageConfig.popups.exit.active} onCheckedChange={checked => onConfigChange(['popups', 'exit', 'active'], checked)} />
                                    {pageConfig.popups.exit.active && (
                                        <>
                                            <div className='space-y-2'>
                                                <Label>Imagem (16:9)</Label>
                                                <ImageUploadInput
                                                    value={pageConfig.popups.exit.imageUrl}
                                                    onChange={e => onConfigChange(['popups', 'exit', 'imageUrl'], e.target.value)}
                                                    onFileUpload={file => onImageUpload(file, ['popups', 'exit', 'imageUrl'])}
                                                />
                                            </div>
                                            <Input type="text" placeholder="Link de Redirecionamento (Opcional)" value={pageConfig.popups.exit.redirectLink} onChange={e => onConfigChange(['popups', 'exit', 'redirectLink'], e.target.value)} />
                                        </>
                                    )}
                                </div>
                                <div className="p-3 border rounded-md space-y-3">
                                    <SettingsToggle label="Pop-up Personalizado" checked={pageConfig.popups.custom.active} onCheckedChange={checked => onConfigChange(['popups', 'custom', 'active'], checked)} />
                                    {pageConfig.popups.custom.active && (
                                        <>
                                            <Input type="text" placeholder="Título do Pop-up" value={pageConfig.popups.custom.title} onChange={e => onConfigChange(['popups', 'custom', 'title'], e.target.value)} />
                                            <Textarea placeholder="Descrição do Pop-up" value={pageConfig.popups.custom.description} onChange={e => onConfigChange(['popups', 'custom', 'description'], e.target.value)} className="text-sm h-24" />
                                            <Input type="text" placeholder="Texto do Botão" value={pageConfig.popups.custom.buttonText} onChange={e => onConfigChange(['popups', 'custom', 'buttonText'], e.target.value)} />
                                        </>
                                    )}
                                </div>
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                    
                     <AccordionItem value="content">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Conteúdo</span>
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
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="advanced">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <Settings2 className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Configurações Avançadas</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4 px-4">
                            <div className="p-3 border rounded-md">
                                <SettingsToggle label="Redirecionamento Automático" checked={pageConfig.autoRedirect.active} onCheckedChange={checked => onConfigChange(['autoRedirect', 'active'], checked)} />
                                {pageConfig.autoRedirect.active && (
                                    <div className="pt-4 space-y-2 border-t mt-4">
                                        <Label>Tempo ({pageConfig.autoRedirect.time}s)</Label>
                                        <input type="range" min="5" max="15" step="1" value={pageConfig.autoRedirect.time} onChange={e => onConfigChange(['autoRedirect', 'time'], Number(e.target.value))} />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Idioma da Página</Label>
                                <Select value={pageConfig.customization.language} onValueChange={value => onConfigChange(['customization', 'language'], value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {languageOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3 pt-2">
                                <ColorInput label="Cor dos Botões" value={pageConfig.customization.buttonColor} onChange={e => onConfigChange(['customization', 'buttonColor'], e.target.value)} />
                            </div>
                             <div className="space-y-3 pt-2">
                                <ColorInput label="Cor do Fundo do Pop-up" value={pageConfig.customization.popupColor} onChange={e => onConfigChange(['customization', 'popupColor'], e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Posição do Pop-up</Label>
                                <Select value={pageConfig.customization.popupPosition} onValueChange={value => onConfigChange(['customization', 'popupPosition'], value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="center">Centro da Tela</SelectItem>
                                        <SelectItem value="bottom">Inferior</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <SettingsToggle label="HTML Personalizado" checked={!!pageConfig.customization.customHtml} onCheckedChange={checked => onConfigChange(['customization', 'customHtml'], checked ? '&lt;!-- Seu código aqui --&gt;' : '')} />
                                {pageConfig.customization.customHtml !== '' && <Textarea placeholder="&lt;style&gt;...&lt;/style&gt; ou &lt;script&gt;...&lt;/script&gt;" value={pageConfig.customization.customHtml} onChange={e => onConfigChange(['customization', 'customHtml'], e.target.value)} className="text-sm h-32 font-mono" />}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
        </>
    );
}

    
