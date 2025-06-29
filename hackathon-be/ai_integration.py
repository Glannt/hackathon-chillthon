#!/usr/bin/env python3
"""
AI Task Assignment Integration Script
This script integrates with the existing model.py to provide AI-powered task assignment
"""

import sys
import json
import os
from pathlib import Path
import google.generativeai as genai
import pandas as pd
import re

# Add the current directory to Python path to import model functions
sys.path.append(str(Path(__file__).parent))

def parse_markdown_table(markdown_text):
    """Parse markdown table and return DataFrame"""
    tables = re.findall(r"((?:\|[^\n]*\|\n)+)", markdown_text)
    for tbl in tables:
        lines = [line for line in tbl[0].split('\n') if line.strip().startswith('|')]
        if len(lines) < 2:
            continue
        divider_idx = None
        for idx, l in enumerate(lines):
            if re.match(r"^\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$", l):
                divider_idx = idx
                break
        if divider_idx is not None and divider_idx > 0:
            header = [h.strip() for h in lines[divider_idx-1].strip("|").split("|")]
            data_lines = lines[divider_idx+1:]
        else:
            header = [h.strip() for h in lines[0].strip("|").split("|")]
            data_lines = lines[1:]
        data = []
        for row in data_lines:
            cells = [c.strip() for c in row.strip("|").split("|")]
            if len(cells) == len(header):
                data.append(cells)
        if data:
            try:
                df = pd.DataFrame(data, columns=header)
                if df.columns.duplicated().any():
                    continue
                return df
            except Exception:
                continue
    return None

def extract_mapping_user_task(markdown_text):
    """Extract user-task mapping from markdown text"""
    def clean_member_name(name_str):
        """Extract only the member name, removing role/experience info"""
        if not name_str or name_str.strip() == "":
            return ""

        # Remove content in parentheses and brackets
        cleaned = re.sub(r'[\(\[\{][^\)\]\}]*[\)\]\}]', '', name_str).strip()

        # Remove common suffixes like "KN)", "năm)", etc.
        cleaned = re.sub(r'\s*(KN|năm|years?)\s*\)?\s*$', '', cleaned, flags=re.IGNORECASE).strip()

        # Split by common separators and take the first meaningful part
        parts = re.split(r'[\-,|]', cleaned)
        if parts:
            first_part = parts[0].strip()

            # Skip if empty after cleaning
            if not first_part:
                return ""

            # If first part is just a single letter, it's likely the name
            if len(first_part) == 1 and first_part.isalpha():
                return first_part

            # Skip obvious non-names
            if first_part.lower() in ['kn', 'năm', 'years', 'kinh nghiệm'] or first_part.isdigit():
                return ""

            # Remove common role keywords but keep actual names
            role_keywords = ['fresher', 'junior', 'senior', 'medium', 'developer', 'engineer', 'tester', 'qa']
            words = first_part.split()

            # If only one word and it's not a role keyword, keep it
            if len(words) == 1 and not any(keyword in words[0].lower() for keyword in role_keywords):
                return words[0]

            # Filter out role keywords but keep meaningful words
            filtered_words = []
            for w in words:
                if not any(keyword in w.lower() for keyword in role_keywords) and not w.isdigit():
                    filtered_words.append(w)

            result = ' '.join(filtered_words).strip()
            return result if result else ""

        return ""

    tables = re.findall(r"((?:\|[^\n]*\|\n)+)", markdown_text)
    for tbl in tables:
        lines = [line for line in tbl.split('\n') if line.strip().startswith('|')]
        if len(lines) < 2:
            continue

        # Find header row (skip separator rows)
        header_idx = 0
        separator_idx = -1

        for i, line in enumerate(lines):
            if re.match(r"^\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$", line):
                separator_idx = i
                if i > 0:
                    header_idx = i - 1
                break

        if separator_idx == -1:
            # No separator found, assume first line is header
            header_idx = 0
            data_start_idx = 1
        else:
            data_start_idx = separator_idx + 1

        header = [h.strip().lower() for h in lines[header_idx].strip("|").split("|")]

        # Find Task ID and User columns
        idx_task = None
        idx_user = None

        for i, h in enumerate(header):
            if 'task' in h and 'id' in h:
                idx_task = i
            elif any(kw in h for kw in ['thành viên', 'user', 'người phụ trách', 'tên']) and 'tên' in h:
                idx_user = i

        if idx_task is None or idx_user is None:
            continue

        # Extract data rows
        mapping = []
        for i in range(data_start_idx, len(lines)):
            row = lines[i]
            if re.match(r"^\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$", row):
                continue  # Skip any additional separator rows

            cells = [c.strip() for c in row.strip("|").split("|")]
            if len(cells) <= max(idx_task, idx_user):
                continue

            task_id = cells[idx_task].strip()
            user_cell = cells[idx_user].strip()

            if not task_id or not user_cell:  # Skip empty cells
                continue

            # Split multiple users
            users = re.split(r'[;,/]', user_cell)
            for u in users:
                u = u.strip()
                if u:
                    # Clean the member name
                    name_only = clean_member_name(u)
                    if name_only and len(name_only) >= 1 and name_only.isalpha():  # Only accept alphabetic names
                        mapping.append([task_id, name_only])

        if mapping:
            df_map = pd.DataFrame(mapping, columns=["Task ID", "Thành viên (tên)"])
            return df_map

    return None

