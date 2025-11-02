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
import { Code, Image as ImageIcon, Link as LinkIcon, MessageSquare, Sparkles } from 'lucide-react';

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
        <div className="flex-grow overflow-y-auto px-4">
            <Accordion type="single" defaultValue="image" collapsible className="w-full">
                <AccordionItem value="image" className="border-b-0">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Imagens e Layout</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-4">
                        <div>
                            <Button onClick={onSuggestLayout} disabled={isSuggestingLayout} size="sm" className="w-full mb-4">
                                {isSuggestingLayout ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Sugerir Layout com IA
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Imagem Desktop (URL)</Label>
                            <Input type="text" value={pageConfig.desktopImage} onChange={e => onConfigChange(['desktopImage'], e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Altura Desktop ({pageConfig.imageHeightDesktop}px)</Label>
                            <input type="range" min="100" max="2000" step="10" value={pageConfig.imageHeightDesktop} onChange={e => onConfigChange(['imageHeightDesktop'], Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Imagem Mobile (URL)</Label>
                            <Input type="text" value={pageConfig.mobileImage} onChange={e => onConfigChange(['mobileImage'], e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Altura Mobile ({pageConfig.imageHeightMobile}px)</Label>
                            <input type="range" min="100" max="2000" step="10" value={pageConfig.imageHeightMobile} onChange={e => onConfigChange(['imageHeightMobile'], Number(e.target.value))} />
                        </div>
                        <SettingsToggle label="Sobreposição Escura" checked={pageConfig.overlay.active} onCheckedChange={checked => onConfigChange(['overlay', 'active'], checked)} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="redirect" className="border-b-0">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <LinkIcon className="w-5 h-5 text-green-500" />
                            <span className="font-semibold">Redirecionamento</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-4">
                        <div className="space-y-2">
                            <Label>Link de Afiliado (Obrigatório)</Label>
                            <Input type="text" placeholder="https://seu-link.com" value={pageConfig.affiliateLink} onChange={e => onConfigChange(['affiliateLink'], e.target.value)} />
                        </div>
                        <SettingsToggle label="Redirecionamento Automático" checked={pageConfig.autoRedirect.active} onCheckedChange={checked => onConfigChange(['autoRedirect', 'active'], checked)} />
                        {pageConfig.autoRedirect.active && (
                            <div className="space-y-2">
                                <Label>Tempo ({pageConfig.autoRedirect.time}s)</Label>
                                <input type="range" min="5" max="15" step="1" value={pageConfig.autoRedirect.time} onChange={e => onConfigChange(['autoRedirect', 'time'], Number(e.target.value))} />
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="popups" className="border-b-0">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold">Pop-ups e Elementos</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-4">
                        <div className="p-3 border rounded-md space-y-3">
                            <SettingsToggle label="Pop-up de Cookies" checked={pageConfig.popups.cookies.active} onCheckedChange={checked => onConfigChange(['popups', 'cookies', 'active'], checked)} />
                            {pageConfig.popups.cookies.active && <Textarea value={pageConfig.popups.cookies.message} onChange={e => onConfigChange(['popups', 'cookies', 'message'], e.target.value)} className="text-sm h-24" />}
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
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <Code className="w-5 h-5 text-red-500" />
                            <span className="font-semibold">Personalização Avançada</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-4">
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
    );
}
