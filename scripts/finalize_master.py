"""Refresh the full-detail interchange file and statistics from the saved master."""
import bpy
import json
from pathlib import Path

out = Path('F:/blander-mosque/output')
scene = bpy.data.scenes['Sector_6_Mosque']
bpy.context.window.scene = scene
for obj in scene.objects:
    obj.select_set(obj.type == 'MESH' or (obj.type == 'EMPTY' and ('section' in obj or obj.name.startswith('MOSQUE_ROOT'))))
bpy.ops.export_scene.gltf(
    filepath=str(out / 'sector-6-mosque.glb'),
    export_format='GLB',
    use_selection=True,
    use_active_scene=True,
    export_extras=True,
    export_apply=True,
    export_yup=True,
    export_cameras=False,
    export_lights=False,
    export_texcoords=True,
    export_normals=True,
    export_materials='EXPORT',
)
meshes = [obj for obj in scene.objects if obj.type == 'MESH']
stats = {
    'objects': len(meshes),
    'sections': sum(obj.type == 'EMPTY' and 'section' in obj for obj in scene.objects),
    'vertices': sum(len(obj.data.vertices) for obj in meshes),
    'triangles_base': sum(len(face.vertices) - 2 for obj in meshes for face in obj.data.polygons),
    'blend': str(out / 'sector-6-mosque.blend'),
    'glb': str(out / 'sector-6-mosque.glb'),
    'web_glb': str(out / 'sector-6-mosque-web.glb'),
}
(out / 'build-stats.json').write_text(json.dumps(stats, indent=2), encoding='utf-8')
print('FINAL_STATS ' + json.dumps(stats))