def run_ai_analysis(task_file_path, user_file_path, output_path, api_key=None):
    """Run AI analysis using Gemini API"""
    try:
        # Read input files
        with open(task_file_path, 'r', encoding='utf-8') as f:
            task_input = f.read()

        with open(user_file_path, 'r', encoding='utf-8') as f:
            user_data = json.load(f)

        # Configure Gemini API - try API key from parameter first, then environment variable
        if api_key:
            genai.configure(api_key=api_key)
        else:
            # Try to get API key from environment variable
            env_api_key = os.getenv('GEMINI_API_KEY')
            if env_api_key:
                genai.configure(api_key=env_api_key)
            else:
                print("Warning: No API key provided. Using mock data for demonstration.")
                # Return mock data if no API key
                mock_result = {
                    "taskAnalysis": [
                        {"taskId": "TASK01", "type": "Medium", "difficulty": "Medium", "skills": ["Frontend", "React"], "workload": "Medium"},
                        {"taskId": "TASK02", "type": "High", "difficulty": "High", "skills": ["Backend", "API"], "workload": "Large"}
                    ],
                    "taskAssignment": [
                        {"taskId": "TASK01", "userId": "1", "userName": "John Doe", "assigned": True},
                        {"taskId": "TASK02", "userId": "2", "userName": "Jane Smith", "assigned": True}
                    ],
                    "userTaskMapping": [
                        {"Task ID": "TASK01", "Thành viên (tên)": "John Doe"},
                        {"Task ID": "TASK02", "Thành viên (tên)": "Jane Smith"}
                    ]
                }
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(mock_result, f, ensure_ascii=False, indent=2)
                return mock_result

        model = genai.GenerativeModel('gemini-1.5-flash')

        # Create prompts for task analysis and assignment
        task_analysis_prompt = f"""
        Bạn là AI trợ lý quản lý dự án phần mềm chuyên nghiệp.
        Nhiệm vụ của bạn là phân tích và phân loại các task đầu vào.

        Dưới đây là danh sách các task:
        {task_input}

        Với từng task, hãy:
        1. Tạo Task ID duy nhất (TASK01, TASK02...)
        2. Xác định Loại task: Low, Medium, High, Urgent
        3. Phân tích Độ khó
        4. Xác định Kỹ năng chính cần thiết
        5. Ước lượng khối lượng công việc: Small, Medium, Large

        Trả về kết quả dưới dạng JSON array với format:
        [
          {{
            "taskId": "TASK01",
            "type": "Medium",
            "difficulty": "Medium",
            "skills": ["Frontend", "React"],
            "workload": "Medium"
          }}
        ]
        """

        # Get task analysis
        task_analysis_response = model.generate_content(task_analysis_prompt)
        task_analysis_text = task_analysis_response.text

        # Extract JSON from response
        task_analysis_match = re.search(r'\[.*\]', task_analysis_text, re.DOTALL)
        if task_analysis_match:
            task_analysis = json.loads(task_analysis_match.group())
        else:
            task_analysis = []

        # Create user assignment prompt
        user_assignment_prompt = f"""
        Bạn là AI trợ lý quản lý dự án phần mềm chuyên nghiệp.
        Nhiệm vụ của bạn là phân công task cho các thành viên dựa trên kỹ năng và kinh nghiệm.

        Danh sách task đã phân tích:
        {json.dumps(task_analysis, ensure_ascii=False, indent=2)}

        Danh sách thành viên:
        {json.dumps(user_data, ensure_ascii=False, indent=2)}

        Hãy phân công task cho thành viên phù hợp nhất dựa trên:
        1. Kỹ năng phù hợp với yêu cầu task
        2. Kinh nghiệm và khả năng
        3. Khối lượng công việc hiện tại
        4. Độ khó của task

        Trả về kết quả dưới dạng JSON array với format:
        [
          {{
            "taskId": "TASK01",
            "MemberName": "Tên thành viên"
          }}
        ]
        """

        # Get user assignment
        user_assignment_response = model.generate_content(user_assignment_prompt)
        user_assignment_text = user_assignment_response.text

        # Extract JSON from response
        user_assignment_match = re.search(r'\[.*\]', user_assignment_text, re.DOTALL)
        if user_assignment_match:
            user_task_mapping = json.loads(user_assignment_match.group())
            # Convert old keys to new keys if needed
            for mapping in user_task_mapping:
                if 'Task ID' in mapping:
                    mapping['taskId'] = mapping.pop('Task ID')
                if 'Thành viên (tên)' in mapping:
                    mapping['MemberName'] = mapping.pop('Thành viên (tên)')
        else:
            user_task_mapping = []

        # Create task assignment details
        task_assignment = []
        for mapping in user_task_mapping:
            task_id = mapping.get('taskId', '')
            user_name = mapping.get('MemberName', '')

            # Find user data
            user_info = next((user for user in user_data if user.get('Name') == user_name), None)
            user_id = user_info.get('Id', '') if user_info else ''

            task_assignment.append({
                "taskId": task_id,
                "userId": user_id,
                "userName": user_name,
                "assigned": True
            })

        # Prepare final result
        result = {
            "taskAnalysis": task_analysis,
            "taskAssignment": task_assignment,
            "userTaskMapping": user_task_mapping
        }

        # Write result to output file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        return result

    except Exception as e:
        print(f"Error in AI analysis: {str(e)}")
        # Return error result
        error_result = {
            "taskAnalysis": [],
            "taskAssignment": [],
            "userTaskMapping": [],
            "error": str(e)
        }
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(error_result, f, ensure_ascii=False, indent=2)
        return error_result

def main():
    """Main function to run the AI integration"""
    if len(sys.argv) < 4:
        print("Usage: python ai_integration.py <task_file> <user_file> <output_file> [api_key]")
        sys.exit(1)

    task_file = sys.argv[1]
    user_file = sys.argv[2]
    output_file = sys.argv[3]
    api_key = sys.argv[4] if len(sys.argv) > 4 else None

    # Check if input files exist
    if not os.path.exists(task_file):
        print(f"Error: Task file {task_file} not found")
        sys.exit(1)

    if not os.path.exists(user_file):
        print(f"Error: User file {user_file} not found")
        sys.exit(1)

    # Run AI analysis
    result = run_ai_analysis(task_file, user_file, output_file, api_key)

    if result.get('error'):
        print(f"AI analysis completed with error: {result['error']}")
        sys.exit(1)
    else:
        print("AI analysis completed successfully")
        print(f"Results saved to: {output_file}")

if __name__ == "__main__":
    main()
