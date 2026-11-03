"""Reference-based, segmented exterior reconstruction of the Sector 6 mosque.

Coordinates: metres, X across the frontage, -Y toward the entrance, Z up.
Unseen rear elevations and dimensions are approximate, not surveyed geometry.
"""
import bpy
import math
import json
import os
import random
from pathlib import Path
from mathutils import Vector
from mathutils.geometry import tessellate_polygon
import numpy as np

ROOT = Path('F:/blander-mosque')
OUT = ROOT / 'output'
TEX = OUT / 'textures'
OUT.mkdir(exist_ok=True)
TEX.mkdir(exist_ok=True)
random.seed(6)
SCENE_NAME = 'Sector_6_Mosque'
old = bpy.data.scenes.get(SCENE_NAME)
if old:
    for obj in list(old.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.scenes.remove(old)
for obj in list(bpy.data.objects):
    if obj.users == 0 and ('build_order' in obj or obj.name.startswith('MOSQUE_ROOT')):
        bpy.data.objects.remove(obj)
for coll in list(bpy.data.collections):
    if coll.users == 0 and coll.name[:3] in ['00_', '10_', '20_', '30_', '35_', '40_', '50_', '55_', '60_', '70_', '80_', '90_', '99_']:
        bpy.data.collections.remove(coll)
scene = bpy.data.scenes.new(SCENE_NAME)
bpy.context.window.scene = scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1
scene['reference_status'] = 'Photo-based reconstruction; unsurveyed dimensions and inferred rear.'
scene['excluded_context'] = 'Trees, people, cars, bikes, wires, flags, adjacent buildings, loose clutter'
scene['front_direction'] = '-Y in Blender; +Z in glTF'
collections = {}
groups = {}

def collection(name):
    c = bpy.data.collections.new(name)
    scene.collection.children.link(c)
    collections[name] = c
    return c

for name in ['00_Site', '10_Foundation', '20_Hall', '30_Arcades', '35_Pavilions',
             '40_Roof', '50_UpperHall', '55_Jali', '60_Dome', '70_Minaret',
             '80_Boundary', '90_Gates', '99_Presentation']:
    collection(name)

root = bpy.data.objects.new('MOSQUE_ROOT', None)
collections['10_Foundation'].objects.link(root)
root['asset'] = 'Bhilai Sector 6 mosque'
root['units'] = 'metres'
root['version'] = '1.0-reference-reconstruction'

def group(name, category, order):
    o = bpy.data.objects.new(name, None)
    collections[category].objects.link(o)
    o.parent = root
    o['section'] = name
    o['build_order'] = order
    o['independent_visibility'] = True
    o['independent_opacity'] = True
    groups[name] = o
    return o

for args in [
    ('site', '00_Site', 0), ('foundation', '10_Foundation', 10),
    ('prayer_hall', '20_Hall', 20), ('front_arcade', '30_Arcades', 30),
    ('left_arcade', '30_Arcades', 31), ('right_arcade', '30_Arcades', 32),
    ('left_pavilion', '35_Pavilions', 35), ('right_pavilion', '35_Pavilions', 36),
    ('terrace', '40_Roof', 40), ('upper_hall', '50_UpperHall', 50),
    ('upper_front', '50_UpperHall', 51), ('jali_left', '55_Jali', 55),
    ('jali_right', '55_Jali', 56), ('main_dome', '60_Dome', 65),
    ('main_finial', '60_Dome', 68), ('minaret_base', '70_Minaret', 45),
    ('minaret_shaft', '70_Minaret', 60), ('minaret_crown', '70_Minaret', 75),
    ('boundary_front', '80_Boundary', 15), ('boundary_left', '80_Boundary', 15),
    ('boundary_right', '80_Boundary', 15), ('boundary_rear', '80_Boundary', 15),
    ('entrance_gate_left', '90_Gates', 80), ('entrance_gate_right', '90_Gates', 80),
]:
    group(*args)

def noise(n, cells, seed):
    rng = np.random.default_rng(seed)
    grid = rng.random((cells, cells), dtype=np.float32)
    axis = np.arange(n, dtype=np.float32) * cells / n
    ix = axis.astype(np.int32)
    t = axis - ix
    t = t * t * (3 - 2 * t)
    a = grid[ix[:, None] % cells, ix[None, :] % cells]
    b = grid[(ix[:, None] + 1) % cells, ix[None, :] % cells]
    c = grid[ix[:, None] % cells, (ix[None, :] + 1) % cells]
    d = grid[(ix[:, None] + 1) % cells, (ix[None, :] + 1) % cells]
    return (a*(1-t[:, None])+b*t[:, None])*(1-t[None, :]) + (c*(1-t[:, None])+d*t[:, None])*t[None, :]

def texture(name, kind, n=1024):
    yy, xx = np.mgrid[0:n, 0:n].astype(np.float32) / n
    broad = noise(n, 6, 15)
    medium = noise(n, 28, 24)
    fine = noise(n, 180, 61)
    if kind == 'marble':
        vein = np.exp(-np.abs(np.sin((xx*6+yy*5+1.6*broad+.28*medium)*math.tau))*26)
        value = .84 + .09*broad + .035*medium - .065*vein
        row = np.floor(yy*8)
        tx = (xx*4 + (row % 2)*.5) % 1
        ty = yy*8 % 1
        mortar = (tx < .009) | (ty < .014)
        blocks = np.sin(np.floor(xx*4+(row % 2)*.5)*17+row*31)*.028
        value += blocks
        value[mortar] = .66
        rgb = np.stack([value*.99, value, value*1.012], axis=-1)
    elif kind == 'floor':
        vein = np.exp(-np.abs(np.sin((xx*8+yy*6+2*broad+.5*medium)*math.tau))*19)
        value = .81 + broad*.1 + medium*.035 - vein*.16
        mortar = (xx*4 % 1 < .012) | (yy*4 % 1 < .012)
        value[mortar] = .52
        rgb = np.stack([value*.99, value, value*1.005], axis=-1)
    elif kind == 'roof':
        value = .30 + broad*.13 + medium*.06 + fine*.025
        rgb = np.stack([value*.97, value, value*.98], axis=-1)
    else:
        value = .84 + broad*.07 + medium*.025 + fine*.014
        rgb = np.stack([value*1.015, value*1.014, value], axis=-1)
    rgba = np.ones((n,n,4), dtype=np.float32)
    rgba[:,:,:3] = np.clip(rgb,0,1)
    im = bpy.data.images.new(name, width=n, height=n)
    im.pixels.foreach_set(rgba.ravel())
    im.filepath_raw = str(TEX / (name+'.png'))
    im.file_format = 'PNG'
    im.save()
    im.pack()
    height = rgba[:,:,:3].mean(axis=-1)
    dx = (np.roll(height,-1,axis=1)-np.roll(height,1,axis=1))*1.6
    dy = (np.roll(height,-1,axis=0)-np.roll(height,1,axis=0))*1.6
    normal = np.stack([-dx,-dy,np.ones_like(dx)],axis=-1)
    normal /= np.linalg.norm(normal,axis=-1,keepdims=True)
    rgba[:,:,:3]=normal*.5+.5
    nm=bpy.data.images.new(name+'_normal',width=n,height=n)
    nm.colorspace_settings.name='Non-Color'
    nm.pixels.foreach_set(rgba.ravel())
    nm.filepath_raw=str(TEX/(name+'_normal.png'))
    nm.file_format='PNG';nm.save();nm.pack()
    im['normal_image']=nm.name
    return im

def material(name, color, roughness=.65, metallic=0, tex=None):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color,1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color,1)
    p.inputs['Roughness'].default_value = roughness
    p.inputs['Metallic'].default_value = metallic
    if tex:
        t = m.node_tree.nodes.new('ShaderNodeTexImage')
        t.image = tex
        m.node_tree.links.new(t.outputs['Color'], p.inputs['Base Color'])
        nt = m.node_tree.nodes.new('ShaderNodeTexImage')
        nt.image=bpy.data.images[tex['normal_image']]
        normal=m.node_tree.nodes.new('ShaderNodeNormalMap')
        normal.inputs['Strength'].default_value=.65
        m.node_tree.links.new(nt.outputs['Color'],normal.inputs['Color'])
        m.node_tree.links.new(normal.outputs['Normal'],p.inputs['Normal'])
    return m

