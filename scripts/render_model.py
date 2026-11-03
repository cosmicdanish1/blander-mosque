import bpy
import sys
from pathlib import Path

out = Path('F:/blander-mosque/output')
scene = bpy.data.scenes['Sector_6_Mosque']
bpy.context.window.scene = scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.resolution_x = 1500
scene.render.resolution_y = 1100
scene.render.resolution_percentage = 100
args = sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else ['front', 'three-quarter', 'detail']
views = {'front': 'Camera_02_Front', 'three-quarter': 'Camera_01_ThreeQuarter', 'detail': 'Camera_03_FacadeDetail', 'rear': 'Camera_04_Rear'}
for view in args:
    scene.camera = next(o for o in scene.objects if o.name.startswith(views[view]))
    scene.render.filepath = str(out / ('mosque-' + view + '.png'))
    bpy.ops.render.render(write_still=True)
