"""
Compatibility module for Django 3.2 running on Python 3.13
This module provides the minimal functionality needed from the removed cgi module
"""

import html
import tempfile
from io import StringIO
from urllib.parse import parse_qs as _parse_qs

__all__ = ["parse", "parse_qs", "parse_qsl", "parse_multipart", "parse_header", "escape"]

def parse(fp=None, environ=None, keep_blank_values=False, strict_parsing=False):
    """Minimal implementation of cgi.parse"""
    if environ is None:
        environ = {}
    if 'QUERY_STRING' in environ:
        qs = environ['QUERY_STRING']
        return {'QUERY_STRING': parse_qs(qs, keep_blank_values, strict_parsing)}
    return {}

def parse_qs(qs, keep_blank_values=False, strict_parsing=False, encoding='utf-8', errors='replace'):
    """Parse a query string"""
    return _parse_qs(qs, keep_blank_values, strict_parsing, encoding, errors)

def parse_qsl(qs, keep_blank_values=False, strict_parsing=False, encoding='utf-8', errors='replace'):
    """Parse a query string and return a list of (name, value) pairs"""
    from urllib.parse import parse_qsl as _parse_qsl
    return _parse_qsl(qs, keep_blank_values, strict_parsing, encoding, errors)

def parse_multipart(fp, pdict):
    """Stub for multipart parsing - not fully implemented"""
    return {}

def parse_header(line):
    """Parse a Content-type header"""
    if not line:
        return '', {}
    parts = line.split(';', 1)
    key = parts[0].strip().lower()
    
    if len(parts) == 1:
        return key, {}
    
    params = {}
    for param in parts[1].split(';'):
        if '=' not in param:
            continue
        name, value = param.split('=', 1)
        name = name.strip().lower()
        value = value.strip()
        if value.startswith('"') and value.endswith('"'):
            value = value[1:-1]
        params[name] = value
    
    return key, params

def escape(s, quote=True):
    """Replace special characters with HTML escape sequences"""
    return html.escape(s, quote)

# Classes needed by Django
class FieldStorage:
    """Class for handling form data, as used by Django"""
    
    def __init__(self, fp=None, headers=None, outerboundary=None, 
                 environ=None, keep_blank_values=False, strict_parsing=False, 
                 limit=None, encoding='utf-8', errors='replace', 
                 max_num_fields=None, separator='&'):
        self.file = fp or StringIO()
        self.type = None
        self.list = []
        self.name = None
        self.filename = None
        self.disposition = None
        self.headers = headers or {}
        self.environ = environ or {}
        
    def getvalue(self, key, default=None):
        """Return value for key - stub for compatibility"""
        return default

    def getlist(self, key):
        """Return list of values for key - stub for compatibility"""
        return []

    def keys(self):
        """Return list of keys - stub for compatibility"""
        return []

    def __bool__(self):
        return bool(self.list) 