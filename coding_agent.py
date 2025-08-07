#!/usr/bin/env python3
"""
Advanced Coding Agent with RAG Integration

This coding agent provides intelligent code assistance by leveraging:
- RAG (Retrieval Augmented Generation) for enhanced code knowledge
- Multiple specialized tools for code analysis and generation
- Integration with the existing Langchain-based RAG system
- Support for multiple programming languages and frameworks
"""

import os
import sys
import json
import ast
import subprocess
import tempfile
import traceback
from typing import Dict, List, Any, Optional, Tuple, Union
from dataclasses import dataclass
from pathlib import Path
from datetime import datetime

# Core dependencies
import transformers
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_milvus import Milvus
from langchain_community.llms import Replicate
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from ibm_granite_community.langchain import TokenizerChatPromptTemplate, create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from transformers import AutoTokenizer

@dataclass
class CodeContext:
    """Represents the context of a coding task"""
    language: str
    file_path: Optional[str] = None
    function_name: Optional[str] = None
    class_name: Optional[str] = None
    dependencies: List[str] = None
    description: str = ""
    
    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []

@dataclass
class AgentResponse:
    """Standardized response format for the coding agent"""
    success: bool
    content: str
    code: Optional[str] = None
    suggestions: List[str] = None
    errors: List[str] = None
    
    def __post_init__(self):
        if self.suggestions is None:
            self.suggestions = []
        if self.errors is None:
            self.errors = []

