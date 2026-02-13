#!/usr/bin/env python3
"""
Validate HTML div balance in blog posts.

This script checks all blog HTML files for:
1. Overall div balance (opening vs closing tags)
2. Callout boxes that don't close properly
3. Quick-facts boxes that don't close properly

Usage:
    python3 validate-blog-divs.py

Returns exit code 0 if all files are valid, 1 if errors found.
"""

import os
import sys
from pathlib import Path


def count_divs(content):
    """Count opening and closing div tags."""
    opens = content.count('<div')
    closes = content.count('</div>')
    return opens, closes


def check_callout_sections(filepath, content):
    """Check if callout and quick-facts sections close properly."""
    lines = content.split('\n')
    issues = []

    for i, line in enumerate(lines, start=1):
        # Check for callout or quick-facts opening
        if 'class="callout"' in line or 'class="quick-facts"' in line:
            box_type = 'callout' if 'callout' in line else 'quick-facts'

            # Track div depth from this point
            div_depth = 0
            start_line = i

            for j, check_line in enumerate(lines[i-1:], start=i):
                div_depth += check_line.count('<div')
                div_depth -= check_line.count('</div>')

                # Should close within ~100 lines max
                if div_depth == 0 and j > start_line:
                    lines_to_close = j - start_line
                    if lines_to_close > 100:
                        issues.append(
                            f"  Line {start_line}: {box_type} section took {lines_to_close} lines to close (suspicious)"
                        )
                    break

                # If we've gone 200 lines and still not closed, it's definitely wrong
                if j - start_line > 200 and div_depth > 0:
                    issues.append(
                        f"  Line {start_line}: {box_type} section still unclosed after 200+ lines!"
                    )
                    break

    return issues


def validate_file(filepath):
    """Validate a single HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    errors = []
    warnings = []

    # Check overall div balance
    opens, closes = count_divs(content)
    if opens != closes:
        errors.append(f"  Div imbalance: {opens} opens, {closes} closes (diff: {opens - closes})")

    # Check callout/quick-facts sections
    callout_issues = check_callout_sections(filepath, content)
    if callout_issues:
        warnings.extend(callout_issues)

    return errors, warnings


def main():
    """Validate all blog HTML files."""
    blog_dir = Path('blog')

    if not blog_dir.exists():
        print("Error: 'blog' directory not found")
        print("Run this script from the project root directory")
        return 1

    html_files = sorted(blog_dir.glob('*.html'))

    if not html_files:
        print("No HTML files found in blog directory")
        return 1

    print(f"Validating {len(html_files)} blog posts...\n")

    files_with_errors = []
    files_with_warnings = []

    for filepath in html_files:
        errors, warnings = validate_file(filepath)

        if errors:
            files_with_errors.append(filepath.name)
            print(f"❌ {filepath.name}")
            for error in errors:
                print(error)
            print()
        elif warnings:
            files_with_warnings.append(filepath.name)
            print(f"⚠️  {filepath.name}")
            for warning in warnings:
                print(warning)
            print()

    # Summary
    print("=" * 60)
    clean_files = len(html_files) - len(files_with_errors) - len(files_with_warnings)
    print(f"✓ Clean: {clean_files}")
    print(f"⚠ Warnings: {len(files_with_warnings)}")
    print(f"✗ Errors: {len(files_with_errors)}")

    if files_with_errors:
        print("\nFiles with ERRORS (must fix):")
        for filename in files_with_errors:
            print(f"  - {filename}")
        return 1

    if files_with_warnings:
        print("\nFiles with WARNINGS (review recommended):")
        for filename in files_with_warnings:
            print(f"  - {filename}")

    print("\n✓ All files have balanced divs!")
    return 0


if __name__ == '__main__':
    sys.exit(main())
