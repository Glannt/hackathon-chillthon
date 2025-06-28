import re

# Test log line from activity.log
test_line = "INFO 2025-06-27 17:14:46,686 Dashboard accessed by user: admin (System Administrator) at 2025-06-27 10:14:46.686802+00:00"

# Current regex pattern
pattern = r'(\w+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}),(\d+)\s+(.+)'

print("Testing regex pattern...")
print(f"Test line: {test_line}")
print(f"Pattern: {pattern}")

match = re.match(pattern, test_line)
if match:
    level, timestamp, milliseconds, message = match.groups()
    print(f"✅ Match successful!")
    print(f"Level: {level}")
    print(f"Timestamp: {timestamp}")
    print(f"Milliseconds: {milliseconds}")
    print(f"Message: {message}")
else:
    print("❌ No match found!")
    
    # Try alternative patterns
    print("\nTrying alternative patterns...")
    
    # Pattern 1: More flexible
    pattern1 = r'(\w+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}),(\d+)\s+(.+)'
    match1 = re.match(pattern1, test_line)
    print(f"Pattern 1: {'✅' if match1 else '❌'}")
    
    # Pattern 2: Simpler
    pattern2 = r'(\w+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}),(\d+)\s+(.+)'
    match2 = re.match(pattern2, test_line)
    print(f"Pattern 2: {'✅' if match2 else '❌'}")
    
    # Pattern 3: Most flexible
    pattern3 = r'(\w+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}),(\d+)\s+(.+)'
    match3 = re.match(pattern3, test_line)
    print(f"Pattern 3: {'✅' if match3 else '❌'}")
    
    if match3:
        level, timestamp, milliseconds, message = match3.groups()
        print(f"✅ Pattern 3 works!")
        print(f"Level: {level}")
        print(f"Timestamp: {timestamp}")
        print(f"Milliseconds: {milliseconds}")
        print(f"Message: {message}") 