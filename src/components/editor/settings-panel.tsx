

"use client";

import React from 'react';
import type { PageConfig } from '@/lib/definitions';
import { flagOptions, animationOptions } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, MessageSquare, LayoutPanelLeft, Settings2, Settings, Brush } from 'lucide-react';
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
                <Accordion type="multiple" className="w-full">
                    
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
                                     {pageConfig.popups.ageVerification.active && (
                                        <div className="pt-4 space-y-4 border-t mt-4">
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
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border rounded-md space-y-3">
                                    <SettingsToggle label="Pop-up de Escolha" checked={pageConfig.popups.choice.active} onCheckedChange={checked => onConfigChange(['popups', 'choice', 'active'], checked)} />
                                    {pageConfig.popups.choice.active && (
                                        <>
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
                                            <Textarea placeholder="Descrição da oferta" value={pageConfig.popups.discount.description} onChange={e => onConfigChange(['popups', 'discount', 'description'], e.target.value)} className="text-sm h-24" />
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
                            <Accordion type="multiple" className="w-full space-y-2">
                                <AccordionItem value="button-config">
                                     <AccordionTrigger className="hover:no-underline p-3 border rounded-md font-semibold text-sm">
                                        <div className="flex items-center gap-3">
                                            <Brush className="w-4 h-4 text-primary/80" />
                                            <span>Configuração do Botão</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4 px-3">
                                        <div className="space-y-3 pt-2">
                                            <ColorInput label="Cor do Botão" value={pageConfig.customization.button.color} onChange={e => onConfigChange(['customization', 'button', 'color'], e.target.value)} />
                                            <ColorInput label="Cor do Texto do Botão" value={pageConfig.customization.button.textColor} onChange={e => onConfigChange(['customization', 'button', 'textColor'], e.target.value)} />
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
                            </Accordion>
                            <div className="space-y-3 pt-2">
                                <ColorInput label="Cor do Fundo do Pop-up" value={pageConfig.customization.popupColor} onChange={e => onConfigChange(['customization', 'popupColor'], e.target.value)} />
                            </div>
                             <div className="space-y-3 pt-2">
                                <SettingsToggle label="Mostrar botão de fechar nos pop-ups" checked={pageConfig.customization.showCloseButton} onCheckedChange={checked => onConfigChange(['customization', 'showCloseButton'], checked)} />
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
                    <AccordionItem value="configuracao">
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Configuração</span>
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
                            <div className="space-y-3 p-3 border rounded-md">
                                <SettingsToggle label="HTML Personalizado" checked={!!pageConfig.customization.customHtml} onCheckedChange={checked => onConfigChange(['customization', 'customHtml'], checked ? '<!-- Seu código aqui -->' : '')} />
                                {pageConfig.customization.customHtml !== '' && <Textarea placeholder="<style>...</style> ou <script>...</script>" value={pageConfig.customization.customHtml} onChange={e => onConfigChange(['customization', 'customHtml'], e.target.value)} className="text-sm h-32 font-mono" />}
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
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
        </>
    );
}
