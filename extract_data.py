import os
import re

sections_dir = 'src/components/sections'
data_dir = 'src/data'
os.makedirs(data_dir, exist_ok=True)

targets = {
    'Projects.tsx': ('projects', 'projects.ts'),
    'Skills.tsx': ('skillCategories', 'skills.ts'),
    'Experience.tsx': ('experiences', 'experience.ts'),
    'Education.tsx': ('education', 'education.ts'),
    'Stats.tsx': ('stats', 'stats.ts')
}

for filename, (var_name, out_file) in targets.items():
    filepath = os.path.join(sections_dir, filename)
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Regex to find `const varName = [...];`
    pattern = re.compile(rf'(const\s+{var_name}\s*=\s*\[.*?\];)', re.DOTALL)
    match = pattern.search(content)
    if match:
        extracted = match.group(1)
        
        # Write to data file
        data_content = f"export {extracted}\n"
        with open(os.path.join(data_dir, out_file), 'w') as f:
            f.write(data_content)
        
        # Replace in component file
        import_stmt = f"import {{ {var_name} }} from '@/data/{out_file[:-3]}';\n"
        new_content = content.replace(extracted, import_stmt)
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Extracted {var_name} from {filename}")
    else:
        print(f"Could not find {var_name} in {filename}")
