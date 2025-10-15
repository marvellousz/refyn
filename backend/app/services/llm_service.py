from groq import Groq
from app.config import settings
from app.models import ReviewAnalysis, CodeIssue, SeverityLevel
from app.utils.code_chunker import CodeChunk
from typing import List
import json
import re


class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = "llama-3.3-70b-versatile"
    
    def create_review_prompt(self, code: str, language: str, chunk_info: str = "") -> str:
        
        chunk_context = f"\n\n**Note:** This is {chunk_info}" if chunk_info else ""
        
        return f"""You are an expert code reviewer. Analyze the following {language} code and provide a comprehensive review.{chunk_context}

CODE TO REVIEW:
```{language}
{code}
```

Provide your analysis in the following JSON format (MUST be valid JSON):
{{
    "readability_score": <1-10>,
    "modularity_score": <1-10>,
    "maintainability_score": <1-10>,
    "overall_summary": "<brief summary of code quality>",
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "issues": [
        {{
            "line": <line number or null>,
            "severity": "<critical|warning|suggestion|info>",
            "category": "<readability|performance|security|bug|best-practice>",
            "description": "<issue description>",
            "suggestion": "<how to fix it>"
        }}
    ],
    "suggestions": ["<actionable improvement 1>", "<actionable improvement 2>", ...],
    "potential_bugs": ["<potential bug 1>", "<potential bug 2>", ...],
    "security_concerns": ["<security issue 1>", "<security issue 2>", ...]
}}

Focus on:
1. **Readability**: Variable names, comments, code structure
2. **Modularity**: Function/class design, separation of concerns
3. **Potential Bugs**: Logic errors, edge cases, null checks
4. **Security**: Input validation, injection risks, data exposure
5. **Best Practices**: Language-specific conventions, patterns
6. **Performance**: Inefficient algorithms, unnecessary operations

Be specific and actionable. Reference line numbers when possible."""

    async def analyze_code(self, code: str, language: str, chunks: List[CodeChunk] = None) -> ReviewAnalysis:
        
        if chunks and len(chunks) > 1:
            return await self._analyze_chunks(chunks, language)
        else:
            chunk_info = chunks[0].context if chunks else ""
            return await self._analyze_single(code, language, chunk_info)
    
    async def _analyze_single(self, code: str, language: str, chunk_info: str = "") -> ReviewAnalysis:
        
        prompt = self.create_review_prompt(code, language, chunk_info)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert code reviewer. Always respond with valid JSON only, no additional text."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000,
            )
            
            content = response.choices[0].message.content.strip()
            
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                content = json_match.group()
            
            analysis_data = json.loads(content)
            
            issues = []
            for issue in analysis_data.get('issues', []):
                issues.append(CodeIssue(
                    line=issue.get('line'),
                    severity=SeverityLevel(issue.get('severity', 'info')),
                    category=issue.get('category', 'general'),
                    description=issue.get('description', ''),
                    suggestion=issue.get('suggestion')
                ))
            
            return ReviewAnalysis(
                readability_score=analysis_data.get('readability_score', 5),
                modularity_score=analysis_data.get('modularity_score', 5),
                maintainability_score=analysis_data.get('maintainability_score', 5),
                overall_summary=analysis_data.get('overall_summary', 'Code analysis completed'),
                strengths=analysis_data.get('strengths', []),
                issues=issues,
                suggestions=analysis_data.get('suggestions', []),
                potential_bugs=analysis_data.get('potential_bugs', []),
                security_concerns=analysis_data.get('security_concerns', [])
            )
            
        except Exception as e:
            print(f"Error during LLM analysis: {e}")
            # Return a default analysis if LLM fails
            return ReviewAnalysis(
                readability_score=5,
                modularity_score=5,
                maintainability_score=5,
                overall_summary=f"Analysis failed: {str(e)}",
                strengths=["Code structure appears standard"],
                issues=[],
                suggestions=["Review the code manually for improvements"],
                potential_bugs=["Unable to detect automatically"],
                security_concerns=["Manual security review recommended"]
            )
    
    async def _analyze_chunks(self, chunks: List[CodeChunk], language: str) -> ReviewAnalysis:
        """Analyze multiple chunks and aggregate results"""
        
        chunk_analyses = []
        
        for i, chunk in enumerate(chunks):
            chunk_info = f"chunk {i+1}/{len(chunks)}: {chunk.context}"
            analysis = await self._analyze_single(chunk.content, language, chunk_info)
            chunk_analyses.append(analysis)
        
        # Aggregate results
        avg_readability = sum(a.readability_score for a in chunk_analyses) / len(chunk_analyses)
        avg_modularity = sum(a.modularity_score for a in chunk_analyses) / len(chunk_analyses)
        avg_maintainability = sum(a.maintainability_score for a in chunk_analyses) / len(chunk_analyses)
        
        all_strengths = []
        all_issues = []
        all_suggestions = []
        all_bugs = []
        all_security = []
        
        for analysis in chunk_analyses:
            all_strengths.extend(analysis.strengths)
            all_issues.extend(analysis.issues)
            all_suggestions.extend(analysis.suggestions)
            all_bugs.extend(analysis.potential_bugs)
            all_security.extend(analysis.security_concerns)
        
        # Remove duplicates while preserving order
        all_strengths = list(dict.fromkeys(all_strengths))
        all_suggestions = list(dict.fromkeys(all_suggestions))
        all_bugs = list(dict.fromkeys(all_bugs))
        all_security = list(dict.fromkeys(all_security))
        
        overall_summary = f"Analyzed {len(chunks)} code segments. " + chunk_analyses[0].overall_summary
        
        return ReviewAnalysis(
            readability_score=round(avg_readability),
            modularity_score=round(avg_modularity),
            maintainability_score=round(avg_maintainability),
            overall_summary=overall_summary,
            strengths=all_strengths[:10],  # Limit to top 10
            issues=all_issues,
            suggestions=all_suggestions[:15],  # Limit to top 15
            potential_bugs=all_bugs[:10],
            security_concerns=all_security[:10]
        )