marble = material('Marble | pale grey rectangular cladding', (.78,.80,.80), .38, tex=texture('marble_cladding','marble'))
plaster = material('Plaster | warm mineral white', (.86,.85,.81), .83, tex=texture('lime_plaster','plaster'))
floor = material('Floor | veined white stone', (.77,.78,.77), .36, tex=texture('courtyard_marble','floor'))
roofmat = material('Terrace | weathered concrete', (.34,.36,.35), .91, tex=texture('roof_concrete','roof'))
trim = material('Borders | deep green stone', (.027,.067,.06), .38)
mint = material('Boundary | pale turquoise', (.35,.68,.60), .76)
green = material('Post caps | forest green', (.07,.20,.11), .53)
metal = material('Grilles | aged ivory metal', (.69,.73,.70), .4, .48)
jalis = material('Jali | carved pale stone', (.78,.77,.70), .68)
dark = material('Recess | shadow charcoal', (.044,.052,.048), .92)
bronze = material('Finials | aged brass', (.29,.25,.13), .33, .72)
ground = material('Site | neutral concrete', (.44,.46,.44), .95)
joint = material('Joints | cool grey', (.38,.42,.40), .87)

def uv_project(obj, scale=2.8):
    mesh = obj.data
    uv = mesh.uv_layers.new(name='UVMap')
    for face in mesh.polygons:
        axis = max(range(3), key=lambda a: abs(face.normal[a]))
        axes = [(1,2),(0,2),(0,1)][axis]
        for li in face.loop_indices:
            v = mesh.vertices[mesh.loops[li].vertex_index].co + obj.location
            uv.data[li].uv = (v[axes[0]]/scale, v[axes[1]]/scale)

def mesh_obj(name, vertices, faces, mat, section, bevel=0):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    o = bpy.data.objects.new(name, mesh)
    parent = groups[section]
    parent.users_collection[0].objects.link(o)
    o.parent = parent
    o['section'] = section
    o['build_order'] = parent['build_order']
    o['element'] = name
    o.data.materials.append(mat)
    uv_project(o)
    if bevel:
        b = o.modifiers.new('Stone edge softness', 'BEVEL')
        b.width = bevel
        b.segments = 2
    return o

def box(name, loc, size, mat, section, bevel=.015):
    x,y,z = (s/2 for s in size)
    verts = [(a*x,b*y,c*z) for a,b,c in [(-1,-1,-1),(-1,-1,1),(-1,1,-1),(-1,1,1),(1,-1,-1),(1,-1,1),(1,1,-1),(1,1,1)]]
    faces = [(0,4,6,2),(1,3,7,5),(0,1,5,4),(2,6,7,3),(0,2,3,1),(4,5,7,6)]
    verts = [(v[0]+loc[0],v[1]+loc[1],v[2]+loc[2]) for v in verts]
    return mesh_obj(name,verts,faces,mat,section,bevel)

