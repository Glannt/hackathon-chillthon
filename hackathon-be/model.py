import streamlit as st
import pandas as pd
import google.generativeai as genai
import re
import json

st.set_page_config(page_title="Tự động phân loại & chia task", layout="centered")

st.sidebar.title("🔑 Cấu hình Gemini API")
api_key = st.sidebar.text_input("Nhập API Key Gemini:", type="password")

if not api_key:
    st.warning("Vui lòng nhập API key Gemini để bắt đầu!")
    st.stop()

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

st.title("🤖 Phân tích & chia task tự động bằng Gemini AI (Có Task ID & Mapping User ↔ Task)")
st.info("B1: Nhập danh sách task. | B2: Nhập danh sách nhân viên. | B3: Kết quả phân loại, chia task, mapping và tải từng bảng ra JSON.")

def read_file_uploaded(uploaded_file, key_tasks=None, key_members=None):
    if uploaded_file is None:
        return None, None
    filename = uploaded_file.name.lower()
    if filename.endswith('.csv'):
        df = pd.read_csv(uploaded_file, encoding="utf-8-sig")
        lines = [f"{row[0]}{(' - ' + str(row[1])) if len(row)>1 else ''}" for row in df.values]
        return df, "\n".join([x for x in lines if x.strip()])
    elif filename.endswith('.json'):
        try:
            data = json.load(uploaded_file)
            if isinstance(data, list):
                df = pd.DataFrame(data)
                lines = [f"{row[0]}{(' - ' + str(row[1])) if len(row)>1 else ''}" for row in df.values]
                return df, "\n".join([x for x in lines if x.strip()])
            elif isinstance(data, dict):
                if key_tasks and key_tasks in data:
                    df = pd.DataFrame(data[key_tasks])
                elif key_members and key_members in data:
                    df = pd.DataFrame(data[key_members])
                else:
                    df = pd.DataFrame([data])
                lines = [f"{row[0]}{(' - ' + str(row[1])) if len(row)>1 else ''}" for row in df.values]
                return df, "\n".join([x for x in lines if x.strip()])
        except Exception as e:
            st.error(f"Lỗi đọc file JSON: {e}")
            return None, None
    else:
        st.error("Chỉ hỗ trợ file CSV hoặc JSON")
        return None, None

# Nhập task với Task ID
st.subheader("1️⃣ Danh sách task")
col1, col2 = st.columns(2)
with col1:
    tasks_file = st.file_uploader("Tải file task (.txt, .csv, .json)", type=["txt", "csv", "json"])
with col2:
    tasks_text = st.text_area(
        "Hoặc nhập/dán danh sách task (mỗi dòng 1 task, có thể kèm mô tả)",
        height=200,
        placeholder="Ví dụ:\nTạo giao diện đăng nhập\nTối ưu hóa truy vấn đơn hàng\nThiết lập backup lên cloud, deadline 3 ngày"
    )

df_task = None
if tasks_file:
    if tasks_file.name.endswith(".txt"):
        task_lines = tasks_file.read().decode("utf-8").splitlines()
        task_input = "\n".join([x for x in task_lines if x.strip()])
    else:
        df_task, task_input = read_file_uploaded(tasks_file, key_tasks="tasks")
elif tasks_text.strip():
    task_input = tasks_text.strip()
else:
    task_input = ""
    df_task = None

# Nhập thành viên
st.subheader("2️⃣ Danh sách thành viên")
col3, col4 = st.columns(2)
with col3:
    uploaded_members = st.file_uploader("Tải file CSV/JSON thành viên", type=["csv", "json"])
with col4:
    members_text = st.text_area(
        "Hoặc dán trực tiếp danh sách thành viên (mỗi dòng 1 người, phân tách bằng |):",
        height=160,
        placeholder="Ví dụ:\nNguyễn Văn A | Junior | 8 năm | React, NodeJS, 5 dự án lớn\nLê Thị B | Junior | 10 năm | Fullstack..."
    )

df_members = None
members_info = ""
if uploaded_members:
    try:
        df_members, members_info = read_file_uploaded(uploaded_members, key_members="members")
        st.success("Đã đọc xong dữ liệu thành viên từ file!")
        st.write(df_members)
    except Exception as e:
        st.error(f"Lỗi đọc file thành viên: {e}")
        df_members = None