class CodingAgent:
    """
    Advanced Coding Agent with RAG Integration
    
    Provides intelligent code assistance including:
    - Code generation and completion
    - Bug detection and fixing
    - Code refactoring and optimization
    - Documentation generation
    - Code review and analysis
    """
    
    def __init__(self, 
                 embeddings_model_path: str = "ibm-granite/granite-embedding-30m-english",
                 llm_model_path: str = "ibm-granite/granite-3.3-8b-instruct",
                 replicate_api_token: Optional[str] = None):
        """
        Initialize the coding agent with RAG capabilities
        
        Args:
            embeddings_model_path: Path to the embeddings model
            llm_model_path: Path to the LLM model
            replicate_api_token: API token for Replicate service
        """
        self.embeddings_model_path = embeddings_model_path
        self.llm_model_path = llm_model_path
        self.replicate_api_token = replicate_api_token or os.getenv('REPLICATE_API_TOKEN')
        
        # Initialize components
        self._setup_embeddings()
        self._setup_vector_db()
        self._setup_llm()
        self._setup_rag_chain()
        
        # Code analysis tools
        self.supported_languages = {
            'python': {'.py', '.pyw', '.pyx'},
            'javascript': {'.js', '.jsx', '.mjs'},
            'typescript': {'.ts', '.tsx'},
            'java': {'.java'},
            'cpp': {'.cpp', '.cc', '.cxx', '.c++', '.hpp', '.h'},
            'c': {'.c', '.h'},
            'go': {'.go'},
            'rust': {'.rs'},
            'php': {'.php'},
            'ruby': {'.rb'},
            'swift': {'.swift'},
            'kotlin': {'.kt', '.kts'}
        }
        
        print("🤖 Coding Agent initialized successfully!")
    
    def _setup_embeddings(self):
        """Setup the embeddings model"""
        try:
            self.embeddings_model = HuggingFaceEmbeddings(
                model_name=self.embeddings_model_path,
            )
            self.embeddings_tokenizer = AutoTokenizer.from_pretrained(self.embeddings_model_path)
            print(f"✅ Embeddings model loaded: {self.embeddings_model_path}")
        except Exception as e:
            print(f"❌ Failed to load embeddings model: {e}")
            raise
    
    def _setup_vector_db(self):
        """Setup the vector database"""
        try:
            db_file = tempfile.NamedTemporaryFile(prefix="coding_agent_", suffix=".db", delete=False).name
            print(f"📊 Vector database will be saved to {db_file}")
            
            self.vector_db = Milvus(
                embedding_function=self.embeddings_model,
                connection_args={"uri": db_file},
                auto_id=True,
                index_params={"index_type": "AUTOINDEX"},
            )
            print("✅ Vector database initialized")
        except Exception as e:
            print(f"❌ Failed to setup vector database: {e}")
            raise
    
    def _setup_llm(self):
        """Setup the language model"""
        try:
            if not self.replicate_api_token:
                raise ValueError("REPLICATE_API_TOKEN is required")
            
            self.model = Replicate(
                model=self.llm_model_path,
                replicate_api_token=self.replicate_api_token,
            )
            self.tokenizer = AutoTokenizer.from_pretrained(self.llm_model_path)
            print(f"✅ LLM loaded: {self.llm_model_path}")
        except Exception as e:
            print(f"❌ Failed to load LLM: {e}")
            raise
    
    def _setup_rag_chain(self):
        """Setup the RAG chain for enhanced code understanding"""
        try:
            # Create a Granite prompt for code-related questions
            self.prompt_template = TokenizerChatPromptTemplate.from_template(
                "{input}", tokenizer=self.tokenizer
            )
            
            # Assemble the retrieval-augmented generation chain
            self.combine_docs_chain = create_stuff_documents_chain(
                llm=self.model,
                prompt=self.prompt_template,
            )
            self.rag_chain = create_retrieval_chain(
                retriever=self.vector_db.as_retriever(),
                combine_docs_chain=self.combine_docs_chain,
            )
            print("✅ RAG chain initialized")
        except Exception as e:
            print(f"❌ Failed to setup RAG chain: {e}")
            raise
    
    def detect_language(self, file_path: str) -> Optional[str]:
        """Detect programming language from file extension"""
        file_ext = Path(file_path).suffix.lower()
        for lang, extensions in self.supported_languages.items():
            if file_ext in extensions:
                return lang
        return None
    
    def analyze_code_structure(self, code: str, language: str) -> Dict[str, Any]:
        """Analyze code structure and extract metadata"""
        analysis = {
            'language': language,
            'functions': [],
            'classes': [],
            'imports': [],
            'variables': [],
            'complexity_score': 0,
            'lines_of_code': len(code.split('\n')),
            'errors': []
        }
        
        if language == 'python':
            try:
                tree = ast.parse(code)
                for node in ast.walk(tree):
                    if isinstance(node, ast.FunctionDef):
                        analysis['functions'].append({
                            'name': node.name,
                            'line': node.lineno,
                            'args': [arg.arg for arg in node.args.args],
                            'docstring': ast.get_docstring(node)
                        })
                    elif isinstance(node, ast.ClassDef):
                        analysis['classes'].append({
                            'name': node.name,
                            'line': node.lineno,
                            'methods': [n.name for n in node.body if isinstance(n, ast.FunctionDef)],
                            'docstring': ast.get_docstring(node)
                        })
                    elif isinstance(node, ast.Import):
                        analysis['imports'].extend([alias.name for alias in node.names])
                    elif isinstance(node, ast.ImportFrom):
                        module = node.module or ''
                        analysis['imports'].extend([f"{module}.{alias.name}" for alias in node.names])
            except SyntaxError as e:
                analysis['errors'].append(f"Syntax error: {e}")
        
        return analysis
    
    def load_codebase(self, directory_path: str, extensions: Optional[List[str]] = None) -> int:
        """
        Load a codebase into the vector database for RAG
        
        Args:
            directory_path: Path to the codebase directory
            extensions: File extensions to include (default: all supported)
        
        Returns:
            Number of files loaded
        """
        if not os.path.exists(directory_path):
            raise FileNotFoundError(f"Directory not found: {directory_path}")
        
        if extensions is None:
            extensions = set()
            for lang_exts in self.supported_languages.values():
                extensions.update(lang_exts)
        
        documents = []
        files_loaded = 0
        
        for root, dirs, files in os.walk(directory_path):
            # Skip common non-source directories
            dirs[:] = [d for d in dirs if d not in {'.git', '__pycache__', 'node_modules', '.venv', 'venv'}]
            
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = Path(file_path).suffix.lower()
                
                if file_ext in extensions:
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        # Analyze the code
                        language = self.detect_language(file_path)
                        analysis = self.analyze_code_structure(content, language or 'unknown')
                        
                        # Create document with metadata
                        doc_content = f"""
File: {file_path}
Language: {language}
Functions: {', '.join([f['name'] for f in analysis['functions']])}
Classes: {', '.join([c['name'] for c in analysis['classes']])}
Imports: {', '.join(analysis['imports'])}

Code:
{content}
"""
                        
                        # Split large files into chunks
                        text_splitter = CharacterTextSplitter.from_huggingface_tokenizer(
                            tokenizer=self.embeddings_tokenizer,
                            chunk_size=min(self.embeddings_tokenizer.max_len_single_sentence, 1000),
                            chunk_overlap=100,
                        )
                        
                        chunks = text_splitter.create_documents(
                            [doc_content],
                            metadatas=[{
                                'file_path': file_path,
                                'language': language,
                                'functions': analysis['functions'],
                                'classes': analysis['classes'],
                                'imports': analysis['imports']
                            }]
                        )
                        
                        documents.extend(chunks)
                        files_loaded += 1
                        
                    except Exception as e:
                        print(f"⚠️  Failed to load {file_path}: {e}")
        
        if documents:
            # Add documents to vector database
            ids = self.vector_db.add_documents(documents)
            print(f"📚 Loaded {files_loaded} files ({len(ids)} chunks) into knowledge base")
        
        return files_loaded
    
    def generate_code(self, prompt: str, context: Optional[CodeContext] = None) -> AgentResponse:
        """
        Generate code based on a natural language prompt
        
        Args:
            prompt: Natural language description of the code to generate
            context: Optional context about the coding task
        
        Returns:
            AgentResponse with generated code and suggestions
        """
        try:
            # Enhance prompt with context
            enhanced_prompt = self._enhance_prompt_with_context(prompt, context)
            
            # Use RAG to get relevant code examples
            rag_response = self.rag_chain.invoke({"input": enhanced_prompt})
            
            # Extract code from response
            generated_code = self._extract_code_from_response(rag_response['answer'])
            
            return AgentResponse(
                success=True,
                content=rag_response['answer'],
                code=generated_code,
                suggestions=[
                    "Review the generated code for correctness",
                    "Test the code with sample inputs",
                    "Consider edge cases and error handling"
                ]
            )
            
        except Exception as e:
            return AgentResponse(
                success=False,
                content=f"Failed to generate code: {e}",
                errors=[str(e)]
            )
    
    def debug_code(self, code: str, error_message: Optional[str] = None, 
                   context: Optional[CodeContext] = None) -> AgentResponse:
        """
        Debug code and provide fixes for issues
        
        Args:
            code: Code to debug
            error_message: Optional error message
            context: Optional context about the code
        
        Returns:
            AgentResponse with debugging suggestions and fixes
        """
        try:
            # Analyze code structure
            language = context.language if context else self.detect_language(context.file_path) if context and context.file_path else 'python'
            analysis = self.analyze_code_structure(code, language)
            
            # Create debugging prompt
            debug_prompt = f"""
Debug the following {language} code:

Code:
```{language}
{code}
```

Error message: {error_message or 'No specific error provided'}

Code analysis:
- Functions: {', '.join([f['name'] for f in analysis['functions']])}
- Classes: {', '.join([c['name'] for c in analysis['classes']])}
- Syntax errors: {', '.join(analysis['errors']) if analysis['errors'] else 'None detected'}

Please identify issues and provide fixes.
"""
            
            # Use RAG for debugging assistance
            rag_response = self.rag_chain.invoke({"input": debug_prompt})
            
            # Extract fixed code if present
            fixed_code = self._extract_code_from_response(rag_response['answer'])
            
            return AgentResponse(
                success=True,
                content=rag_response['answer'],
                code=fixed_code,
                suggestions=[
                    "Test the fixed code thoroughly",
                    "Consider adding error handling",
                    "Review for potential performance improvements"
                ]
            )
            
        except Exception as e:
            return AgentResponse(
                success=False,
                content=f"Failed to debug code: {e}",
                errors=[str(e)]
            )
    
    def refactor_code(self, code: str, refactor_type: str = "optimize", 
                      context: Optional[CodeContext] = None) -> AgentResponse:
        """
        Refactor code for better structure, performance, or readability
        
        Args:
            code: Code to refactor
            refactor_type: Type of refactoring (optimize, structure, readability)
            context: Optional context about the code
        
        Returns:
            AgentResponse with refactored code and explanations
        """
        try:
            language = context.language if context else 'python'
            
            refactor_prompt = f"""
Refactor the following {language} code for {refactor_type}:

Code:
```{language}
{code}
```

Please provide:
1. Refactored code
2. Explanation of changes made
3. Benefits of the refactoring
"""
            
            # Use RAG for refactoring assistance
            rag_response = self.rag_chain.invoke({"input": refactor_prompt})
            
            # Extract refactored code
            refactored_code = self._extract_code_from_response(rag_response['answer'])
            
            return AgentResponse(
                success=True,
                content=rag_response['answer'],
                code=refactored_code,
                suggestions=[
                    "Compare performance with original code",
                    "Ensure all tests still pass",
                    "Review for maintainability improvements"
                ]
            )
            
        except Exception as e:
            return AgentResponse(
                success=False,
                content=f"Failed to refactor code: {e}",
                errors=[str(e)]
            )
    
    def generate_documentation(self, code: str, context: Optional[CodeContext] = None) -> AgentResponse:
        """
        Generate comprehensive documentation for code
        
        Args:
            code: Code to document
            context: Optional context about the code
        
        Returns:
            AgentResponse with generated documentation
        """
        try:
            language = context.language if context else 'python'
            analysis = self.analyze_code_structure(code, language)
            
            doc_prompt = f"""
Generate comprehensive documentation for the following {language} code:

Code:
```{language}
{code}
```

Code structure:
- Functions: {', '.join([f['name'] for f in analysis['functions']])}
- Classes: {', '.join([c['name'] for c in analysis['classes']])}

Please provide:
1. Overview and purpose
2. Function/method documentation
3. Usage examples
4. Parameter descriptions
5. Return value descriptions
"""
            
            # Use RAG for documentation assistance
            rag_response = self.rag_chain.invoke({"input": doc_prompt})
            
            return AgentResponse(
                success=True,
                content=rag_response['answer'],
                suggestions=[
                    "Review documentation for accuracy",
                    "Add examples for complex functions",
                    "Consider adding type hints"
                ]
            )
            
        except Exception as e:
            return AgentResponse(
                success=False,
                content=f"Failed to generate documentation: {e}",
                errors=[str(e)]
            )
    
    def code_review(self, code: str, context: Optional[CodeContext] = None) -> AgentResponse:
        """
        Perform automated code review with suggestions
        
        Args:
            code: Code to review
            context: Optional context about the code
        
        Returns:
            AgentResponse with review findings and suggestions
        """
        try:
            language = context.language if context else 'python'
            analysis = self.analyze_code_structure(code, language)
            
            review_prompt = f"""
Perform a comprehensive code review for the following {language} code:

Code:
```{language}
{code}
```

Please review for:
1. Code quality and best practices
2. Performance issues
3. Security vulnerabilities
4. Maintainability concerns
5. Potential bugs
6. Style and formatting

Provide specific suggestions for improvement.
"""
            
            # Use RAG for code review assistance
            rag_response = self.rag_chain.invoke({"input": review_prompt})
            
            return AgentResponse(
                success=True,
                content=rag_response['answer'],
                suggestions=[
                    "Address high-priority issues first",
                    "Run automated tests after changes",
                    "Consider using linting tools",
                    "Review security implications"
                ]
            )
            
        except Exception as e:
            return AgentResponse(
                success=False,
                content=f"Failed to perform code review: {e}",
                errors=[str(e)]
            )
    
    def _enhance_prompt_with_context(self, prompt: str, context: Optional[CodeContext]) -> str:
        """Enhance prompt with additional context information"""
        if not context:
            return prompt
        
        enhanced = f"""
Context:
- Language: {context.language}
- File: {context.file_path or 'N/A'}
- Function: {context.function_name or 'N/A'}
- Class: {context.class_name or 'N/A'}
- Dependencies: {', '.join(context.dependencies) if context.dependencies else 'None'}
- Description: {context.description}

Request: {prompt}
"""
        return enhanced
    
    def _extract_code_from_response(self, response: str) -> Optional[str]:
        """Extract code blocks from the model response"""
        import re
        
        # Look for code blocks with language specifiers
        code_pattern = r'```(?:\w+)?\n(.*?)\n```'
        matches = re.findall(code_pattern, response, re.DOTALL)
        
        if matches:
            return matches[0].strip()
        
        # Look for inline code
        inline_pattern = r'`([^`]+)`'
        inline_matches = re.findall(inline_pattern, response)
        
        if inline_matches and len(inline_matches[0]) > 20:  # Likely code, not just a variable name
            return inline_matches[0].strip()
        
        return None

def main():
    """Main function to demonstrate the coding agent capabilities"""
    print("🚀 Starting Coding Agent Demo...")
    
    try:
        # Initialize the agent
        agent = CodingAgent()
        
        # Example: Generate a simple function
        print("\n📝 Generating a Python function...")
        context = CodeContext(
            language="python",
            description="Create a function to calculate fibonacci numbers"
        )
        
        response = agent.generate_code(
            "Create a Python function that calculates the nth Fibonacci number using dynamic programming",
            context
        )
        
        if response.success:
            print("✅ Code generated successfully!")
            print(f"Generated code:\n{response.code}")
            print(f"Suggestions: {', '.join(response.suggestions)}")
        else:
            print(f"❌ Failed to generate code: {', '.join(response.errors)}")
        
        # Example: Code review
        print("\n🔍 Performing code review...")
        sample_code = """
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)
"""
        
        review_response = agent.code_review(sample_code, context)
        if review_response.success:
            print("✅ Code review completed!")
            print(f"Review: {review_response.content}")
        
    except Exception as e:
        print(f"❌ Error running demo: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main()