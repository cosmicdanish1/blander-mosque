"""Merge within architectural sections and export a compact, textured GLB."""
import bpy
import json
from pathlib import Path
from mathutils import Vector, Matrix

OUT=Path('F:/blander-mosque/output')
master=bpy.data.scenes['Sector_6_Mosque']
bpy.context.window.scene=master
depsgraph=bpy.context.evaluated_depsgraph_get()
source_groups=[o for o in master.objects if o.type=='EMPTY' and 'section' in o]
old=bpy.data.scenes.get('Web_Export')
if old:
    for obj in list(old.objects):bpy.data.objects.remove(obj,do_unlink=True)
    bpy.data.scenes.remove(old)
web=bpy.data.scenes.new('Web_Export')
root=bpy.data.objects.new('Mosque_Web',None)
web.collection.objects.link(root)
root['units']='metres'
root['source']='Sector 6 Mosque, Bhilai; reference-based reconstruction'
records=[]
for source in source_groups:
    section=source['section']
    parent=bpy.data.objects.new('section__'+section,None)
    web.collection.objects.link(parent)
    parent.parent=root
    for key in ['section','build_order','independent_visibility','independent_opacity']:
        parent[key]=source[key]
    pieces=[]
    for obj in source.children:
        if obj.type!='MESH':continue
        evaluated=obj.evaluated_get(depsgraph)
        mesh=bpy.data.meshes.new_from_object(evaluated,preserve_all_data_layers=True,depsgraph=depsgraph)
        mesh.transform(obj.matrix_world)
        copy=bpy.data.objects.new('web_'+obj.name,mesh)
        web.collection.objects.link(copy)
        pieces.append(copy)
    if not pieces:continue
    bpy.context.window.scene=web
    for o in web.objects:o.select_set(False)
    for o in pieces:o.select_set(True)
    bpy.context.view_layer.objects.active=pieces[0]
    if len(pieces)>1:bpy.ops.object.join()
    mesh=pieces[0]
    mesh.name='mesh__'+section
    bounds=[v.co for v in mesh.data.vertices]
    bottom=Vector(((min(v.x for v in bounds)+max(v.x for v in bounds))/2,
                   (min(v.y for v in bounds)+max(v.y for v in bounds))/2,min(v.z for v in bounds)))
    if 'hinge_world_blender' in source:
        bottom=Vector(source['hinge_world_blender'])
    mesh.data.transform(Matrix.Translation(-bottom))
    parent.location=bottom
    mesh.parent=parent
    mesh['section']=section
    mesh['build_order']=source['build_order']
    mesh['reveal_axis']='world_y_gltf'
    records.append({'section':section,'node':parent.name,'mesh':mesh.name,'buildOrder':int(source['build_order']),
                    'materialCount':len(mesh.data.materials),'vertices':len(mesh.data.vertices)})
    bpy.context.window.scene=master
bpy.context.window.scene=web
for o in web.objects:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'sector-6-mosque-web.glb'),export_format='GLB',
    use_selection=True,use_active_scene=True,export_extras=True,export_apply=True,export_yup=True,
    export_cameras=False,export_lights=False,export_materials='EXPORT',
    export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,
    export_draco_position_quantization=16,export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=14)
(OUT/'web-segments.json').write_text(json.dumps({'sections':records,'compression':'KHR_draco_mesh_compression',
    'opacity':'Clone each mesh material before setting opacity to avoid affecting other sections.',
    'reveal':'Use glTF world Y as the vertical reveal direction. No animation is baked.'},indent=2),encoding='utf-8')
bpy.context.window.scene=master
for o in master.objects:o.select_set(False)
master.camera=next(o for o in master.objects if o.name.startswith('Camera_01_ThreeQuarter'))
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'sector-6-mosque.blend'))
print(json.dumps({'sections':len(records),'web_size_mb':round((OUT/'sector-6-mosque-web.glb').stat().st_size/1048576,2),
                  'material_primitives':sum(r['materialCount'] for r in records)}))