elif members_text.strip():
    members_info = members_text.strip()
    st.success("Đã nhận dữ liệu thành viên từ text.")
    df_members = None

if not task_input or not members_info:
    st.warning("Vui lòng nhập đầy đủ danh sách task và danh sách thành viên!")
    st.stop()

# Prompt phân tích task
PROMPT_TASK = f"""
Bạn là AI trợ lý quản lý dự án phần mềm chuyên nghiệp.
Nhiệm vụ của bạn là phân tích và phân loại các task đầu vào, để hỗ trợ quá trình phân chia công việc hợp lý.

Dưới đây là danh sách các task, mỗi dòng gồm: Tên task, mô tả (có thể chưa đầy đủ hoặc chi tiết):

{task_input}

Với từng task, hãy:
1. Tạo thêm cột Task ID duy nhất cho từng task, ký hiệu như TASK01, TASK02... (không trùng nhau, dùng cho mapping về sau).
2. Xác định Loại task:
   - Low (dễ, cơ bản, mất ít thời gian)
   - Medium (mức trung bình, đòi hỏi một số kỹ năng nhất định)
   - High (khó, phức tạp, yêu cầu kỹ năng hoặc kinh nghiệm cao)
   - Urgent (gấp, cần ưu tiên xử lý ngay, deadline ngắn)
3. Phân tích Độ khó: Giải thích ngắn gọn tại sao task này thuộc loại trên.
4. Xác định Kỹ năng chính cần thiết (ví dụ: React, Backend, SQL, AWS, Testing, Communication…)
5. Ước lượng khối lượng công việc (Workload):
   - Small (nhỏ, dưới 4 giờ)
   - Medium (4-16 giờ)
   - Large (trên 16 giờ)
6. Xác định Mức độ ưu tiên: Chấm điểm từ 1-5 (5 là ưu tiên nhất) và nêu lý do.

Trả về bảng markdown với các cột:
| Task ID | Tên task | Loại task | Độ khó (giải thích) | Kỹ năng chính | Khối lượng | Ưu tiên (1-5, lý do) |

Task ID là chuỗi không trùng nhau (TASK01, TASK02, ...).
Nếu task thiếu thông tin, hãy phán đoán dựa trên tên/mô tả và ghi rõ giả định.
"""