def prism(name, polygon, yfront, depth, mat, section, bevel=0):
    # Triangulate concave profiles explicitly so GLB and Blender agree.
    poly = [Vector((x,0,z)) for x,z in polygon]
    tris = tessellate_polygon([poly])
    lookup = {tuple(v):i for i,v in enumerate(poly)}
    n = len(poly)
    verts = [(x,yfront,z) for x,z in polygon] + [(x,yfront+depth,z) for x,z in polygon]
    faces=[]
    for tri in tris:
        ids = [v if isinstance(v, int) else lookup[tuple(v)] for v in tri]
        faces.extend([tuple(reversed(ids)),tuple(i+n for i in ids)])
    faces += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    return mesh_obj(name,verts,faces,mat,section,bevel)

def lines(name, paths, radius, mat, section, sides=6):
    verts=[]; faces=[]
    for points in paths:
        points=[Vector(p) for p in points]
        start=len(verts)
        for i,p in enumerate(points):
            tangent=(points[min(i+1,len(points)-1)]-points[max(0,i-1)]).normalized()
            ref=Vector((0,0,1)) if abs(tangent.z)<.94 else Vector((0,1,0))
            a=tangent.cross(ref).normalized(); b=tangent.cross(a).normalized()
            for j in range(sides):
                v=p+radius*(a*math.cos(j*math.tau/sides)+b*math.sin(j*math.tau/sides))
                verts.append(tuple(v))
        for i in range(len(points)-1):
            for j in range(sides):
                a=start+i*sides+j; b=start+i*sides+(j+1)%sides
                faces.append((a,b,b+sides,a+sides))
        faces.append(tuple(start+j for j in reversed(range(sides))))
        faces.append(tuple(start+(len(points)-1)*sides+j for j in range(sides)))
    return mesh_obj(name,verts,faces,mat,section)

def lathe(name, cx, cy, profile, mat, section, segments=64):
    verts=[];faces=[]
    for r,z in profile:
        for j in range(segments):
            a=j*math.tau/segments
            verts.append((cx+r*math.cos(a),cy+r*math.sin(a),z))
    for i in range(len(profile)-1):
        for j in range(segments):
            a=i*segments+j; b=i*segments+(j+1)%segments
            faces.append((a,b,b+segments,a+segments))
    faces.extend([tuple(reversed(range(segments))),tuple((len(profile)-1)*segments+j for j in range(segments))])
    obj=mesh_obj(name,verts,faces,mat,section)
    for p in obj.data.polygons:
        p.use_smooth = len(p.vertices)==4
    return obj

def smooth_profile(profile, subdivisions=5):
    result=[]
    for i in range(len(profile)-1):
        p0=Vector(profile[max(0,i-1)]);p1=Vector(profile[i])
        p2=Vector(profile[i+1]);p3=Vector(profile[min(len(profile)-1,i+2)])
        for j in range(subdivisions):
            t=j/subdivisions
            p=.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t)
            result.append(tuple(p))
    return result+[profile[-1]]

def arch_edge(cx, halfwidth, zbase, height, steps=28):
    # Two intersecting circle arcs reproduce the unusually tall pointed bays.
    center=(height*height-halfwidth*halfwidth)/(2*halfwidth)
    radius=center+halfwidth
    pts=[]
    for i in range(steps+1):
        z=height*i/steps
        x=center-math.sqrt(max(0,radius*radius-z*z))
        pts.append((cx+x,zbase+z))
    return pts + [(2*cx-x,z) for x,z in reversed(pts[:-1])]

def arch_bay(name,cx,y,section,width=4.2,zbase=.45,height=4.15,top=5.65,depth=.62):
    edge=arch_edge(cx,width*.46,zbase,height)
    poly=[(cx-width/2,zbase),*edge,(cx+width/2,zbase),(cx+width/2,top),(cx-width/2,top)]
    obj=prism(name,poly,y,depth,plaster,section,.018)
    crown=[(x,y-.025,z+.23+.10*math.cos((x-cx)*4)) for x,z in edge[3:-3]]
    lines(name+'_raised_arch_outline',[crown],.022,plaster,section)
    return obj

def frame(name,poly,y,mat,section,r=.045):
    return lines(name,[[(x,y,z) for x,z in poly+[poly[0]]]],r,mat,section,8)

def grille(name,poly,y,section,cell=.28,radius=.014):
    # Repeating eight-point stars, clipped to a convex panel outline.
    xmin=min(p[0] for p in poly);xmax=max(p[0] for p in poly)
    zmin=min(p[1] for p in poly);zmax=max(p[1] for p in poly)
    def inside(x,z):
        signs=[]
        for i,a in enumerate(poly):
            b=poly[(i+1)%len(poly)]
            cross=(b[0]-a[0])*(z-a[1])-(b[1]-a[1])*(x-a[0])
            if abs(cross)>1e-7: signs.append(cross>0)
        return all(signs) or not any(signs)
    paths=[]
    for ix in range(math.ceil((xmax-xmin)/cell)+1):
        for iz in range(math.ceil((zmax-zmin)/cell)+1):
            cx=xmin+(ix+.5)*cell;cz=zmin+(iz+.5)*cell
            pts=[]
            for k in range(17):
                a=k*math.pi/8
                r=cell*(.49 if k%2==0 else .24)
                pts.append((cx+r*math.cos(a),y,cz+r*math.sin(a)))
            for a,b in zip(pts,pts[1:]):
                if inside(a[0],a[2]) and inside(b[0],b[2]): paths.append([a,b])
            for dx,dz in [(cell,0),(0,cell)]:
                a=(cx+(cell*.49 if dx else 0),y,cz+(cell*.49 if dz else 0))
                b=(cx+dx-(cell*.49 if dx else 0),y,cz+dz-(cell*.49 if dz else 0))
                if inside(a[0],a[2]) and inside(b[0],b[2]): paths.append([a,b])
    return lines(name,paths,radius,jalis,section,4)

