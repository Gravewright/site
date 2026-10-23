"""Original noninteractive demonstration PDF; GPL-3.0-only."""
from pathlib import Path
import sys

def original_pdf():
    """An original, noninteractive adventure record; no rulebook or system text."""
    drawing = ['0.97 0.96 0.92 rg 0 0 595 842 re f', '0.12 0.18 0.17 rg',
        'BT /Helv 25 Tf 40 790 Td (MOONFALL COMPANY) Tj ET',
        'BT /Helv 11 Tf 40 767 Td (Adventure record - original demonstration sheet) Tj ET']
    for label, y, width in [('NAME',700,510),('VITALITY',600,150),('RESOLVE',600,150),('SUPPLIES',500,150)]:
        x = 330 if label == 'RESOLVE' else 40
        drawing += [f'BT /Helv 11 Tf {x} {y+45} Td ({label}) Tj ET',
                    f'0.45 0.50 0.43 RG 1 w {x} {y} {width} 34 re S']
    drawing += ['BT /Helv 11 Tf 40 445 Td (EXPEDITION NOTES) Tj ET']
    for y in range(410,120,-36): drawing += [f'0.67 0.69 0.61 RG 0.5 w 40 {y} m 550 {y} l S']
    drawing += ['0.3 0.36 0.31 rg BT /Helv 10 Tf 40 60 Td (The lanterns still burn. Your next story starts here.) Tj ET']
    stream = ('\n'.join(drawing)+'\n').encode('ascii')
    objects=[b'<< /Type /Catalog /Pages 2 0 R >>',b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /Helv 4 0 R >> >> /Contents 5 0 R >>',
        b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        b'<< /Length '+str(len(stream)).encode()+b' >>\nstream\n'+stream+b'endstream']
    output=bytearray(b'%PDF-1.4\n'); offsets=[]
    for i,obj in enumerate(objects,1): offsets.append(len(output)); output.extend(f'{i} 0 obj\n'.encode()+obj+b'\nendobj\n')
    start=len(output);output.extend(f'xref\n0 {len(objects)+1}\n0000000000 65535 f \n'.encode())
    for offset in offsets:output.extend(f'{offset:010d} 00000 n \n'.encode())
    output.extend(f'trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{start}\n%%EOF\n'.encode())
    return bytes(output)

if __name__ == "__main__":
    Path(sys.argv[1]).write_bytes(original_pdf())
