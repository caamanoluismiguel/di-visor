# Exporta el 106 del .blend v016 a un GLB por familias de piezas, para DIVISOR.
# No modifica el .blend (se abre y se cierra sin guardar).
# Uso: Blender -b <v016.blend> --python exportar_blend.py -- <salida.glb>
import bpy, re, sys, collections
out = sys.argv[sys.argv.index('--') + 1]
FUERA = ('Context', 'Vegetation', 'V015 Photographic planting', 'V016 Context canopy and palms',
         'V016 Context from supplied views', 'Cameras', 'Lighting', 'Site', 'Entrance')
def fuera(o):
    return any(c.name in FUERA for c in o.users_collection) or o.hide_render \
        or 'inferred inner wall' in o.name or 'atmospheric' in o.name \
        or 'pan and cover tiles' in o.name or 'roof tile courses' in o.name
for o in list(bpy.data.objects):
    if o.type != 'MESH' or fuera(o):
        bpy.data.objects.remove(o, do_unlink=True)
def familia(n):
    n = re.sub(r'([._ ]\d+)+$', '', n)
    n = re.sub(r' \d+-\d+ ', ' ', n)          # ventana 0-3 -> ventana
    n = re.sub(r' L\d( |$)', r'\1', n)         # nivel
    n = re.sub(r' bay\d+', '', n)
    n = re.sub(r'^(street|rear|end|far_end) ', '', n)
    n = re.sub(r'^V01\d ', '', n)
    return n.strip()
grupos = collections.defaultdict(list)
for o in bpy.data.objects:
    grupos[familia(o.name)].append(o)
for fam, objs in grupos.items():
    for o in objs:
        o.data = o.data.copy()
    with bpy.context.temp_override(active_object=objs[0], selected_editable_objects=objs, selected_objects=objs):
        if len(objs) > 1:
            bpy.ops.object.join()
    objs[0].name = fam
    objs[0]['n_piezas'] = len(objs)
print('FAMILIAS', len(grupos))
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_apply=True,
    export_image_format='NONE', export_extras=True, export_yup=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    use_selection=False, export_cameras=False, export_lights=False)
print('LISTO', out)