# Site and lower mosque. Architectural parts remain individually named.
box('Site_plinth',(0,7,-.23),(46,36,.4),ground,'site',.08)
box('Courtyard_foundation',(0,6,.04),(43,32,.24),plaster,'foundation',.04)
box('Courtyard_marble',(0,6,.19),(42.7,31.7,.10),floor,'foundation',.025)
box('Main_floor_plinth',(0,10,.36),(37.6,22,.3),marble,'foundation')
for side in [-1,1]:
    box('Front_step_'+str(side),(side*10.2,-1.15,.31),(16.5,.7,.18),marble,'foundation')
box('Entrance_step',(0,-1.0,.32),(4,.9,.18),marble,'foundation')
box('Prayer_hall_floor',(0,12,.52),(31,16,.10),floor,'prayer_hall')
box('Rear_wall',(0,20,2.96),(36.4,.4,5),plaster,'prayer_hall')
for x in [-14.5,14.5]:
    box('Side_hall_wall_'+str(x),(x,12.3,2.96),(.4,15,5),plaster,'prayer_hall')
box('Hall_rear_dado',(0,19.76,1.08),(35.7,.06,1.1),marble,'prayer_hall')
for x in [-13.0,-8.7,-4.35,0,4.35,8.7,13.0]:
    for y in [5.2,12.1,18.8]:
        box('Hall_column_%s_%s'%(x,y),(x,y,2.98),(.34,.34,5.05),plaster,'prayer_hall',.025)
        box('Column_foot_%s_%s'%(x,y),(x,y,.72),(.5,.5,.42),marble,'prayer_hall')
box('Hall_ceiling',(0,11,5.40),(36,19,.20),plaster,'prayer_hall')

for i in range(7):
    cx=(i-3)*4.25
    arch_bay('Front_pointed_bay_%02d'%(i+1),cx,-.15,'front_arcade',width=4.25)
box('Front_arcade_cornice',(0,-.04,5.68),(30.4,.94,.18),plaster,'front_arcade',.03)
box('Front_arcade_drip_edge',(0,-.32,5.79),(30.6,.96,.07),marble,'front_arcade')

# Side arcades are transformed as complete groups to keep local build axes coherent.
for side,section in [(-1,'left_arcade'),(1,'right_arcade')]:
    for i in range(4):
        arch_bay(section+'_bay_%02d'%(i+1),(i+.5)*4.0,0,section,width=4.0,height=4.12)
    box(section+'_cornice',(8,0,5.68),(16.4,.82,.18),plaster,section)
    g=groups[section]
    g.rotation_euler[2]=side*math.pi/2
    g.location=(side*18.05,3.65 if side==1 else 19.65,0)

for side,section in [(-1,'left_pavilion'),(1,'right_pavilion')]:
    cx=side*16.50
    box(section+'_body',(cx,1.65,3.25),(4.4,4.3,5.65),plaster,section,.045)
    box(section+'_foot',(cx,-.58,.55),(4.55,.42,.26),marble,section)
    box(section+'_cornice',(cx,1.64,6.16),(4.76,4.64,.30),plaster,section,.045)
    box(section+'_cornice_lip',(cx,1.64,6.37),(4.94,4.82,.12),marble,section,.025)
    inset=[(cx-1.5,1.02),(cx+1.5,1.02),(cx+1.5,5.15),(cx-1.5,5.15)]
    frame(section+'_recess_frame',inset,-.535,plaster,section,.095)
    edge=arch_edge(cx,1.1,2.40,1.85)
    frame(section+'_blind_arch',edge+[(cx-1.1,2.40)],-.558,plaster,section,.045)
    panel=[(cx-1.08,1.22),(cx+1.08,1.22),(cx+1.08,3.18),(cx-1.08,3.18)]
    prism(section+'_window_recess',panel,-.59,.04,dark,section)
    grille(section+'_star_jali',panel,-.635,section,.25,.011)
    frame(section+'_window_border',panel,-.66,marble,section,.036)
    circ=[(cx+.64*math.cos(i*math.tau/64),-.668,2.18+.64*math.sin(i*math.tau/64)) for i in range(65)]
    lines(section+'_medallion_ring',[circ],.025,metal,section)
    # Small mosque silhouette visible in the real grille medallions.
    silhouette=[[(cx-.43,-.70,1.90),(cx+.43,-.70,1.90)],[(cx-.35,-.70,1.90),(cx-.35,-.70,2.47)],[(cx+.35,-.70,1.90),(cx+.35,-.70,2.47)],[(cx,-.70,1.90),(cx,-.70,2.45)]]
    silhouette.append([(cx+.23*math.cos(i*math.pi/24),-.70,2.13+.23*math.sin(i*math.pi/24)) for i in range(25)])
    lines(section+'_medallion_mosque',silhouette,.025,metal,section)
    for dx in [-1.91,1.91]:
        for iz in range(15):
            box(section+'_edge_tooth_%s_%s'%(dx,iz),(cx+dx+(.065 if iz%2 else -.065),-.525,.83+iz*.32),(.15,.08,.25),plaster,section,.005)
    for ix in range(14):
        box(section+'_frieze_%02d'%ix,(cx-2+ix*.30,-.535,5.87),(.16,.08,.16),plaster,section,.006)
    for dx in [-.87,.87]:
        circ=[(cx+dx+.12*math.cos(i*math.tau/32),-.559,4.59+.12*math.sin(i*math.tau/32)) for i in range(33)]
        lines(section+'_crescent_relief_'+str(dx),[circ],.014,plaster,section)
    # Repeat the photographed recessed window motif on the exposed side face.
    existing=set(groups[section].children)
    side_panel=[(-1.08,1.22),(1.08,1.22),(1.08,3.18),(-1.08,3.18)]
    prism(section+'_side_window_recess',side_panel,-.01,.05,dark,section)
    grille(section+'_side_jali',side_panel,-.07,section,.25,.011)
    frame(section+'_side_window_frame',side_panel,-.095,marble,section,.038)
    frame(section+'_side_recess_frame',[(-1.5,1.02),(1.5,1.02),(1.5,5.15),(-1.5,5.15)],-.045,plaster,section,.085)
    frame(section+'_side_blind_arch',arch_edge(0,1.1,2.4,1.85),-.062,plaster,section,.044)
    for o in set(groups[section].children)-existing:
        for v in o.data.vertices:
            x,y,z=v.co
            v.co=(cx+side*(2.21-y),1.65+side*x,z)

