import re

with open('astro.config.mjs', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_next = 0

for i, line in enumerate(lines):
    if skip_next > 0:
        skip_next -= 1
        continue

    # Detect start of old adapter block
    if line.startswith("const adapter = process.env.CF_WORKERS"):
        skip_next = 4  # skip 4 more lines (the ternary + empty line)
        continue

    # Replace 'adapter,' with new config
    if line.strip() == 'adapter,':
        new_lines.append('\toutput: "static",\n')
        new_lines.append('\tadapter: edgeoneAdapter(),\n')
        continue

    new_lines.append(line)

with open('astro.config.mjs', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Done')
