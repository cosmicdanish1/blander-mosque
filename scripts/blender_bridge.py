"""Send a Python file or a read-only command to the local Blender MCP add-on."""
import argparse
import json
import socket
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("script", nargs="?")
parser.add_argument("--command", default="get_scene_info")
parser.add_argument("--timeout", type=int, default=600)
args = parser.parse_args()
payload = {"type": args.command}
if args.script:
    code = Path(args.script).read_text(encoding="utf-8")
    wrapped = "import traceback\ntry:\n    exec(compile(" + repr(code) + ", " + repr(args.script) + ", 'exec'))\nexcept Exception:\n    print(traceback.format_exc())\n"
    payload = {"type": "execute_code", "params": {"code": wrapped}}
with socket.create_connection(("127.0.0.1", 9876), timeout=10) as connection:
    connection.settimeout(args.timeout)
    connection.sendall(json.dumps(payload).encode())
    response = bytearray()
    while True:
        chunk = connection.recv(65536)
        if not chunk:
            break
        response.extend(chunk)
        try:
            parsed = json.loads(response)
            if isinstance(parsed.get('result'), dict):
                log = parsed['result'].get('result')
                if isinstance(log, str) and len(log) > 5000:
                    parsed['result']['result'] = '[earlier Blender log omitted]\n' + log[-4000:]
            print(json.dumps(parsed, indent=2))
            break
        except json.JSONDecodeError:
            continue
    else:
        raise RuntimeError("Blender closed the connection without a response")