# Broad flat roof, restrained parapets, and roof-level walking surface.
box('Terrace_structural_slab',(0,10.35,5.68),(37,20.7,.32),plaster,'terrace',.025)
box('Terrace_weathered_surface',(0,10.35,5.87),(36.7,20.4,.07),roofmat,'terrace')
for x in [-18.2,18.2]:
    box('Terrace_side_parapet_'+str(x),(x,12,6.27),(.18,16.6,.8),marble,'terrace')
    box('Terrace_side_cap_'+str(x),(x,12,6.7),(.24,16.7,.08),trim,'terrace')
box('Terrace_rear_parapet',(0,20.49,6.27),(36.5,.18,.8),marble,'terrace')
box('Terrace_rear_cap',(0,20.49,6.70),(36.7,.24,.08),trim,'terrace')
for x in [-12,-8,-4,0,4,8,12]:
    box('Roof_front_low_pier_'+str(x),(x,2.6,6.13),(.35,.4,.47),roofmat,'terrace')
for i in range(6):
    box('Upper_terrace_access_step_%02d'%i,(-8.1,7.7+i*.33,5.94+i*.12),(1.5,.35,.13+i*.24),marble,'terrace')

# Upper sanctuary, stepped dark outlines, paired trapezoid jali screens.
box('Upper_hall_pedestal',(0,11.35,6.3),(13.6,10.2,.76),marble,'upper_hall')
box('Upper_hall_body',(0,11.9,9.33),(12.8,9.6,5.45),marble,'upper_hall',.025)
box('Upper_hall_roof',(0,11.85,12.16),(13.1,9.9,.22),marble,'upper_hall')
front_poly=[(-7,6.96),(-5.84,12.32),(-3.65,12.32),(-3.65,12.7),(5.05,12.7),(5.05,7.02)]
prism('Upper_front_sculptural_white_frame',front_poly,6.67,.34,marble,'upper_front',.024)
frame('Upper_front_dark_perimeter',front_poly,6.635,trim,'upper_front',.047)
left_poly=[(-3.78,7.65),(-1.26,7.65),(-.60,11.92),(-3.78,12.39)]
right_poly=[(1.26,7.65),(4.4,7.65),(4.4,12.38),(.60,11.92)]
for name,poly in [('jali_left',left_poly),('jali_right',right_poly)]:
    prism(name+'_shadow',poly,6.59,.06,dark,name)
    grille(name+'_eight_point_stone_screen',poly,6.54,name,.235,.010)
    frame(name+'_green_inlay',poly,6.515,trim,name,.038)
wingwindow=[(-6.00,8.30),(-5.25,8.30),(-4.79,11.42),(-5.53,11.42)]
prism('Upper_left_slender_window',wingwindow,6.625,.03,dark,'upper_front')
frame('Upper_left_window_stone_reveal',wingwindow,6.60,trim,'upper_front',.052)
for x in [5.17,6.05]:
    box('Upper_right_vertical_blade_'+str(x),(x,7.39,9.71),(.56,1.8,5.72),marble,'upper_front')
    box('Upper_right_blade_dark_edge_'+str(x),(x+.30,6.48,9.71),(.065,.08,5.72),trim,'upper_front')
entry=arch_edge(0,.43,6.33,.8)
prism('Upper_central_arched_door',entry,6.19,.06,dark,'upper_front')
frame('Upper_central_door_reveal',entry,6.17,marble,'upper_front',.055)
for x in [-3.4,3.4]:
    p=[(x-2.5,6.37),(x+2.5,6.37),(x+2.5,6.85),(x-2.5,6.85)]
    prism('Upper_lower_vent_shadow_'+str(x),p,6.28,.1,dark,'upper_front')
    grille('Upper_lower_vent_'+str(x),p,6.25,'upper_front',.22,.009)

# The asymmetric upward swept canopy is the signature of this building.
canopy=[(-6.35,13.07),(-6.30,12.71),(-4.5,12.31),(0,11.95),(4.7,12.50),(5.78,12.81),(5.86,13.15),(5.75,13.19),(5.64,12.98),(0,12.34),(-4.5,12.66),(-6.14,13.02),(-6.20,13.24),(-6.36,13.24)]
prism('Swept_canopy_front_fascia',canopy,6.11,.52,marble,'upper_front',.012)
lines('Swept_canopy_dark_drip', [[(x,6.075,z) for x,z in canopy[:7]]],.034,trim,'upper_front')
prism('Canopy_center_crest',[(-.48,12.38),(0,12.96),(.48,12.38)],6.06,.18,marble,'upper_front')
frame('Canopy_crest_border',[(-.48,12.38),(0,12.96),(.48,12.38)],6.035,trim,'upper_front',.024)
for x in [-6.15,6.15]:
    box('Upper_side_coping_'+str(x),(x,11.7,12.63),(.30,9.65,.22),marble,'upper_hall')
    box('Upper_side_dark_coping_'+str(x),(x,11.7,12.77),(.32,9.65,.045),trim,'upper_hall')

