"""Check the delivered GLB and compare its re-imported sections to the master."""
import bpy
import json
import math
import struct
from pathlib import Path
from mathutils import Vector

OUT=Path('F:/blander-mosque/output')
master=bpy.data.scenes['Sector_6_Mosque']
bpy.context.window.scene=master
bpy.context.view_layer.update()
def bounds(objects):
    pts=[o.matrix_world@Vector(c) for o in objects if o.type=='MESH' for c in o.bound_box]
    return [min(p[i] for p in pts) for i in range(3)]+[max(p[i] for p in pts) for i in range(3)]
original={o['section']:bounds(o.children) for o in master.objects if o.type=='EMPTY' and 'section' in o}
path=OUT/'sector-6-mosque-web.glb'
with path.open('rb') as f:
    magic,version,length=struct.unpack('<4sII',f.read(12))
    assert magic==b'glTF' and version==2 and length==path.stat().st_size
    chunk_length,chunk_type=struct.unpack('<II',f.read(8))
    gltf=json.loads(f.read(chunk_length))
assert len(gltf['scenes'])==1,'Unexpected extra scenes in web file'
assert len(gltf['meshes'])==24,'Web mesh batching failed'
assert not gltf.get('animations'),'Animation must remain unbaked'
assert all('bufferView' in i for i in gltf['images']),'External texture dependency'
assert len(gltf['images'])==8,'Expected four base maps and four normal maps'
assert 'KHR_draco_mesh_compression' in gltf['extensionsUsed']
section_nodes={n['extras']['section']:n for n in gltf['nodes'] if n.get('name','').startswith('section__')}
assert set(section_nodes)==set(original),'Missing architecture sections'
assert all('build_order' in n['extras'] for n in section_nodes.values())
test=bpy.data.scenes.new('GLB_roundtrip_check')
bpy.context.window.scene=test
bpy.ops.import_scene.gltf(filepath=str(path))
bpy.context.view_layer.update()
errors=[]
for o in test.objects:
    if not o.name.startswith('section__'):continue
    section=o['section']
    b=bounds(o.children_recursive)
    delta=max(abs(a-c) for a,c in zip(original[section],b))
    errors.append({'section':section,'maxBoundsErrorMetres':delta})
    assert delta < .025, (section, delta, original[section], b)
meshes=[o for o in test.objects if o.type=='MESH']
assert all(len(o.data.uv_layers)>0 for o in meshes)
assert all(math.isfinite(c) for o in meshes for v in o.data.vertices for c in v.co)
stats={'passed':True,'sections':len(section_nodes),'webMeshes':len(gltf['meshes']),
       'materialPrimitives':sum(len(m['primitives']) for m in gltf['meshes']),
       'embeddedTextures':len(gltf['images']),'triangles':sum(len(p.vertices)-2 for o in meshes for p in o.data.polygons),
       'sizeMB':round(path.stat().st_size/1048576,2),'roundtripBounds':errors}
(OUT/'validation.json').write_text(json.dumps(stats,indent=2),encoding='utf-8')
print('VALIDATION_PASS '+json.dumps({k:v for k,v in stats.items() if k!='roundtripBounds'}))
