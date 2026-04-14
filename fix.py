content = open('src/PhysicsQuest.jsx', encoding='utf-8').read()
replacements = {
    '??': '!',
    '??': '?',
    '??': 'a',
    '??': 'e',
    '??': 'i',
    '??': 'o',
    '??': 'u',
    '??': 'n',
    '?\x93': 'O',
    '?\x81': 'A',
    '?\x89': 'E',
    '?\x8d': 'I',
    '?\x91': 'N',
    '??"': '-',
    '?\x80\x99': "'",
    '?\x86\x92': '->',
    '?\x89\xa4': '<=',
}
for bad, good in replacements.items():
    content = content.replace(bad, good)
open('src/PhysicsQuest.jsx', 'w', encoding='utf-8').write(content)
print('Listo')