# Dome and the separately selectable ribs, drum, and metal finial.
dome_profile=[(2.04,12.30),(2.13,12.44),(2.18,12.60),(2.40,12.93),(2.59,13.42),(2.64,13.96),(2.56,14.54),(2.34,15.08),(1.97,15.59),(1.49,16.02),(.96,16.32),(.47,16.54),(.26,16.75),(.22,16.87)]
dome_profile=smooth_profile(dome_profile)
lathe('Main_dome_drum',0,10.17,[(2.17,12.11),(2.17,12.47),(2.26,12.47),(2.26,12.60)],marble,'main_dome')
lathe('Main_onion_dome_shell',0,10.17,dome_profile,marble,'main_dome',96)
ribpaths=[]
for j in range(16):
    a=j*math.tau/16
    ribpaths.append([((r+.018)*math.cos(a),10.17+(r+.018)*math.sin(a),z) for r,z in dome_profile[2:]])
lines('Main_dome_sixteen_green_ribs',ribpaths,.027,trim,'main_dome',6)

def finial(name,cx,cy,z,scale,section):
    prof=[(.20,0),(.28,.09),(.13,.21),(.11,.35),(.25,.50),(.30,.59),(.15,.70),(.13,.86),(.18,1.02),(.10,1.14),(.06,1.40),(.025,1.58)]
    lathe(name+'_turned_spire',cx,cy,[(r*scale,z+h*scale) for r,h in prof],bronze,section,32)
    crescent=[]
    for i in range(41):
        a=math.radians(40)+i*math.radians(280)/40
        crescent.append((cx+.16*scale*math.sin(a),cy,z+1.75*scale+.16*scale*math.cos(a)))
    lines(name+'_crescent',[crescent],.024*scale,bronze,section,8)

finial('Main_dome_finial',0,10.17,16.78,1,'main_finial')

# Single minaret: narrow shaft, L-shaped foot, inset outline, double diamonds.
mx,my=9.4,7.0
box('Minaret_foundation_step',(mx+.5,my,6.02),(4.8,3.1,.27),marble,'minaret_base')
box('Minaret_foundation_upper',(mx+.5,my,6.27),(4.48,2.84,.25),marble,'minaret_base')
basepoly=[(mx-1.0,6.39),(mx+3.0,6.39),(mx+3.0,7.45),(mx+2.35,7.45),(mx+2.35,7.72),(mx+1.25,7.72),(mx+1.25,8.0),(mx-1,8.0)]
prism('Minaret_stepped_marble_base',basepoly,my-1.2,2.4,marble,'minaret_base',.02)
Lpoly=[(mx-1.08,7.85),(mx+3.0,7.85),(mx+3.0,9.36),(mx+2.27,9.36),(mx+2.27,8.70),(mx+1.04,8.70),(mx+1.04,22.49),(mx-1.08,22.49)]
prism('Minaret_L_shaped_shaft',Lpoly,my-1.02,2.04,marble,'minaret_shaft',.022)
frame('Minaret_front_dark_outline',Lpoly,my-1.055,trim,'minaret_shaft',.065)
for x in [mx-1.10,mx+1.06]:
    box('Minaret_rear_edge_'+str(x),(x,my+1.04,15.52),(.065,.065,13.95),trim,'minaret_shaft')
for z in [21.40,21.84,22.20]:
    box('Minaret_top_front_band_'+str(z),(mx,my-1.058,z),(2.14,.04,.045),trim,'minaret_shaft',0)
for dx in [.64,1.87]:
    diamond=[(mx+dx-.62,7.49),(mx+dx,7.83),(mx+dx+.62,7.49),(mx+dx,7.15)]
    frame('Minaret_diamond_'+str(dx),diamond,my-1.23,trim,'minaret_base',.044)

box('Minaret_balcony_support',(mx,my,22.53),(2.50,2.50,.20),trim,'minaret_crown')
box('Minaret_balcony_slab',(mx,my,22.70),(3.35,3.35,.20),marble,'minaret_crown',.045)
box('Minaret_balcony_edge',(mx,my,22.83),(3.46,3.46,.065),trim,'minaret_crown')
for dx in [-.92,.92]:
    prism('Minaret_front_corbel_'+str(dx),[(mx+dx-.14,22.07),(mx+dx+.14,22.07),(mx+dx+.35,22.60),(mx+dx-.35,22.60)],my-1.41,.34,marble,'minaret_crown')
lathe('Minaret_octagonal_lantern',mx,my,[(.94,22.82),(.94,24.30)],marble,'minaret_crown',8)
for i in range(8):
    a=i*math.tau/8+math.pi/8
    nx,ny=math.cos(a),math.sin(a)
    tx,ty=-ny,nx
    edge=arch_edge(0,.25,23.02,.90,18)
    verts=[(mx+nx*.872+tx*x,my+ny*.872+ty*x,z) for x,z in edge]
    m=mesh_obj('Lantern_arch_recess_%02d'%i,verts,[tuple(range(len(verts)))],dark,'minaret_crown')
    path=[(mx+nx*.883+tx*x,my+ny*.883+ty*x,z) for x,z in edge]
    lines('Lantern_arch_moulding_%02d'%i,[path],.037,marble,'minaret_crown')
    for offset in [-.11,0,.11]:
        lines('Lantern_window_bar_%s_%s'%(i,offset),[[(mx+nx*.89+tx*offset,my+ny*.89+ty*offset,23.05),(mx+nx*.89+tx*offset,my+ny*.89+ty*offset,23.66)]],.012,metal,'minaret_crown')