def parse_markdown_table(markdown_text):
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
if st.button("🚀 Phân tích & chia task tự động"):
    with st.spinner("Gemini AI đang phân tích & chia task..."):
        try:
            # PHÂN TÍCH TASK
            resp_task = model.generate_content(PROMPT_TASK)
            tasks_analysis = resp_task.text
            st.markdown("### 🎯 Bảng phân loại task (có Task ID):")
            st.markdown(tasks_analysis)
            df_task_analysis = parse_markdown_table(tasks_analysis)
            if df_task_analysis is not None:
                st.dataframe(df_task_analysis, hide_index=True)
                json_task_analysis = df_task_analysis.to_json(orient="records", force_ascii=False, indent=2)
                st.download_button(
                    label="Tải bảng Phân tích Task (JSON)",
                    data=json_task_analysis,
                    file_name="Task_Analysis.json",
                    mime="application/json"
                )

            # CHIA TASK
            PROMPT_ASSIGN = f"""
Bạn là AI trợ lý quản lý dự án, nhiệm vụ của bạn là phân chia công việc cho các thành viên trong nhóm một cách thông minh, công bằng và tối ưu hóa hiệu quả.
Hãy thực hiện phân chia task theo các hướng dẫn và quy tắc sau đây.

--- DỮ LIỆU THÀNH VIÊN ---
{members_info}

--- DỮ LIỆU TASK ---
{tasks_analysis}

--- QUY TẮC PHÂN CHIA TASK ---
1. Phân loại task:
    - Low: Dễ, phù hợp Fresher hoặc Junior ít kinh nghiệm.
    - Medium: Trung bình, dành cho Junior có kinh nghiệm hoặc Medium.
    - High: Khó, yêu cầu Medium trở lên, ưu tiên Senior.
    - Urgent: Gấp, ưu tiên người nhiều kinh nghiệm, xử lý nhanh.
2. Phân chia thành viên cho từng loại task:
    - Low: 1-2 người/task (ưu tiên Fresher, Junior)
    - Medium: 2-3 người/task (ưu tiên Junior nhiều năm, Medium)
    - High: 2-4 người/task (ưu tiên Medium, Senior)
    - Urgent: 1-2 người/task (ưu tiên Senior, Medium nhiều kinh nghiệm)
3. Phân loại thành viên:
    - Fresher: <1 năm kinh nghiệm.
    - Junior: 1-4 năm kinh nghiệm (ghi rõ số năm).
    - Medium: 4-8 năm kinh nghiệm.
    - Senior: >8 năm kinh nghiệm.
4. Quy tắc so sánh và ưu tiên:
    - Với những thành viên cùng cấp bậc, người có nhiều năm kinh nghiệm hơn sẽ được chia nhiều việc hơn (chênh lệch 15-20%).
    - Nếu task gấp/khó, ưu tiên thành viên có thành tích nổi bật, nhiều năm thực chiến, kỹ năng phù hợp.
5. Cân đối tổng thể:
    - Khối lượng công việc nên được chia đều cho các thành viên (dựa trên loại task và khả năng).
    - Không ai được nhận quá 40% tổng khối lượng task của toàn dự án.
    - Nếu số lượng task không chia đều tuyệt đối, hãy giải thích lý do.
6. Không để một thành viên bị dồn quá nhiều loại task “Urgent” hoặc “High”, hãy cố gắng luân phiên nếu có thể.

--- YÊU CẦU ĐẦU RA ---
- Trả về 2 bảng markdown:
    1. | Task ID | Tên task | Loại task | Thành viên thực hiện (tên, vai trò, số năm KN) | Lý do phân chia | % khối lượng công việc mỗi người.
    2. | Task ID | Thành viên (tên) | (Mỗi dòng: 1 cặp task-user, nếu 1 task nhiều người thì ghi thành nhiều dòng)
- Không cần bảng workload tổng hợp.
- Chỉ trả về đúng định dạng bảng mapping thứ hai (Task ID, Thành viên) là đủ.
"""
            resp_assign = model.generate_content(PROMPT_ASSIGN)
            st.markdown("### 💡 Kết quả chia task thông minh (có Task ID):")
            st.markdown(resp_assign.text)

            # BẢNG CHIA TASK CHI TIẾT
            df_assign = None
            all_tables = re.findall(r"((?:\|[^\n]*\|\n)+)", resp_assign.text)
            if all_tables:
                for tbl in all_tables:
                    lines = [line for line in tbl[0].split('\n') if line.strip().startswith('|')]
                    if len(lines) < 2:
                        continue
                    header = [h.strip() for h in lines[0].strip("|").split("|")]
                    if "Task ID" in header and any("Thành viên" in h or "user" in h.lower() for h in header):
                        try:
                            data = []
                            for row in lines[1:]:
                                cells = [c.strip() for c in row.strip("|").split("|")]
                                if len(cells) == len(header):
                                    data.append(cells)
                            df_assign = pd.DataFrame(data, columns=header)
                            break
                        except: pass
            if df_assign is not None:
                st.markdown("### 📝 Bảng chia task chi tiết:")
                st.dataframe(df_assign, hide_index=True)
                json_assign = df_assign.to_json(orient="records", force_ascii=False, indent=2)
                st.download_button(
                    label="Tải bảng Chia Task (JSON)",
                    data=json_assign,
                    file_name="Task_Assignment.json",
                    mime="application/json"
                )

            # BẢNG MAPPING AI
            df_mapping = extract_mapping_user_task(resp_assign.text)
            if df_mapping is not None:
                st.markdown("### 🔗 Bảng mapping User ↔ Task (tự động sinh):")
                st.dataframe(df_mapping, hide_index=True)
                json_mapping = df_mapping.to_json(orient="records", force_ascii=False, indent=2)
                st.download_button(
                    label="Tải bảng Mapping (JSON)",
                    data=json_mapping,
                    file_name="User_Task_Mapping.json",
                    mime="application/json"
                )
            else:
                st.info("Không tự động tìm được bảng mapping User ↔ Task từ kết quả AI.")

        except Exception as e:
            st.error(f"Lỗi: {e}")
