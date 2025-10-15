from typing import Dict

# Map file extensions to programming languages
EXTENSION_MAP: Dict[str, str] = {
    '.py': 'python',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.java': 'java',
    '.go': 'go',
    '.rs': 'rust',
    '.cpp': 'cpp',
    '.c': 'c',
    '.cs': 'csharp',
    '.php': 'php',
    '.rb': 'ruby',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.scala': 'scala',
    '.r': 'r',
    '.sql': 'sql',
    '.sh': 'bash',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.json': 'json',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.vue': 'vue',
    '.dart': 'dart',
}


def detect_language(filename: str) -> str:
    """Detect programming language from filename"""
    extension = '.' + filename.split('.')[-1] if '.' in filename else ''
    return EXTENSION_MAP.get(extension.lower(), 'unknown')


def get_supported_extensions() -> list:
    """Return list of supported file extensions"""
    return list(EXTENSION_MAP.keys())