lathe('Lantern_eave',mx,my,[(.98,24.26),(1.04,24.32),(1.04,24.41)],marble,'minaret_crown',32)
smallprofile=[(.85,24.39),(.90,24.62),(.84,24.92),(.69,25.20),(.43,25.44),(.18,25.60),(.10,25.76)]
smallprofile=smooth_profile(smallprofile)
lathe('Minaret_small_dome',mx,my,smallprofile,marble,'minaret_crown',48)
paths=[]
for i in range(12):
    a=i*math.tau/12
    paths.append([(mx+(r+.012)*math.cos(a),my+(r+.012)*math.sin(a),z) for r,z in smallprofile])
lines('Minaret_small_dome_ribs',paths,.016,trim,'minaret_crown')
finial('Minaret_finial',mx,my,25.7,.56,'minaret_crown')
rail=[]
for axis in [0,1]:
    for side in [-1,1]:
        for z in [23.03,23.48]:
            p1=[mx,my,z];p2=[mx,my,z]
            p1[axis]-=1.48;p2[axis]+=1.48
            p1[1-axis]+=side*1.48;p2[1-axis]+=side*1.48
            rail.append([p1,p2])
        for j in range(13):
            p=[mx,my,22.91];p[axis]+=-1.48+j*2.96/12;p[1-axis]+=side*1.48
            rail.append([p,[p[0],p[1],23.48]])
lines('Minaret_balcony_ironwork',rail,.015,metal,'minaret_crown')
for dx in [-1.48,1.48]:
    for dy in [-1.48,1.48]:
        lathe('Minaret_corner_pinnacle_%s_%s'%(dx,dy),mx+dx,my+dy,[(.07,22.9),(.07,23.62),(.13,23.68),(.075,23.76),(.02,23.85)],marble,'minaret_crown',16)

# Boundary walls and rails. Each elevation is one independently controlled group.
def post(name,x,y,section,tall=False):
    h=2.45 if tall else 1.80
    box(name+'_shaft',(x,y,.24+h/2),(.42,.46,h),mint,section)
    box(name+'_foot',(x,y,.40),(.56,.58,.31),mint,section)
    box(name+'_capital',(x,y,.24+h),(.61,.64,.14),green,section)
    lathe(name+'_cap',x,y,[(.24,.24+h+.06),(.24,.24+h+.18),(.16,.24+h+.25),(.20,.24+h+.36),(.17,.24+h+.48),(.08,.24+h+.58),(.01,.24+h+.62)],green,section,20)

def fence(name,a,b,section):
    ax,ay=a;bx,by=b
    length=math.hypot(bx-ax,by-ay)
    wall=box(name+'_low_wall',((ax+bx)/2,(ay+by)/2,.51),(length,.20,.54),mint,section)
    center=Vector(((ax+bx)/2,(ay+by)/2,.51))
    angle=math.atan2(by-ay,bx-ax)
    if angle:
        for v in wall.data.vertices:
            p=v.co-center
            v.co.x=center.x+p.x*math.cos(angle)-p.y*math.sin(angle)
            v.co.y=center.y+p.x*math.sin(angle)+p.y*math.cos(angle)
    paths=[]
    for z in [.92,1.70]: paths.append([(ax,ay,z),(bx,by,z)])
    n=max(1,round(length/.18))
    for i in range(1,n):
        t=i/n;x=ax+(bx-ax)*t;y=ay+(by-ay)*t
        paths.append([(x,y,.80),(x,y,1.84)])
        paths.append([(x-.035,y,1.77),(x,y,1.88),(x+.035,y,1.77)])
    lines(name+'_metal_railings',paths,.012,metal,section,5)

xs=[-21,-18,-15,-12,-9,-6,-3,3,6,9,12,15,18,21]
for i,x in enumerate(xs): post('Front_post_%02d'%i,x,-7.35,'boundary_front',abs(x)==3)
for i,(a,b) in enumerate(zip(xs,xs[1:])):
    if a==-3 and b==3:continue
    fence('Front_fence_%02d'%i,(a,-7.35),(b,-7.35),'boundary_front')
for side,section in [(-1,'boundary_left'),(1,'boundary_right')]:
    ys=[-7.35,-3,1.5,6,10.5,15,19.5,22]
    for i,y in enumerate(ys[1:]):post(section+'_post_%02d'%i,side*21,y,section)
    for i,(a,b) in enumerate(zip(ys,ys[1:])):fence(section+'_fence_%02d'%i,(side*21,a),(side*21,b),section)
box('Rear_boundary_wall',(0,22,.98),(42,.25,1.5),mint,'boundary_rear')
box('Rear_boundary_coping',(0,22,1.78),(42.2,.35,.12),green,'boundary_rear')

