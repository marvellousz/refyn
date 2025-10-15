import re
from typing import List, Dict
from dataclasses import dataclass


@dataclass
class CodeChunk:
    content: str
    start_line: int
    end_line: int
    chunk_type: str  # 'function', 'class', 'import', 'other'
    context: str = ""  # Brief description


class CodeChunker:
    
    def __init__(self, max_chunk_size: int = 2000):
        self.max_chunk_size = max_chunk_size
    
    def chunk_code(self, code: str, language: str) -> List[CodeChunk]:
        
        if len(code) <= self.max_chunk_size:
            return [CodeChunk(
                content=code,
                start_line=1,
                end_line=len(code.split('\n')),
                chunk_type='full',
                context='Complete file'
            )]
        
        lines = code.split('\n')
        
        if language.lower() in ['python', 'py']:
            return self._chunk_python(lines)
        elif language.lower() in ['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx']:
            return self._chunk_javascript(lines)
        else:
            return self._chunk_generic(lines)
    
    def _chunk_python(self, lines: List[str]) -> List[CodeChunk]:
        chunks = []
        current_chunk = []
        chunk_start = 1
        chunk_type = 'other'
        context = ''
        
        for i, line in enumerate(lines, 1):
            stripped = line.lstrip()
            
            # Detect function or class definitions
            if stripped.startswith('def ') or stripped.startswith('class '):
                if current_chunk and len('\n'.join(current_chunk)) > 50:
                    chunks.append(CodeChunk(
                        content='\n'.join(current_chunk),
                        start_line=chunk_start,
                        end_line=i - 1,
                        chunk_type=chunk_type,
                        context=context
                    ))
                    current_chunk = []
                    chunk_start = i
                
                chunk_type = 'class' if stripped.startswith('class ') else 'function'
                context = stripped.split('(')[0] if 'def ' in stripped else stripped.split(':')[0]
            
            current_chunk.append(line)
            
            # Split if chunk gets too large
            if len('\n'.join(current_chunk)) > self.max_chunk_size:
                chunks.append(CodeChunk(
                    content='\n'.join(current_chunk),
                    start_line=chunk_start,
                    end_line=i,
                    chunk_type=chunk_type,
                    context=context
                ))
                current_chunk = []
                chunk_start = i + 1
                chunk_type = 'other'
                context = ''
        
        if current_chunk:
            chunks.append(CodeChunk(
                content='\n'.join(current_chunk),
                start_line=chunk_start,
                end_line=len(lines),
                chunk_type=chunk_type,
                context=context
            ))
        
        return chunks
    
    def _chunk_javascript(self, lines: List[str]) -> List[CodeChunk]:
        chunks = []
        current_chunk = []
        chunk_start = 1
        chunk_type = 'other'
        context = ''
        brace_count = 0
        
        for i, line in enumerate(lines, 1):
            stripped = line.lstrip()
            
            # Detect function/class/component definitions
            if any(keyword in stripped for keyword in ['function ', 'class ', 'const ', 'let ', 'var ', 'export ']):
                if '=' in stripped and ('=>' in stripped or 'function' in stripped):
                    if current_chunk and len('\n'.join(current_chunk)) > 50:
                        chunks.append(CodeChunk(
                            content='\n'.join(current_chunk),
                            start_line=chunk_start,
                            end_line=i - 1,
                            chunk_type=chunk_type,
                            context=context
                        ))
                        current_chunk = []
                        chunk_start = i
                    
                    chunk_type = 'function'
                    context = stripped.split('=')[0].strip()
            
            current_chunk.append(line)
            brace_count += line.count('{') - line.count('}')
            
            # Split at logical boundaries (when braces balance) if too large
            if brace_count == 0 and len('\n'.join(current_chunk)) > self.max_chunk_size:
                chunks.append(CodeChunk(
                    content='\n'.join(current_chunk),
                    start_line=chunk_start,
                    end_line=i,
                    chunk_type=chunk_type,
                    context=context
                ))
                current_chunk = []
                chunk_start = i + 1
                chunk_type = 'other'
                context = ''
        
        if current_chunk:
            chunks.append(CodeChunk(
                content='\n'.join(current_chunk),
                start_line=chunk_start,
                end_line=len(lines),
                chunk_type=chunk_type,
                context=context
            ))
        
        return chunks
    
    def _chunk_generic(self, lines: List[str]) -> List[CodeChunk]:
        """Generic chunking by lines when language-specific parsing isn't available"""
        chunks = []
        chunk_size = self.max_chunk_size // 50  # Approximate lines
        
        for i in range(0, len(lines), chunk_size):
            chunk_lines = lines[i:i + chunk_size]
            chunks.append(CodeChunk(
                content='\n'.join(chunk_lines),
                start_line=i + 1,
                end_line=min(i + chunk_size, len(lines)),
                chunk_type='segment',
                context=f'Lines {i + 1}-{min(i + chunk_size, len(lines))}'
            ))
        
        return chunks

