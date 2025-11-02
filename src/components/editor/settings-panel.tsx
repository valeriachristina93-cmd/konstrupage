
"use client";

import React from 'react';
import type { PageConfig } from '@/lib/definitions';
import { buttonColorOptions, popupColorOptions, languageOptions } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Code, Image as ImageIcon, Link as LinkIcon, MessageSquare, Sparkles, LayoutPanelLeft, FileText, Settings2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsPanelProps {
    pageConfig: PageConfig;
    onConfigChange: (keys: string[], value: any) => void;
    onSuggestLayout: () => void;
    isSuggestingLayout: boolean;
}

const SettingsToggle = ({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <div className="flex items-center justify-between rounded-lg py-2">
        <Label className="font-normal">{label}</Label>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
);

export function SettingsPanel({ pageConfig, onConfigChange, onSuggestLayout, isSuggestingLayout }: SettingsPanelProps) {
    return (
        <div className="flex flex-col bg-background shadow-sm h-full border-r">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Configurações da Página</h2>
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-4">
                <Accordion type="multiple" defaultValue={['layout']} className="w-full">
                    
                    <AccordionItem value="layout" className="border-b-0 mb-2">
                        <AccordionTrigger className="hover:no-underline rounded-md bg-muted/50 px-3">
                            <div className="flex items-center gap-3">
                                <LayoutPanelLeft className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Layout e Elementos</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="affiliateLink">Link de Afiliado <span className="text-red-500">(Obrigatório)</span></Label>
                                <Input 
                                    id="affiliateLink"
                                    type="text" 
                                    placeholder="https://seu-link.com" 
                                    value={pageConfig.affiliateLink} 
                                    onChange={e => onConfigChange(['affiliateLink'], e.target.value)}
                                    className={!pageConfig.affiliateLink ? 'ring-2 ring-destructive/50' : ''}
                                />
                            </div>
                            <div className="space-y-4 p-3 border border-primary/20 bg-primary/5 rounded-md">
                                <div className="space-y-2">
                                    <Label>Imagem Desktop (URL)</Label>
                                    <Input type="text" value={pageConfig.desktopImage} onChange={e => onConfigChange(['desktopImage'], e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Imagem Mobile (URL)</Label>
                                    <Input type="text" value={pageConfig.mobileImage} onChange={e => onConfigChange(['mobileImage'], e.target.value)} />
                                </div>
                            </div>
                           
                            <div className="space-y-2">
                                <Label>Altura Desktop ({pageConfig.imageHeightDesktop}px)</Label>
                                <input type="range" min="100" max="2000" step="10" value={pageConfig.imageHeightDesktop} onChange={e => onConfigChange(['imageHeightDesktop'], Number(e.target.value))} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Altura Mobile ({pageConfig.imageHeightMobile}px)</Label>
                                <input type="range" min="100" max="2000" step="10" value={pageConfig.imageHeightMobile} onChange={e => onConfigChange(['imageHeightMobile'], Number(e.target.value))} />
                            </div>

                             <Accordion type="multiple" className="w-full space-y-2">
                                <AccordionItem value="overlay" className="p-3 border rounded-md">
                                    <AccordionTrigger className="p-0 hover:no-underline">
                                        <Label>Sobreposição Escura</Label>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4">
                                        <SettingsToggle label="Ativar Sobreposição" checked={pageConfig.overlay.active} onCheckedChange={checked => onConfigChange(['overlay', 'active'], checked)} />
                                    </AccordionContent>
                                </AccordionItem>
                             </Accordion>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="popups" className="border-b-0 mb-2">
                        <AccordionTrigger className="hover:no-underline rounded-md bg-muted/50 px-3">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                <span className="font-semibold">Pop-ups</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            <Accordion type="multiple" className="w-full space-y-2">
                                <div className="p-3 border rounded-md">
                                    <SettingsToggle label="Pop-up de Cookies" checked={pageConfig.popups.cookies.active} onCheckedChange={checked => onConfigChange(['popups', 'cookies', 'active'], checked)} />
                                    {pageConfig.popups.cookies.active && <Textarea value={pageConfig.popups.cookies.message} onChange={e => onConfigChange(['popups', 'cookies', 'message'], e.target.value)} className="text-sm h-24 mt-2" />}
                                </div>
                                <div className="p-3 border rounded-md">
                                    <SettingsToggle label="Pop-up Verificação de Idade" checked={pageConfig.popups.ageVerification.active} onCheckedChange={checked => onConfigChange(['popups', 'ageVerification', 'active'], checked)} />
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
                                            <Input type="text" placeholder="URL da Imagem (16:9)" value={pageConfig.popups.exit.imageUrl} onChange={e => onConfigChange(['popups', 'exit', 'imageUrl'], e.target.value)} />
                                            <Input type="text" placeholder="Link de Redirecionamento (Opcional)" value={pageConfig.popups.exit.redirectLink} onChange={e => onConfigChange(['popups', 'exit', 'redirectLink'], e.target.value)} />
                                        </>
                                    )}
                                </div>
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                    
                     <AccordionItem value="content" className="border-b-0 mb-2">
                        <AccordionTrigger className="hover:no-underline rounded-md bg-muted/50 px-3">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-green-500" />
                                <span className="font-semibold">Conteúdo</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4">
                            <div className="p-3 border rounded-md space-y-3">
                                <SettingsToggle label="Rodapé" checked={pageConfig.footer.active} onCheckedChange={checked => onConfigChange(['footer', 'active'], checked)} />
                                {pageConfig.footer.active && (
                                    <>
                                        <Input type="text" placeholder="Link Política de Privacidade" value={pageConfig.footer.privacyLink} onChange={e => onConfigChange(['footer', 'privacyLink'], e.target.value)} />
                                        <Input type="text" placeholder="Link Termos de Uso" value={pageConfig.footer.termsLink} onChange={e => onConfigChange(['footer', 'termsLink'], e.target.value)} />
                                        <Select value={pageConfig.footer.theme} onValueChange={value => onConfigChange(['footer', 'theme'], value)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dark">Escuro</SelectItem>
                                                <SelectItem value="light">Claro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </>
                                )}
                            </div>
                            <div className="p-3 border rounded-md space-y-3">
                                <SettingsToggle label="Seção Disclaimer" checked={pageConfig.disclaimer.active} onCheckedChange={checked => onConfigChange(['disclaimer', 'active'], checked)} />
                                {pageConfig.disclaimer.active && <Textarea value={pageConfig.disclaimer.text} onChange={e => onConfigChange(['disclaimer', 'text'], e.target.value)} className="text-sm h-24" />}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="advanced" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline rounded-md bg-muted/50 px-3">
                            <div className="flex items-center gap-3">
                                <Settings2 className="w-5 h-5 text-red-500" />
                                <span className="font-semibold">Personalização Avançada</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                            <SettingsToggle label="Redirecionamento Automático" checked={pageConfig.autoRedirect.active} onCheckedChange={checked => onConfigChange(['autoRedirect', 'active'], checked)} />
                            {pageConfig.autoRedirect.active && (
                                <div className="space-y-2">
                                    <Label>Tempo ({pageConfig.autoRedirect.time}s)</Label>
                                    <input type="range" min="5" max="15" step="1" value={pageConfig.autoRedirect.time} onChange={e => onConfigChange(['autoRedirect', 'time'], Number(e.target.value))} />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>Idioma da Página</Label>
                                <Select value={pageConfig.customization.language} onValueChange={value => onConfigChange(['customization', 'language'], value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {languageOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Cor dos Botões</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {buttonColorOptions.map(color => (
                                        <button key={color.value} onClick={() => onConfigChange(['customization', 'buttonColor'], color.value)}
                                            className={`h-8 w-full rounded-md border-2 ${pageConfig.customization.buttonColor === color.value ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : 'border-muted'}`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Cor do Pop-up</Label>
                                <Select value={pageConfig.customization.popupColor} onValueChange={value => onConfigChange(['customization', 'popupColor'], value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {popupColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
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
                                <SettingsToggle label="HTML Personalizado" checked={!!pageConfig.customization.customHtml} onCheckedChange={checked => onConfigChange(['customization', 'customHtml'], checked ? '<!-- Seu código aqui -->' : '')} />
                                {pageConfig.customization.customHtml !== '' && <Textarea placeholder="<style>...</style> ou <script>...</script>" value={pageConfig.customization.customHtml} onChange={e => onConfigChange(['customization', 'customHtml'], e.target.value)} className="text-sm h-32 font-mono" />}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                </div>
            </ScrollArea>
        </div>
    );
}