for side,section in [(-1,'entrance_gate_left'),(1,'entrance_gate_right')]:
    paths=[]
    def gate_top(x):return 2.1+.95*(1-abs(x)/3)**.8
    xa,xb=(-2.75,-.045) if side==-1 else (.045,2.75)
    for z in [.42,1.10,1.78]: paths.append([(xa,-7.35,z),(xb,-7.35,z)])
    paths.append([(xa+(xb-xa)*i/32,-7.35,gate_top(xa+(xb-xa)*i/32)) for i in range(33)])
    for i in range(20):
        x=xa+(xb-xa)*i/19
        paths.append([(x,-7.35,.42),(x,-7.35,gate_top(x))])
    for x in [xa,xb]:paths.append([(x,-7.35,.35),(x,-7.35,gate_top(x)+.1)])
    lines(section+'_wrought_iron_leaf',paths,.020,metal,section,6)
    curls=[]
    for i in range(9):
        x=xa+.15+i*(xb-xa-.3)/8
        curls.append([(x+.105*math.cos(t*math.tau/24),-7.35,1.41+.23*math.sin(t*math.tau/24)) for t in range(25)])
    lines(section+'_scrollwork',curls,.012,metal,section)
    # Hinge-space origins make later gate rotation straightforward.
    groups[section]['hinge_world_blender']=[side*2.82,-7.35,.35]

# Presentation is separate and excluded from the web asset.
world=bpy.data.worlds.new('Neutral daylight')
scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(.72,.79,.84,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.55
def area(name,loc,power,size,color,target):
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color
    o=bpy.data.objects.new(name,d);collections['99_Presentation'].objects.link(o);o.location=loc
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox',(-18,-15,35),3600,18,(1,.95,.86),(0,7,8))
area('Sky fill',(20,8,29),2500,14,(.84,.91,1),(0,6,8))
sun_data=bpy.data.lights.new('Afternoon sun','SUN');sun_data.energy=2.3;sun_data.angle=.18
sun=bpy.data.objects.new('Afternoon sun',sun_data);collections['99_Presentation'].objects.link(sun)
sun.rotation_euler=(math.radians(28),math.radians(-22),math.radians(-28))
def camera(name,pos,target,lens=48):
    d=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,d);collections['99_Presentation'].objects.link(o)
    o.location=pos;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();d.lens=lens
    d.clip_end=300
    return o
hero=camera('Camera_01_ThreeQuarter',(43,-65,32),(0,6.5,9.0),48)
camera('Camera_02_Front',(0,-76,13),(0,6.0,11.4),47)
camera('Camera_03_FacadeDetail',(22,-21,17),(0,8,11.6),54)
camera('Camera_04_Rear',(-42,55,34),(0,8,9),46)
scene.camera=hero
scene.render.engine='CYCLES'
scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.render.resolution_x=1600;scene.render.resolution_y=1200;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'

# Bottom-center origins plus durable object extras survive glTF export.
bpy.context.view_layer.update()
for o in list(scene.objects):
    if o.type!='MESH':continue
    coords=[v.co.copy() for v in o.data.vertices]
    center=Vector(((min(v.x for v in coords)+max(v.x for v in coords))/2,
                   (min(v.y for v in coords)+max(v.y for v in coords))/2,min(v.z for v in coords)))
    for v in o.data.vertices:v.co-=center
    o.location+=center
    o['reveal_axis']='world_y_gltf'
bpy.context.view_layer.update()
for section in ['entrance_gate_left','entrance_gate_right']:
    g=groups[section];hinge=Vector(g['hinge_world_blender'])
    for child in g.children:child.location-=hinge
    g.location=hinge

for screen in bpy.data.screens:
    for a in screen.areas:
        if a.type=='VIEW_3D':
            a.spaces.active.region_3d.view_distance=62
            a.spaces.active.region_3d.view_location=Vector((0,7,9))
            a.spaces.active.region_3d.view_rotation=hero.rotation_euler.to_quaternion()
            a.spaces.active.clip_end=500
            a.spaces.active.shading.type='MATERIAL'

manifest={'asset':'Sector 6 Mosque, Bhilai','version':1,'units':'metres',
    'accuracy':'Photo-based visual reconstruction; measurements and unseen rear approximate.',
    'blender_up':'Z','gltf_up':'Y','gltf_front':'+Z',
    'excluded':['trees','people','cars','motorcycles','wires','flags','adjacent buildings','loose clutter'],
    'sections':[]}
for name,g in groups.items():
    meshes=[o for o in g.children if o.type=='MESH']
    if not meshes:continue
    pts=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box]
    entry={'id':name,'buildOrder':g['build_order'],'objects':[o.name for o in meshes],
           'boundsBlender':{'min':[min(p[i] for p in pts) for i in range(3)],'max':[max(p[i] for p in pts) for i in range(3)]}}
    manifest['sections'].append(entry)
(OUT/'segments.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
scene.render.filepath=str(OUT/'mosque-three-quarter.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'sector-6-mosque.blend'))
for o in scene.objects:o.select_set(o.type=='MESH' or o==root or o in groups.values())
bpy.ops.export_scene.gltf(filepath=str(OUT/'sector-6-mosque.glb'),export_format='GLB',
    use_selection=True,use_active_scene=True,export_extras=True,export_apply=True,export_yup=True,
    export_cameras=False,export_lights=False,export_texcoords=True,export_normals=True,
    export_materials='EXPORT')
meshes=[o for o in scene.objects if o.type=='MESH']
stats={'objects':len(meshes),'sections':len(manifest['sections']),
       'vertices':sum(len(o.data.vertices) for o in meshes),
       'triangles_base':sum(len(p.vertices)-2 for o in meshes for p in o.data.polygons),
       'blend':str(OUT/'sector-6-mosque.blend'),'glb':str(OUT/'sector-6-mosque.glb')}
(OUT/'build-stats.json').write_text(json.dumps(stats,indent=2),encoding='utf-8')
print(json.dumps(stats))
