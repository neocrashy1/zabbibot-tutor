# Script de configuração automática VS Code - Windows
Write-Host "🎉 Configurando VS Code Automaticamente..." -ForegroundColor Green

# Criar diretório de configuração se não existir
$vscodeDir = "$env:APPDATA\Code\User"
if (!(Test-Path $vscodeDir)) {
    New-Item -ItemType Directory -Path $vscodeDir -Force
}

# Configurações principais (settings.json)
$settingsJson = @"
{
    "ai.enabled": true,
    "editor.inlineSuggest.enabled": true,
    "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": true
    },
    "files.autoSave": "onFocusChange",
    "editor.minimap.enabled": true,
    "workbench.editor.highlightModifiedTabs": true,
    "editor.fontSize": 14,
    "editor.lineHeight": 1.5,
    "editor.tabSize": 4,
    "editor.wordWrap": "on",
    "git.enableSmartCommit": true,
    "git.confirmSync": false,
    "extensions.autoUpdate": true
}
"@

$settingsJson | Out-File -FilePath "$vscodeDir\settings.json" -Encoding utf8

# Atalhos personalizados (keybindings.json)
$keybindingsJson = @"
[
    {
        "key": "ctrl+shift+p",
        "command": "workbench.action.showCommands",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+o",
        "command": "workbench.action.files.openFile"
    },
    {
        "key": "ctrl+k ctrl+o",
        "command": "workbench.action.files.openFolder"
    },
    {
        "key": "ctrl+r",
        "command": "workbench.action.openRecent"
    },
    {
        "key": "ctrl+alt+i",
        "command": "workbench.action.chat.open",
        "title": "Abrir Chat IA"
    },
    {
        "key": "ctrl+shift+a",
        "command": "workbench.action.quickOpen",
        "title": "Abrir Arquivo Rapidamente"
    },
    {
        "key": "ctrl+shift+t",
        "command": "workbench.action.terminal.new",
        "title": "Novo Terminal"
    }
]
"@

$keybindingsJson | Out-File -FilePath "$vscodeDir\keybindings.json" -Encoding utf8

Write-Host "✅ Configuração salva em: $vscodeDir" -ForegroundColor Green
Write-Host "🎯 Reinicie o VS Code para aplicar as configurações!" -ForegroundColor Yellow